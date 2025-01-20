import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import CategoryForm from '@/components/Categories/CategoryForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {apiCreateCategory , getAllCategories} from "@/utils/api";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create Category | TailAdmin Next.js',
    description: 'Create new category page',
};


async function createCategory(formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value || '';

    try {
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            status: formData.get('status') !== null ? 1 : 0,
            parent_id: formData.get('parent_id')?.toString() || null,
        };

        await apiCreateCategory(data, csrfToken);

        revalidatePath('/dashboard/categories');
        redirect('/dashboard/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}
export default async function CreateCategoryPage() {
    const categories = await getAllCategories();
    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
                <CategoryForm action={createCategory} categories={categories} />
            </div>
        </DefaultLayout>
    );
}