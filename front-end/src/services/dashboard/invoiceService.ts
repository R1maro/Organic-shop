import axios from 'axios';
import config from '../../config';

interface ApiResponse<T> {
    data: T;
}

export interface InvoiceItems {
    id: number;
    order_id: number;
    order: {
        order_number: string;
        items: {
            product: {
                name: string;
                sku: string;
            };
            quantity: number;
            unit_price: number;
            subtotal: number;
        }[];
    };
}

export interface Invoice {
    id: number;
    invoice_number: string;
    order_id: number;
    user_id: number;
    subtotal: number;
    tax: number;
    shipping_address:string;
    billing_address:string;
    shipping_cost: number;
    total: number;
    status: 'pending' | 'paid' | 'cancelled' | 'refunded';
    payment_method: string;
    due_date: string | null;
    paid_at: string | null;
    notes: string | null;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    order: InvoiceItems;
}

export interface InvoiceInput {
    order_id: number;
    shipping_address:string;
    billing_address:string;
    payment_method: string;
    due_date?: string;
    notes?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const invoiceService = {
    getAll: async (page: number = 1, status?: string): Promise<PaginatedResponse<Invoice>> => {
        try {
            const response = await axios.get<PaginatedResponse<Invoice>>(`${config.API_URL}/admin/invoices`, {
                params: {
                    page,
                    status,
                    per_page: 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Invoice> => {
        try {
            const response = await axios.get<Invoice>(`${config.API_URL}/admin/invoices/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: InvoiceInput): Promise<Invoice> => {
        console.log('Data being sent to create invoice:', data);
        try {
            const response = await axios.post<ApiResponse<Invoice>>(
                `${config.API_URL}/admin/invoices`, // Correct route for creating an invoice
                data
            );
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<Invoice>): Promise<Invoice> => {
        try {
            const response = await axios.put<{message: string, invoice: Invoice}>(
                `${config.API_URL}/admin/invoices/${id}`,
                data
            );
            return response.data.invoice;
        } catch (error) {
            console.error('Update request failed:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/invoices/${id}`);
        } catch (error) {
            throw error;
        }
    },

    download: async (id: number): Promise<Blob> => {
        try {
            const response = await axios.get(`${config.API_URL}/admin/invoices/${id}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getByOrder: async (orderId: number): Promise<Invoice> => {
        try {
            const response = await axios.get<Invoice>(`${config.API_URL}/admin/orders/${orderId}/invoice`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};