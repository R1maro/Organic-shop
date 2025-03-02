import { Suspense } from 'react';
import { Metadata } from 'next';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GroupSettingsList from '@/components/Settings/GroupSettingsList';

export async function generateMetadata({ params }: { params: { groupName: string } }): Promise<Metadata> {
    const decodedGroupName = decodeURIComponent(params.groupName);

    return {
        title: `${decodedGroupName} Settings | TailAdmin Next.js`,
        description: `Manage settings for the ${decodedGroupName} group`,
    };
}

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function GroupSettingsPage({
                                                    params,
                                                    searchParams,
                                                }: {
    params: { groupName: string };
    searchParams: { page?: string; search?: string };
}) {
    const decodedGroupName = decodeURIComponent(params.groupName);
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const { search } = searchParams;

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">

                <Suspense fallback={<Loader />}>
                    <GroupSettingsList groupName={decodedGroupName} page={page} search={search} />
                </Suspense>
            </div>
        </DefaultLayout>
    );
}