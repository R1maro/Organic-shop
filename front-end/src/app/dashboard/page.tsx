import ECommerce from "@/components/Dashboard/E-commerce";
import { redirect } from 'next/navigation';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getServerSideAuth } from '@/lib/auth';

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function DashboardPage() {
    const { isAuthenticated } = await getServerSideAuth();

    if (!isAuthenticated) {
        redirect('/auth/signin');
    }
    return (
        <>
            <DefaultLayout>
                <ECommerce />
            </DefaultLayout>
        </>
    );
}
