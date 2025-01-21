import {Suspense} from 'react';
import SettingsList from '@/components/Settings/SettingList'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from 'next';
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: 'Settings | TailAdmin Next.js',
    description: 'System settings management page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function SettingsPage({searchParams,}: {
    searchParams: { page?: string; group?: string; search?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const {group, search} = searchParams;

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">
                <div className="ms-10">
                    {/*<Breadcrumb pageName="Settings"/>*/}
                </div>
                <Suspense fallback={<Loader/>}>
                    <SettingsList page={page} group={group} search={search}/>
                </Suspense>
            </div>
        </DefaultLayout>
    );
}