import {getInvoice} from "@/utils/invoice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import {Suspense} from "react";
import InvoiceForm from "@/components/Invoices/InvoiceForm";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditInvoicePage({ params }: PageProps) {
    const invoice = await getInvoice(Number(params.id));

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Edit Invoice #{invoice.id}
                        </h2>
                        <nav>
                            <ol className="flex items-center gap-2">
                                <li>
                                    <Link
                                        href="/dashboard/invoices"
                                        className="font-medium"
                                    >
                                        Invoices
                                    </Link>
                                </li>
                                <li className="text-primary">/</li>
                                <li className="text-primary">Edit</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <Suspense fallback={<div>Loading form...</div>}>
                    <InvoiceForm initialData={invoice} />
                </Suspense>

                {/* Additional Invoice Details or Related Information */}
                <div className="mt-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Related Order Details
                        </h3>
                    </div>
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                                    Order Information
                                </h4>
                                <p className="mb-2">
                                    <span className="font-medium">Order Number:</span>{' '}
                                    <Link
                                        href={`/dashboard/orders/${invoice.order.id}`}
                                        className="text-primary hover:underline"
                                    >
                                        {invoice.order.order_number}
                                    </Link>
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Customer:</span>{' '}
                                    {invoice.user.name}
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Order Status:</span>{' '}
                                    <OrderStatusBadge status={invoice.order.status} />
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                                    Financial Details
                                </h4>
                                <p className="mb-2">
                                    <span className="font-medium">Subtotal:</span>{' '}
                                    ${invoice.subtotal}
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Tax:</span>{' '}
                                    ${invoice.tax}
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Shipping:</span>{' '}
                                    ${invoice.shipping_cost}
                                </p>
                                <p className="mb-2">
                                    <span className="font-medium">Total:</span>{' '}
                                    <span className="text-lg font-bold text-primary">
                                        ${invoice.total}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}