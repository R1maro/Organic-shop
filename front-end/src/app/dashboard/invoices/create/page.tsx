import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InvoiceForm from "@/components/Invoices/InvoiceForm";
export default function CreateInvoicePage() {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">Create Invoice</h2>
                </div>
                <InvoiceForm />
            </div>
        </DefaultLayout>
    );
}