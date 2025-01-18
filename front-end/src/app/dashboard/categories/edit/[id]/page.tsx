// app/dashboard/categories/edit/[id]/page.tsx
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import CategoryForm from '@/components/Categories/CategoryForm';
import config from "@/config/config";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Edit Category | TailAdmin Next.js',
    description: 'Edit category page',
};

type Category = {
    id: string;
    name: string;
    description: string;
    status: boolean;
};

async function getCategory(id: string): Promise<Category> {
    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    const res = await fetch(`${config.API_URL}/admin/categories/${id}`, {
        headers: {
            'X-XSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category');
    }

    return res.json();
}

async function updateCategory(id: string, formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    try {
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            status: formData.get('status') !== null ? 1 : 0,
        };

        const form = new FormData();
        form.append('_method', 'PUT');

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value.toString());
            }
        });

        const response = await fetch(`${config.API_URL}/admin/categories/${id}`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken || '',
                'Accept': 'application/json',
            },
            body: form,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to update category');
        }

        revalidatePath('/dashboard/categories');
        redirect('/dashboard/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export default async function EditCategoryPage({
                                                   params: {id},
                                               }: {
    params: { id: string };
}) {
    const category = await getCategory(id);
    const updateCategoryWithId = updateCategory.bind(null, id);

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
                <CategoryForm
                    action={updateCategoryWithId}
                    initialData={category}
                />
            </div>
        </DefaultLayout>
    );
}