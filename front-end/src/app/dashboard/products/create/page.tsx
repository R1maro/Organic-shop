import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import ProductForm from '@/components/Product/ProductForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import config from "@/config/config";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Create Product | TailAdmin Next.js',
    description: 'Create new product page',
};
async function createProduct(formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    try {
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat((formData.get('price') as string)?.replace(/,/g, '')),
            discount: parseFloat((formData.get('discount') as string)?.replace(/,/g, '')) || 0,
            quantity: parseInt(formData.get('quantity') as string),
            sku: formData.get('sku'),
            category_id: parseInt(formData.get('category_id') as string),
            status: formData.get('status') !== null ? 1 : 0,
        };

        const form = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value.toString());
            }
        });

        const image = formData.get('image') as File;
        if (image && image.size > 0) {
            form.append('image', image);
        }

        const response = await fetch(`${config.API_URL}/admin/products`, {
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
            throw new Error(responseData.error || 'Failed to create product');
        }

        revalidatePath('/dashboard/products');
        redirect('/dashboard/products');
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

async function getCategories() {
    const res = await fetch(`${config.API_URL}/admin/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const response = await res.json();
    return response.data || [];
}

export default async function CreateProductPage() {
    const categories = await getCategories();

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
                <ProductForm
                    categories={categories}
                    action={createProduct}
                />
            </div>
        </DefaultLayout>

    );
}