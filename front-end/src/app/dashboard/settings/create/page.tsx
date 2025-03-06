import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import SettingForm from '@/components/Settings/SettingForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {apiCreateSetting, getSettingGroups, getSettingTypes} from "@/utils/dashboard/setting";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create Setting | TailAdmin Next.js',
    description: 'Create new setting page',
};

async function createSettingAction(formData: FormData) {
    'use server'


    try {
        const type = formData.get('type')?.toString() || '';
        const imageFile = formData.get('image') as File;
        const isPublicValue = formData.get('is_public')?.toString();
        // The API expects a boolean, not a string
        const isPublic = isPublicValue === 'true';
        const group = formData.get('group');

        const data = {
            key: formData.get('key')?.toString() || '',
            label: formData.get('label')?.toString() || '',
            value: formData.get('value')?.toString() || '',
            type: type,
            description: formData.get('description')?.toString(),
            group: formData.get('group')?.toString() || '',
            is_public: isPublic,
            ...(type === 'image' && imageFile && imageFile.size > 0
                    ? { image: imageFile }
                    : {}
            ),
        };


        await apiCreateSetting(data);

        revalidatePath(`/dashboard/settings/group/${group}`);
        redirect(`/dashboard/settings/group/${group}`);
    } catch (error) {
        console.error('Error creating setting:', error);
        throw error;
    }
}

export default async function CreateSettingPage() {
    const [types, groups] = await Promise.all([
        getSettingTypes(),
        getSettingGroups()
    ]);

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New Setting</h1>
                <SettingForm
                    types={types}
                    groups={groups}
                    action={async (formData: FormData) => {
                        'use server';
                        await createSettingAction(formData);
                    }}
                />
            </div>
        </DefaultLayout>
    );
}