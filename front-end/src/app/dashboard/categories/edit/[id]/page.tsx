import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import CategoryForm from '@/components/Categories/CategoryForm';
import {apiUpdateCategory, getCategories, getCategory} from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Edit Category | TailAdmin Next.js',
    description: 'Edit category page',
};

async function updateCategory(id: string, formData: FormData) {
    'use server'


    try {
        const data = {
            name: formData.get('name')?.toString() || undefined,
            description: formData.get('description')?.toString() || undefined,
            status: formData.get('status') !== null ? 1 : 0,
            parent_id: formData.get('parent_id')?.toString() || null,
        };

        await apiUpdateCategory(id, data);

        revalidatePath('/dashboard/categories');
        redirect('/dashboard/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export default async function EditCategoryPage({
                                                   params: { id },
                                               }: {
    params: { id: string };
}) {
    const [category, categoriesResponse] = await Promise.all([
        getCategory(id),
        getCategories(),
    ]);


    const formCategories = categoriesResponse.data.filter(cat =>
        cat.id.toString() !== id &&
        cat.parent_id?.toString() !== id
    );

    const initialFormData = {
        name: category.data.name,
        description: category.data.description,
        status: Boolean(category.data.status),
        parent_id: category.data.parent?.id
    };

    const updateCategoryWithId = updateCategory.bind(null, id);

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
                <CategoryForm
                    categories={formCategories}
                    action={updateCategoryWithId}
                    initialData={initialFormData}
                />
            </div>
        </DefaultLayout>
    );
}