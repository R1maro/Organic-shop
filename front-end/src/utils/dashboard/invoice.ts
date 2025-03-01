import {apiClient} from "@/lib/apiClient";
import {InvoicePaginatedResponse} from "@/types/invoice";

export async function getInvoices({page = 1, per_page = 10, status,}: {
    page?: number;
    per_page?: number;
    status?: string;
}) {
    let endpoint = `/admin/invoices?page=${page}&per_page=${per_page}`;

    if (status) endpoint += `&status=${encodeURIComponent(status)}`;

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<InvoicePaginatedResponse<any>>;
}

export async function getInvoice(id: number) {
    const response = await apiClient(`/admin/invoices/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data;
}

export async function getUserInvoices(userId: number, page = 1, per_page = 15) {
    return apiClient(`/admin/users/${userId}/invoices?page=${page}&per_page=${per_page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}
