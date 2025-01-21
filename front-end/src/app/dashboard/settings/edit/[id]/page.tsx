import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import SettingForm from '@/components/Settings/SettingForm';
import {apiUpdateSetting, getSettingGroups, getSettingTypes, getSetting} from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Edit Setting | TailAdmin Next.js',
    description: 'Edit setting page',
};

async function updateSettingAction(id: string, formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value || '';

    try {
        const type = formData.get('type')?.toString();
        const imageFile = formData.get('image') as File;

        const data = {
            key: formData.get('key')?.toString(),
            label: formData.get('label')?.toString(),
            description: formData.get('description')?.toString(),
            type: type,
            group: formData.get('group')?.toString(),
            // Only include value if it's not an image type or if no image file is uploaded
            ...(type !== 'image' || !imageFile || imageFile.size === 0
                    ? { value: formData.get('value')?.toString() }
                    : {}
            ),
            // Only include image if it's an image type and a file is uploaded
            ...(type === 'image' && imageFile && imageFile.size > 0
                    ? { image: imageFile }
                    : {}
            ),
        };

        await apiUpdateSetting(id, data, csrfToken);

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