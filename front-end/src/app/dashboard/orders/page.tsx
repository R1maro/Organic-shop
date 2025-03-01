import {Suspense} from 'react';
import Link from "next/link";
import OrderList from "@/components/Orders/OrderList";
import OrderFilters from "@/components/Orders/OrderFilter";
import {getOrders} from "@/utils/dashboard/order";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Orders | TailAdmin Next.js',
    description: 'Orders management page',
};


export default async function OrdersPage({searchParams,}: {
    searchParams: {
        status?: string;
        payment_status?: string;
        page?: string;
        per_page?: string;
    };
}) {
    const page = Number(searchParams.page) || 1;
    const per_page = Number(searchParams.per_page) || 10;
    const status = searchParams.status;
    const payment_status = searchParams.payment_status;

    const orders = await getOrders({page, per_page, status, payment_status});

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6 flex flex-col gap-3">
                    <Link
                        href="/dashboard/orders/create"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Create Order
                    </Link>
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <OrderFilters
                            initialStatus={status}
                            initialPaymentStatus={payment_status}
                        />
                    </Suspense>
                </div>

                <Suspense fallback={<div>Loading orders...</div>}>
                    <OrderList orders={orders}/>
                </Suspense>
            </div>
        </DefaultLayout>
    );
}
