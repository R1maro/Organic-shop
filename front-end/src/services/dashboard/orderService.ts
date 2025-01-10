import axios from 'axios';
import config from '../../config';


interface ApiResponse<T> {
    data: T;
}
export interface OrderItems {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product: {
        name: string;
        sku: string;
    };
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    shipping_address: string;
    billing_address: string | null;
    notes: string | null;
    items: OrderItems[];
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

export interface OrderInput {
    items: {
        product_id: number;
        quantity: number;
    }[];
    shipping_address: string;
    billing_address: string | null;
    payment_method: string;
    notes: string | null;
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const orderService = {
    getAll: async (page: number = 1, status?: string, payment_status?: string): Promise<PaginatedResponse<Order>> => {
        try {
            const response = await axios.get<PaginatedResponse<Order>>(`${config.API_URL}/admin/orders`, {
                params: {
                    page,
                    status,
                    payment_status,
                    per_page: 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Order> => {
        try {

            const response = await axios.get<Order>(`${config.API_URL}/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    create: async (data: OrderInput): Promise<Order> => {
        try {
            const response = await axios.post<ApiResponse<Order>>(`${config.API_URL}/admin/orders`, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<Order>): Promise<Order> => {
        try {
            const response = await axios.put<{message: string, order: Order}>(`${config.API_URL}/admin/orders/${id}`, data);
            return response.data.order;
        } catch (error) {
            console.error('Update request failed:', error);
            throw error;
        }
    },
    // delete method remains the same
    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/orders/${id}`);
        } catch (error) {
            throw error;
        }
    },
};