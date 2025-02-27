import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import SettingForm from '@/components/Settings/SettingForm';
import {apiUpdateSetting, getSettingGroups, getSettingTypes, getSetting} from "@/utils/dashboard/setting";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Edit Setting | TailAdmin Next.js',
    description: 'Edit setting page',
};

async function updateSettingAction(id: string, formData: FormData) {
    'use server'


    try {
        const type = formData.get('type')?.toString() || '';
        const imageFile = formData.get('image') as File;

        const data = {
            key: formData.get('key')?.toString() || '',
            label: formData.get('label')?.toString() || '',
            value: formData.get('value')?.toString() || '',
            description: formData.get('description')?.toString(),
            type: type,
            group: formData.get('group')?.toString() || '',
            ...(type === 'image' && imageFile && imageFile.size > 0
                    ? { image: imageFile }
                    : {}
            ),
        };

        await apiUpdateSetting(id, data);

        revalidatePath('/dashboard/settings');
        redirect('/dashboard/settings');
    } catch (error) {
        console.error('Error updating setting:', error);
        throw error;
    }
}

export default async function EditSettingPage({params: {id},}: {
    params: { id: string };
}) {
    const [settingResponse, types, groups] = await Promise.all([
        getSetting(id),
        getSettingTypes(),
        getSettingGroups()
    ]);

    const setting = settingResponse.data;

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Setting</h1>
                <SettingForm
                    types={types}
                    groups={groups}
                    action={async (formData: FormData) => {
                        'use server';
                        await updateSettingAction(id, formData);
                    }}
                    initialData={setting}
                />
            </div>
        </DefaultLayout>
    );
}