import {OrderItem} from "@/types/order";

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    product_id?: number;
    description?: string;
    quantity: number;
    unit_price: number;
    product?: {
        id: number;
        name: string;
    };
}
export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    invoice_id?: number;
    user: User;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

// types/invoice.ts
export interface Invoice {
    id: number;
    invoice_number: string;
    order_id: number;
    user_id: number;
    shipping_cost: number;
    shipping_address: string;
    billing_address: string;
    formatted_total:string;
    formatted_subtotal:string;
    formatted_tax:string;
    status: 'pending' | 'paid' | 'delivered' | 'refunded';
    payment_method: string;
    due_date: string;
    paid_at: string | null;
    delivered_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    order: Order;
    user: User;
}


export interface InvoicePaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}