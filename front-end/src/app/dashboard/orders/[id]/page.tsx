import {getOrder} from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import OrderDetails from "@/components/Orders/OrderDetails";

interface PageProps {
    params: {
        id: string;
    };
}


export default async function OrderPage({ params }: PageProps) {
    const order = await getOrder(Number(params.id));

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Order Details
                        </h2>
                        <nav>
                            <ol className="flex items-center gap-2">
                                <li>
                                    <Link href="/dashboard/orders" className="font-medium">
                                        Orders
                                    </Link>
                                </li>
                                <li className="text-primary">/</li>
                                <li className="text-primary">Details</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <OrderDetails order={order} />
            </div>
        </DefaultLayout>
    );
}