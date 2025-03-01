import {getInvoices} from "@/utils/dashboard/invoice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import {Suspense} from "react";
import InvoiceFilters from "@/components/Invoices/InvoiceFilters";
import InvoiceList from "@/components/Invoices/InvoiceList";

export default async function InvoicesPage({searchParams}: {
    searchParams: {
        status?: string;
        page?: string;
        per_page?: string;
    };
}) {
    const page = Number(searchParams.page) || 1;
    const per_page = Number(searchParams.per_page) || 10;
    const status = searchParams.status;

    const invoices = await getInvoices({page, per_page, status});

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6 flex flex-col gap-3">
                    <Link
                        href="/dashboard/invoices/create"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Create Invoice
                    </Link>
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <InvoiceFilters initialStatus={status} />
                    </Suspense>
                </div>

                <Suspense fallback={<div>Loading invoices...</div>}>
                    <InvoiceList invoices={invoices} />
                </Suspense>
            </div>
        </DefaultLayout>
    );
}