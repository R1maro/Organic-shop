import CategoryList from '@/components/Categories/CategoryList';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Categories | TailAdmin Next.js',
    description: 'Category management page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function CategoriesPage({
                                                 searchParams,
                                             }: {
    searchParams: { page?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">
                <div className="ms-10">
                    <Breadcrumb pageName="Categories"/>
                </div>
                <Suspense fallback={<Loader/>}>
                    <CategoryList page={page} />
                </Suspense>
            </div>
        </DefaultLayout>
    );
}