import axios from 'axios';
import config from '../config';

interface OrderItems {
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

interface Order {
    id: number;
    order_number: string;
    user_id: number;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    shipping_address: string;
    billing_address?: string;
    notes?: string;
    items: OrderItems[];
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface OrderInput {
    items: {
        product_id: number;
        quantity: number;
    }[];
    shipping_address: string;
    billing_address?: string;
    payment_method: string;
    notes?: string;
}

export const orderService = {
    getAll: async (): Promise<Order[]> => {
        try {
            const response = await axios.get<{ data: Order[] }>(`${config.API_URL}/admin/orders`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Order> => {
        try {
            const response = await axios.get<{ data: Order }>(`${config.API_URL}/admin/orders/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: OrderInput): Promise<Order> => {
        try {
            const response = await axios.post<{ data: Order }>(`${config.API_URL}/admin/orders`, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<Order>): Promise<Order> => {
        try {
            const response = await axios.put<{ data: Order }>(`${config.API_URL}/admin/orders/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/orders/${id}`);
        } catch (error) {
            throw error;
        }
    },
};