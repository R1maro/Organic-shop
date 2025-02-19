import { getUserActivityLogs } from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Suspense } from "react";
import UserActivityLogsList from "@/components/Logs/UserActivityLogsList";

export default async function LogsPage({searchParams}: {
    searchParams: {
        page?: string;
        per_page?: string;
    };
}) {
    const page = Number(searchParams.page) || 1;
    const per_page = Number(searchParams.per_page) || 10;

    const logs = await getUserActivityLogs({page, per_page});

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-2">
                <Breadcrumb pageName="User Activity Logs" />

                <div className="flex flex-col gap-10">
                    <Suspense fallback={<div>Loading logs...</div>}>
                        <UserActivityLogsList logs={logs} />
                    </Suspense>
                </div>
            </div>
        </DefaultLayout>
    );
}