import OrderForm from "@/components/Orders/OrderForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create Order | TailAdmin Next.js',
    description: 'Create new order page',
};



export default function CreateOrderPage() {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">Create Order</h2>
                </div>
                <OrderForm/>
            </div>
        </DefaultLayout>
    );
}

