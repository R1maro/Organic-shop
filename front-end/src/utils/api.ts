import config from "@/config/config";
import { UsersResponse} from "@/types/user";
import { CategoriesResponse, SingleCategoryResponse , Category } from "@/types/category";

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
export async function getCategories(page: number = 1) : Promise<CategoriesResponse> {
    const url = new URL(`${config.API_URL}/admin/categories`);
    url.searchParams.append('page', page.toString());

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}

export async function getCategory(id: string): Promise<SingleCategoryResponse> {
    const res = await fetch(`${config.API_URL}/admin/categories/${id}`, {
        headers: {
            'Accept': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category');
    }

    return res.json();
}

export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${config.API_URL}/admin/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    const response = await res.json();
    return response.data || [];
}

export async function apiCreateCategory(data: {
    name: string;
    description: string;
    status: number;
    parent_id: string | null;
}, csrfToken: string) {
    const response = await fetch(`${config.API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create category');
    }

    return responseData;
}

export async function apiUpdateCategory(
    id: string,
    data: {
        name: string | null;
        description: string | null;
        status: number;
        parent_id: string | null;
    },
    csrfToken: string
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            form.append(key, value.toString());
        }
    });

    const response = await fetch(`${config.API_URL}/admin/categories/${id}`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update category');
    }

    return responseData;
}

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

export async function getInvoices({page = 1, per_page = 10, status,}: {
    page?: number;
    per_page?: number;
    status?: string;
}) {
    const url = new URL(`${config.API_URL}/admin/invoices`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    if (status) url.searchParams.append('status', status);

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoices');
    }

    return res.json();
}

export async function getInvoice(id: number) {
    const res = await fetch(`${config.API_URL}/admin/invoices/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoice');
    }

    const response = await res.json();
    return response.data;
}

export async function getUserInvoices(userId: number, page = 1, per_page = 15) {
    const url = new URL(`${config.API_URL}/admin/users/${userId}/invoices`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user invoices');
    }

    return res.json();
}