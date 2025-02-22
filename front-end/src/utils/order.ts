import { apiClient } from '@/lib/apiClient';
import { PaginatedResponse} from '@/types/order';



export async function getOrders({page = 1, per_page = 10, status, payment_status}: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
}) {
    let endpoint = `/admin/orders?page=${page}&per_page=${per_page}`;

    if (status) endpoint += `&status=${encodeURIComponent(status)}`;
    if (payment_status) endpoint += `&payment_status=${encodeURIComponent(payment_status)}`;

    return await apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<PaginatedResponse<any>>;
}

export async function getOrder(id: number) {
    const response = await apiClient(`/admin/orders/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data;
}

