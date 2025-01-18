import config from "@/config/config";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

interface UsersResponse {
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
export async function getUsers(page: number = 1, search: string = '') {
    const url = new URL(`${config.API_URL}/admin/users`);
    url.searchParams.append('page', page.toString());
    if (search) {
        url.searchParams.append('search', search);
    }

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return res.json() as Promise<UsersResponse>;
}