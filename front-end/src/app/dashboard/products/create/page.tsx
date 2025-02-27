import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import ProductForm from '@/components/Product/ProductForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {apiCreateProduct } from "@/utils/dashboard/product";
import {getAllCategories} from "@/utils/dashboard/category";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Create Product | TailAdmin Next.js',
    description: 'Create new product page',
};
async function createProductAction(formData: FormData) {
    'use server'


    try {
        const imageFiles = formData.getAll('images[]');
        const data = {

            name: formData.get('name')?.toString() || null,
            description: formData.get('description')?.toString() || null,
            price: parseFloat((formData.get('price') as string)?.replace(/,/g, '')),
            discount: parseFloat((formData.get('discount') as string)?.replace(/,/g, '')) || 0,
            quantity: parseInt(formData.get('quantity') as string),
            sku: formData.get('sku')?.toString() || null,
            category_id: parseInt(formData.get('category_id') as string),
            status: formData.get('status') !== null ? 1 : 0,
            images: imageFiles as File[],
            display_photo_index: formData.get('display_photo_index') || 0,
        };

        await apiCreateProduct(data);

        revalidatePath('/dashboard/products');
        redirect('/dashboard/products');
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export default async function CreateProductPage() {
    const categories = await getAllCategories();

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
                <ProductForm
                    categories={categories}
                    action={async (formData: FormData) => {
                        'use server';
                        await createProductAction(formData);
                    }}
                />
            </div>
        </DefaultLayout>

    );
}