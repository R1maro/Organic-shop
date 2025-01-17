import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import ProductForm from '@/components/Product/ProductForm';
import config from "@/config/config";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Products | TailAdmin Next.js',
    description: 'Product management page',
};
async function getProduct(id: string) {
    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    const res = await fetch(`${config.API_URL}/admin/products/${id}`, {
        headers: {
            'X-XSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error( 'Failed to fetch product');
    }

    return res.json();
}

async function updateProduct(id: string, formData: FormData) {
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


        form.append('_method', 'PUT');

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value.toString());
            }
        });

        const image = formData.get('image') as File;
        if (image && image.size > 0) {
            form.append('image', image);
        }

        const response = await fetch(`${config.API_URL}/admin/products/${id}`, {
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
            throw new Error(responseData.error || 'Failed to update product');
        }

        revalidatePath('/products');
        redirect('/products');
    } catch (error) {
        console.error('Error updating product:', error);
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


export default async function EditProductPage({params: {id},}: {
    params: { id: string };
}) {
    const [product, categories] = await Promise.all([
        getProduct(id),
        getCategories(),
    ]);

    const updateProductWithId = updateProduct.bind(null, id);

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                <ProductForm
                    categories={categories}
                    action={updateProductWithId}
                    initialData={product}
                />
            </div>
        </DefaultLayout>
    );
}