import {LogsParams} from "@/types/logs";
import {apiClient} from "@/lib/apiClient";

export async function getUserActivityLogs({
                                              page = 1,
                                              per_page = 10,
                                          }: LogsParams = {}) {
    return apiClient(`/admin/user-activity-logs?page=${page}&per_page=${per_page}`, {
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


