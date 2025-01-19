'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrderFilters({
                                         initialStatus = '',
                                         initialPaymentStatus = ''
                                     }) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (paymentStatus) params.append('payment_status', paymentStatus);
        params.append('page', '1');
        router.push(`/dashboard/orders?${params.toString()}`);
    };

    return (
        <div className="flex gap-4 items-center">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4"
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4"
            >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
            </select>

            <button
                onClick={handleFilter}
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
            >
                Apply Filters
            </button>
        </div>
    );
}