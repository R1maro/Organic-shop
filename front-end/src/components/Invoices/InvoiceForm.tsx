'use client';
import {Invoice} from "@/types/invoice";
import {useRouter} from "next/navigation";
import {useState} from "react";
import config from "@/config/config";
import OrderSelect from "@/components/Invoices/OrderSelect";

interface InvoiceFormProps {
    initialData?: Invoice;
}


export default function InvoiceForm({ initialData }: InvoiceFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<number>(initialData?.order_id || 0);
    const [shippingAddress, setShippingAddress] = useState(initialData?.shipping_address || '');
    const [billingAddress, setBillingAddress] = useState(initialData?.billing_address || '');
    const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || '');
    const [dueDate, setDueDate] = useState(initialData?.due_date || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [status, setStatus] = useState<Invoice['status']>(initialData?.status || 'pending');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!orderId) {
                throw new Error('Please select an order');
            }

            const endpoint = initialData
                ? `${config.API_URL}/admin/invoices/${initialData.id}`
                : `${config.API_URL}/admin/invoices`;

            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    order_id: orderId,
                    shipping_address: shippingAddress,
                    billing_address: billingAddress,
                    payment_method: paymentMethod,
                    due_date: dueDate,
                    notes,
                    status,
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to save invoice';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            await response.json();
            alert('Invoice saved successfully!');
            router.push('/dashboard/invoices');
            router.refresh();

        } catch (error) {
            console.error('Error saving invoice:', error);
            alert(error instanceof Error ? error.message : 'Failed to save invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}
              className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Order
                </label>
                <OrderSelect
                    value={orderId}
                    onChange={setOrderId}
                />
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Shipping Address
                </label>
                <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                />
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Billing Address
                </label>
                <textarea
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                />
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Payment Method
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                    <option value="">Select Payment Method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                    Due Date
                </label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                />
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
                />
            </div>

            {initialData && (
                <div className="mb-6">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Invoice['status'])}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
                {isSubmitting ? 'Saving...' : initialData ? 'Update Invoice' : 'Create Invoice'}
            </button>
        </form>
    );
}