import config from "@/config/config";
import { UsersResponse} from "@/types/user";

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

export async function getOrders({page = 1, per_page = 15, status, payment_status}: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
}) {
    const url = new URL(`${config.API_URL}/admin/orders`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    if (status) url.searchParams.append('status', status);
    if (payment_status) url.searchParams.append('payment_status', payment_status);

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }

    return res.json();
}

export async function getOrder(id: number) {
    const res = await fetch(`${config.API_URL}/admin/orders/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch order');
    }

    const response = await res.json();
    return response.data;
}