import { Product } from "@/types/product";


export interface OrderItem {
    id?: number;
    product_id: number;
    quantity: number;
    unit_price?: number;
    subtotal?: number;
    product?: Product;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    notes: string;
    items: OrderItem[];
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
}

export interface PaginatedResponse<T> {
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