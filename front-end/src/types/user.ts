export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface UsersResponse {
    data: User[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}