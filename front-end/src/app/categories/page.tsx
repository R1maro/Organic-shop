import {Metadata} from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import CategoryList from '@/components/Categories/CategoryList';
import {categoryService} from '@/services/categoryService';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: 'Categories | TailAdmin Next.js',
    description: 'Category management page',
};

export default async function CategoriesPage({searchParams,}: {
    searchParams: { page?: string };
}) {
    const page = Number(searchParams.page) || 1;

    try {
        const categories = await categoryService.getCategories(page);

        return (
            <>
                <DefaultLayout>
                    <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        <div className="mb-6 flex flex-col gap-3">
                            <Breadcrumb pageName="Categories"/>
                            <Link
                                href="/categories/create"
                                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                                Add Category
                            </Link>
                        </div>

                        <div
                            className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                            <CategoryList initialData={categories}/>
                        </div>
                    </div>
                </DefaultLayout>
            </>
        );
    } catch (error) {
        return (
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="rounded-sm border border-stroke bg-white p-4">
                    <p className="text-danger">Error loading categories. Please try again later.</p>
                </div>
            </div>
        );
    }
}