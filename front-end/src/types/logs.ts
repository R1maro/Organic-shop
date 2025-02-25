export interface LogEntry {
    id: number;
    description: string;
    user:{
        id:number;
        name:string;
        email:string;
    }
    ip: string;
    created_at: string;
    action:string;
}

export interface LogsParams {
    page?: number;
    per_page?: number;
    user_id?: string | number;
    action?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface LogsResponse {
    data: LogEntry[];
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface UserActivityLogsListProps {
    logs: LogsResponse;
}
