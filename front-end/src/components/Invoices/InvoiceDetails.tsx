// components/Invoices/InvoiceDetails.tsx
import React from 'react';
import Link from 'next/link';
import { Invoice } from "@/types/invoice";

interface InvoiceDetailsProps {
    invoice: Invoice;
}

export default function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="col-span-2 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        Invoice #{invoice.invoice_number}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            invoice.status === 'paid'
                                ? 'bg-success/10 text-success'
                                : invoice.status === 'refunded'
                                    ? 'bg-danger/10 text-danger'
                                    : invoice.status === 'delivered'
                                        ? 'bg-success/10 text-success'
                                        : 'bg-warning/10 text-warning'
                        }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Order Items Table */}
                {invoice.order && (
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
                            {invoice.order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                        <Link
                                            href={`/dashboard/products/${item.product?.id}`}
                                            className="text-black hover:text-primary dark:text-white"
                                        >
                                            {item.product?.name}
                                        </Link>
                                    </td>
                                    <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                        {item.formatted_unit_price}
                                    </td>
                                    <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                        {item.quantity}
                                    </td>
                                    <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                                        {item.formatted_subtotal}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Invoice Summary */}
                <div className="mt-6 flex flex-col items-end gap-3">
                    <div className="flex w-full justify-between sm:w-1/2">
                        <span className="font-medium">Subtotal:</span>
                        <span>{invoice.formatted_subtotal}</span>
                    </div>
                    <div className="flex w-full justify-between sm:w-1/2">
                        <span className="font-medium">Tax:</span>
                        <span>{invoice.formatted_tax}</span>
                    </div>
                    <div className="flex w-full justify-between sm:w-1/2">
                        <span className="font-medium">Shipping:</span>
                        <span>${invoice.shipping_cost}</span>
                    </div>
                    <div className="flex w-full justify-between border-t border-stroke pt-3 sm:w-1/2">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold text-primary">
                            {invoice.formatted_total}
                        </span>
                    </div>
                </div>
            </div>

            {/* Customer and Invoice Details Sidebar */}
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
                                href={`/dashboard/customers/${invoice.user?.id}`}
                                className="text-primary hover:underline"
                            >
                                {invoice.user?.name}
                            </Link>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Email
                            </span>

                            <a
                            href={`mailto:${invoice.user?.email}`}
                            className="text-primary hover:underline"
                            >
                            {invoice.user?.email}
                        </a>
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Address Information
                </h4>
                <div className="space-y-3">
                    <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Shipping Address
                            </span>
                        <p className="text-sm">{invoice.shipping_address}</p>
                    </div>
                    <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Billing Address
                            </span>
                        <p className="text-sm">{invoice.billing_address}</p>
                    </div>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Invoice Details
                </h4>
                <div className="space-y-3">
                    <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Payment Method
                            </span>
                        {invoice.payment_method}
                    </div>
                    <div>
                            <span className="block text-sm font-medium text-black dark:text-white">
                                Due Date
                            </span>
                        {new Date(invoice.due_date).toLocaleDateString()}
                    </div>
                    {invoice.paid_at && (
                        <div>
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    Paid Date
                                </span>
                            {new Date(invoice.paid_at).toLocaleDateString()}
                        </div>
                    )}
                    {invoice.delivered_at && (
                        <div>
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    Delivery Date
                                </span>
                            {new Date(invoice.delivered_at).toLocaleDateString()}
                        </div>
                    )}
                    {invoice.order_id && (
                        <div>
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    Order Reference
                                </span>
                            <Link
                                href={`/dashboard/orders/${invoice.order_id}`}
                                className="text-primary hover:underline"
                            >
                                View Order
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Invoice Actions */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Actions
                </h4>
                <div className="flex flex-col gap-3">
                    <Link
                        href={`/dashboard/invoices/edit/${invoice.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
                    >
                        Edit Invoice
                    </Link>
                    {/*<button*/}
                    {/*    onClick={() => window.print()}*/}
                    {/*    className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-center font-medium text-primary hover:bg-primary hover:text-white"*/}
                    {/*>*/}
                    {/*    Print Invoice*/}
                    {/*</button>*/}
                    {invoice.status === 'pending' && (
                        <Link
                            href={`/dashboard/payments/create?invoice_id=${invoice.id}`}
                            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-center font-medium text-primary hover:bg-primary hover:text-white"
                        >
                            Record Payment
                        </Link>
                    )}
                </div>
            </div>
        </div>
</div>
);
}