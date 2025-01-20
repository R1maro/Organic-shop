import React, { useEffect, useState } from 'react';
import { Order} from "@/types/invoice";
import config from "@/config/config";

interface OrderSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export default function OrderSelect({ value, onChange }: OrderSelectProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${config.API_URL}/admin/orders?status=pending&per_page=100`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                // Filter out orders that already have invoices
                const availableOrders = data.data.filter((order: Order) => !order.invoice_id);
                setOrders(availableOrders);
                setIsLoading(false);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch orders');
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <select
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                disabled
            >
                <option>Loading orders...</option>
            </select>
        );
    }

    if (error) {
        return (
            <div className="text-danger">
                Error loading orders: {error}
            </div>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            required
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
        >
            <option value="">Select an Order</option>
            {orders.map((order) => (
                <option key={order.id} value={order.id}>
                    #{order.order_number} - {order.user.name} (${order.total_price})
                </option>
            ))}
            {orders.length === 0 && (
                <option value="" disabled>No available orders found</option>
            )}
        </select>
    );
}