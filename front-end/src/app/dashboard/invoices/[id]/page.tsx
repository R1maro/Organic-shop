import {notFound} from 'next/navigation';
import InvoiceDetails from '@/components/Invoices/InvoiceDetails';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import {getInvoice} from '@/utils/api';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface InvoicePageProps {
    params: {
        id: string;
    };
}

export const metadata = {
    title: 'Invoice Details - Dashboard',
};

export default async function InvoicePage({params}: InvoicePageProps) {
    let invoice;

    try {
        invoice = await getInvoice(parseInt(params.id));
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return notFound();
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Invoice #${invoice.invoice_number}`}/>

            <div className="flex flex-col gap-10">
                <InvoiceDetails invoice={invoice}/>
            </div>
        </DefaultLayout>
    );
}
