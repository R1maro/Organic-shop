import {LogsParams} from "@/types/logs";
import {apiClient} from "@/lib/apiClient";

export async function getUserActivityLogs({
                                              page = 1,
                                              per_page = 10,
                                              user_id,
                                              action,
                                              search,
                                              sort = 'created_at',
                                              order = 'desc',
                                          }: LogsParams = {}) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', per_page.toString());

    if (user_id) params.append('user_id', user_id.toString());
    if (action) params.append('action', action);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);

    return apiClient(`/admin/user-activity-logs?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getUserActivityLog(id: number) {
    return apiClient(`/admin/user-activity-logs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

}

export async function getLogFilterOptions(): Promise<LogFilterOptions> {
    try {
        console.log("Fetching filter options...");
        const response = await apiClient('/admin/log-filter-options', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        return {
            users: response.users || [],
            actions: response.actions || []
        };
    } catch (error) {
        console.error("Error fetching filter options:", error);
        return {
            users: [],
            actions: []
        };
    }
}
export interface LogFilterOptions {
    users: { id: number; name: string }[];
    actions: string[];
}

