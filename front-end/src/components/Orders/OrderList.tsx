import Link from "next/link";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import OrderActions from "@/components/Orders/OrderActions";
import PaymentStatusBadge from "@/components/Orders/PaymentStatusBadge";
import Pagination from "@/components/Pagination/Pagination";
import { Order, PaginatedResponse } from '@/types/order';

interface OrderListProps {
    orders: PaginatedResponse<Order>;
}

export default function OrderList({ orders }: OrderListProps) {
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Order Number
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Customer
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Total
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Status
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Payment
                        </th>
                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.data.map((order: Order) => (
                        <tr key={order.id}>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <Link href={`/dashboard/orders/${order.id}`}>
                                    {order.order_number}
                                </Link>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {order.user.name}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {order.formatted_total_price}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <PaymentStatusBadge status={order.payment_status} />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <OrderActions order={order} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={orders.meta.current_page}
                totalItems={orders.meta.total}
                itemsPerPage={orders.meta.per_page}
                baseUrl="/dashboard/orders"
                showItemCount={true}
            />
        </div>
    );
}