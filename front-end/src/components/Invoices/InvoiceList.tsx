import {Invoice,PaginatedResponse} from "@/types/invoice";
import Link from "next/link";
import {InvoiceStatusBadge} from "@/components/Invoices/InvoiceStatusBadge";
import {InvoiceActions} from "@/components/Invoices/InvoiceActions";
import Pagination from "@/components/Pagination/Pagination";

interface InvoiceListProps {
    invoices: PaginatedResponse<Invoice>;
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Invoice Number
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Order Number
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Customer
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Subtotal
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Tax
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Total
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Status
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Due Date
                        </th>
                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.data.map((invoice: Invoice) => (
                        <tr key={invoice.id}>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <Link href={`/dashboard/invoices/${invoice.id}`}>
                                    {invoice.invoice_number}
                                </Link>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <Link href={`/dashboard/orders/${invoice.order.id}`}>
                                    {invoice.order.order_number}
                                </Link>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {invoice.user.name}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {invoice.formatted_subtotal}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {invoice.formatted_tax}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {invoice.formatted_total}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <InvoiceStatusBadge status={invoice.status} />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <InvoiceActions invoice={invoice} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={invoices.meta.current_page}
                totalItems={invoices.meta.total}
                itemsPerPage={invoices.meta.per_page}
                baseUrl="/dashboard/invoices"
                showItemCount={true}
            />
        </div>
    );
}