'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductSelect from "@/components/Orders/ProductSelect";
import UserSelect from "@/components/Orders/UserSelect";
import { Order, OrderItem } from '@/types/order';
import config from "@/config/config";

interface OrderFormProps {
    initialData?: Order;
}

export default function OrderForm({ initialData }: OrderFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<number>(initialData?.user_id || 0);

    const [orderItems, setOrderItems] = useState<OrderItem[]>(
        initialData?.items
            ? initialData.items.map(item => ({
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal,
                product: item.product
            }))
            : [{ product_id: 0, quantity: 1 }]
    );


    const [notes, setNotes] = useState(initialData?.notes || '');
    const [status, setStatus] = useState<Order['status']>(initialData?.status || 'pending');
    const [paymentStatus, setPaymentStatus] = useState<Order['payment_status']>(
        initialData?.payment_status || 'pending'
    );



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!userId) {
                throw new Error('Please select a user');
            }
            const endpoint = initialData
                ? `${config.API_URL}/admin/orders/${initialData.id}`
                : `${config.API_URL}/admin/orders`;

            const method = initialData ? 'PUT' : 'POST';

            // Only send necessary data to the API
            const orderItemsData = orderItems
                .filter(item => item.product_id !== 0) // Filter out unselected products
                .map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }));

            // Validate order items before submission
            if (orderItemsData.length === 0) {
                throw new Error('Please add at least one product to the order');
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // Include if using session cookies
                body: JSON.stringify({
                    user_id: userId,
                    items: orderItemsData,
                    notes,
                    status,
                    payment_status: paymentStatus,
                }),
            });

            if (!response.ok) {
                // Try to parse error message from response
                let errorMessage = 'Failed to save order';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // If response isn't JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Show success message
            alert('Order saved successfully!');

            // Redirect back to orders list
            router.push('/dashboard/orders');
            router.refresh();
        } catch (error) {
            console.error('Error saving order:', error);
            alert(error instanceof Error ? error.message : 'Failed to save order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addOrderItem = () => {
        setOrderItems([...orderItems, { product_id: 0, quantity: 1 }]);
    };

    const removeOrderItem = (index: number) => {
        if (orderItems.length > 1) {
            setOrderItems(orderItems.filter((_, i) => i !== index));
        }
    };

    const updateOrderItem = (index: number, field: keyof Pick<OrderItem, 'product_id' | 'quantity'>, value: number) => {
        const newItems = [...orderItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setOrderItems(newItems);
    };

    return (
        <form onSubmit={handleSubmit}
              className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mb-6">
                <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Order Items</h3>
                {orderItems.map((item, index) => (
                    <div key={index} className="mb-4 flex items-center gap-4">
                        <ProductSelect
                            value={item.product_id}
                            onChange={(value) => updateOrderItem(index, 'product_id', value)}
                        />
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-24 rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                        />
                        <button
                            type="button"
                            onClick={() => removeOrderItem(index)}
                            disabled={orderItems.length === 1}
                            className="text-danger hover:text-danger-dark disabled:opacity-50"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addOrderItem}
                    className="mt-2 rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white"
                >
                    Add Item
                </button>
            </div>
            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Customer
                </label>
                <UserSelect
                    value={userId}
                    onChange={setUserId}
                />
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Order Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Order['status'])}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Payment Status
                </label>
                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as Order['payment_status'])}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Notes
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    placeholder="Add any additional notes..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
                {isSubmitting ? 'Saving...' : initialData ? 'Update Order' : 'Create Order'}
            </button>
        </form>
    );
}