import OrderForm from "@/components/Orders/OrderForm";
import {getOrder} from '@/utils/api';
import {notFound} from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Edit Order | TailAdmin Next.js',
    description: 'Edit new order page',
};


export default async function EditOrderPage({params}: { params: { id: string } }) {
    const response = await getOrder(parseInt(params.id));
    const order = response.data;

    if (!order) {
        notFound();
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">Edit Order #{order.order_number}</h2>
                </div>
                <OrderForm initialData={order}/>
            </div>
        </DefaultLayout>
    );
}