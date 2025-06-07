import {Metadata} from 'next';
import {Suspense} from "react";
import CartPage from "@/components/Cart/CartPage";

export const metadata: Metadata = {
    title: 'Cart | TailAdmin Next.js',
    description: 'User cart page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function UserCartPage({}) {

    return (


        <div className="min-h-screen">

            <Suspense fallback={<Loader/>}>
                <CartPage />
            </Suspense>
        </div>
    )

}