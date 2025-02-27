import { getUserActivityLogs , getLogFilterOptions  } from "@/utils/dashboard/userActivity";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Suspense } from "react";
import UserActivityLogsList from "@/components/Logs/UserActivityLogsList";
import LogFilters from "@/components/Logs/LogFilters";

export default async function LogsPage({searchParams}: {
    searchParams: {
        page?: string;
        per_page?: string;
        user_id?: string;
        action?: string;
        search?: string;
        sort?: string;
        order?: string;
    };
}) {
    const page = Number(searchParams.page) || 1;
    const per_page = Number(searchParams.per_page) || 10;

    const { user_id, action, search, sort, order } = searchParams;

    const logs = await getUserActivityLogs({
        page,
        per_page,
        user_id,
        action,
        search,
        sort,
        order: order as 'asc' | 'desc',
    });

    let filterOptions;
    try {
        filterOptions = await getLogFilterOptions();

        if (!filterOptions.users || !filterOptions.actions) {
            console.error("Invalid filter options structure:", filterOptions);
            filterOptions = { users: [], actions: [] };
        }
    } catch (error) {
        console.error("Error fetching filter options:", error);
        filterOptions = { users: [], actions: [] };
    }



    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-2">
                <Breadcrumb pageName="User Activity Logs" />

                <div className="flex flex-col gap-6">
                    {/* Filters Component */}
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <LogFilters
                            users={filterOptions.users}
                            actions={filterOptions.actions}
                        />
                    </Suspense>

                    {/* Logs List */}
                    <Suspense fallback={<div>Loading logs...</div>}>
                        <UserActivityLogsList
                            logs={logs}
                            sortField={sort || 'created_at'}
                            sortOrder={order || 'desc'}
                            searchParams={searchParams}
                            pathname="/dashboard/logs"
                        />
                    </Suspense>
                </div>
            </div>
        </DefaultLayout>
    );
}