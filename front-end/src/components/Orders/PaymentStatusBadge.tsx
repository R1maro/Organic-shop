import {Order} from "@/types/order";
export default function PaymentStatusBadge({ status }: { status: Order['payment_status'] }) {
    const colors = {
        pending: 'bg-warning text-warning',
        paid: 'bg-success text-success',
        failed: 'bg-danger text-danger',
        refunded: 'bg-info text-info',
    };

    return (
        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    );
}
