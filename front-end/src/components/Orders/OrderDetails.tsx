
import React from 'react';
import Link from 'next/link';
import { Order} from "@/types/order";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import PaymentStatusBadge from "@/components/Orders/PaymentStatusBadge";

interface OrderDetailsProps {
    order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const items = order.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const tax = subtotal * 0.09;
    const total = order.total_price;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="col-span-2 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        Order #{order.order_number}
                    </h3>
                    <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.payment_status} />
                    </div>
                </div>

                {/* Order Items Table */}
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                Product
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Price
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Quantity
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Subtotal
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td className="border-b border-[#eee] text-center py-5 px-4 mx-auto dark:border-strokedark">
                                    <Link
                                        href={`/dashboard/products/${item.product.id}`}
                                        className="text-black hover:text-primary dark:text-white"
                                    >
                                        {item.product.name}
                                    </Link>
                                </td>
                                <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                    ${item.unit_price}
                                </td>
                                <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                    {item.quantity}
                                </td>
                                <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                    ${(item.quantity * item.unit_price)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Summary */}
                <div className="mt-6 flex flex-col items-end gap-3">
                    <div className="flex w-full justify-between sm:w-1/2">
                        <span className="font-medium">Subtotal:</span>
                        <span>${subtotal}</span>
                    </div>
                    <div className="flex w-full justify-between sm:w-1/2">
                        <span className="font-medium">Tax (9%):</span>
                        <span>${tax}</span>
                    </div>
                    <div className="flex w-full justify-between border-t border-stroke pt-3 sm:w-1/2">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold text-primary">
                            ${total}
                        </span>
                    </div>
                </div>
            </div>

            {/* Customer and Order Details Sidebar */}
            <div className="col-span-1 space-y-6">
                {/* Customer Information */}
                <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                        Customer Information
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Name
                            </span>
                            <Link
                                href={`/dashboard/customers/${order.user.id}`}
                                className="text-primary hover:underline"
                            >
                                {order.user.name}
                            </Link>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Email
                            </span>
                            <a
                                href={`mailto:${order.user.email}`}
                                className="text-primary hover:underline"
                            >
                                {order.user.email}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                        Order Details
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Order Date
                            </span>
                            {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        {order.notes && (
                            <div>
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    Notes
                                </span>
                                <p className="text-sm">{order.notes}</p>
                            </div>
                        )}
                        {order.invoice_id && (
                            <div>
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    Invoice
                                </span>
                                <Link
                                    href={`/dashboard/invoices/${order.invoice_id}`}
                                    className="text-primary hover:underline"
                                >
                                    View Invoice
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Actions */}
                <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                        Actions
                    </h4>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/dashboard/orders/edit/${order.id}`}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Edit Order
                        </Link>
                        {!order.invoice_id && (
                            <Link
                                href={`/dashboard/invoices/create?order_id=${order.id}`}
                                className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-center font-medium text-primary hover:bg-primary hover:text-white"
                            >
                                Generate Invoice
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}