import {Order} from "@/types/order";
export default function OrderStatusBadge({ status }: { status: Order['status'] }) {
    const colors = {
        pending: 'bg-warning text-warning',
        processing: 'bg-info text-info',
        shipped: 'bg-primary text-primary',
        delivered: 'bg-success text-success',
        cancelled: 'bg-danger text-danger',
    };

    return (
        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    );
}


