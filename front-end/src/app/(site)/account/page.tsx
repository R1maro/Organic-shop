import {Metadata} from 'next';
import {Suspense} from "react";
import AccountPage from "@/components/Account/UserAccount";

export const metadata: Metadata = {
    title: 'Account | TailAdmin Next.js',
    description: 'User account page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function UserAccountPage({}) {

    return (


        <div className="min-h-screen">

            <Suspense fallback={<Loader/>}>
                <AccountPage/>
            </Suspense>
        </div>
    )

}