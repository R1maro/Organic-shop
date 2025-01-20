import {Invoice} from "@/types/invoice";

export function InvoiceStatusBadge({status}: { status: Invoice['status'] }) {
    const getStatusColor = () => {
        switch (status) {
            case 'paid':
                return 'bg-success text-white';
            case 'pending':
                return 'bg-warning text-white';
            case 'refunded':
                return 'bg-info text-white';
            case 'delivered':
                return 'bg-success text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
