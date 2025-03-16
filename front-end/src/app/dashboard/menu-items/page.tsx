import { Suspense } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MenuItemsView from "@/components/Navbar/MenuItems";

export const metadata: Metadata = {
    title: 'Menu-Items | TailAdmin Next.js',
    description: 'System menu-items management page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default function SettingsPage({
                                               searchParams,
                                           }: {
    searchParams: { search?: string };
}) {
    const { search } = searchParams;

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">
                <div className="ms-10">
                    <Breadcrumb pageName="Menu-items" />
                </div>
                <Suspense fallback={<Loader />}>
                    <MenuItemsView search={search} />
                </Suspense>
            </div>
        </DefaultLayout>
    );
}