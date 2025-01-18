// app/dashboard/categories/create/page.tsx
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import CategoryForm from '@/components/Categories/CategoryForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import config from "@/config/config";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create Category | TailAdmin Next.js',
    description: 'Create new category page',
};

async function createCategory(formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    try {
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            status: formData.get('status') !== null ? 1 : 0,
        };

        const response = await fetch(`${config.API_URL}/admin/categories`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken || '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to create category');
        }

        revalidatePath('/dashboard/categories');
        redirect('/dashboard/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

export default async function CreateCategoryPage() {
    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
                <CategoryForm action={createCategory} />
            </div>
        </DefaultLayout>
    );
}