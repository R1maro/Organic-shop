'use client';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

interface InvoiceFiltersProps {
    initialStatus?: string;
}

export default function InvoiceFilters({ initialStatus }: InvoiceFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [status, setStatus] = useState(initialStatus || '');

    const handleStatusChange = (newStatus: string) => {
        const params = new URLSearchParams(searchParams);

        if (newStatus) {
            params.set('status', newStatus);
        } else {
            params.delete('status');
        }

        router.replace(`${pathname}?${params.toString()}`);
        setStatus(newStatus);
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="w-full md:w-72">
                <label className="mb-2.5 block text-black dark:text-white">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>
        </div>
    );
}