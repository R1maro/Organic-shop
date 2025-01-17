// app/products/page.tsx
import {Suspense} from 'react';
import ProductList from '@/components/Product/ProductList'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: 'Products | TailAdmin Next.js',
    description: 'Product management page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}


export default async function ProductsPage({searchParams,}: {
    searchParams: { page?: string; category_id?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const categoryId = searchParams.category_id;

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">
                <div className="ms-10">
                    <Breadcrumb pageName="Products"/>
                </div>
                <Suspense fallback={<Loader/>}>
                    <ProductList page={page} categoryId={categoryId}/>
                </Suspense>
            </div>
        </DefaultLayout>
    );
}