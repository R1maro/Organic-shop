import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import ProductForm from '@/components/Product/ProductForm';
import {apiUpdateProduct , getCategories , getProduct} from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import {ProductApiData, ProductFormData} from "@/types/product";


export const metadata: Metadata = {
    title: 'Edit Product | TailAdmin Next.js',
    description: 'Edit new product page',
};
async function updateProductAction(id: string, formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value || '';

    try {
        const imageFiles = formData.getAll('images[]');



        const data: ProductApiData = {
            name: formData.get('name')?.toString() || '',
            description: formData.get('description')?.toString() || '',
            price: parseFloat((formData.get('price') as string)?.replace(/,/g, '') || '0'),
            discount: parseFloat((formData.get('discount') as string)?.replace(/,/g, '') || '0'),
            quantity: parseInt(formData.get('quantity') as string || '0'),
            sku: formData.get('sku')?.toString() || '',
            category_id: parseInt(formData.get('category_id') as string || '0'),
            status: formData.get('status') !== null ? 1 : 0,
            images:imageFiles as File[],
        };

        await apiUpdateProduct(id, data, csrfToken);

        revalidatePath('/dashboard/products');
        redirect('/dashboard/products');
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export default async function EditProductPage({params: {id},}: {
    params: { id: string };
}) {
    const [productResponse, categoriesResponse] = await Promise.all([
        getProduct(id),
        getCategories(),
    ]);

    const formCategories = categoriesResponse.data;
    const product = productResponse.data;

    const initialFormData: ProductFormData = {
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        sku: product.sku || '',
        category_id: product.category.id || 0,
        status: product.status === 1,
        image_urls: product.image_urls || ''
    };


    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                <ProductForm
                    categories={formCategories}
                    action={async (formData: FormData) => {
                        'use server';
                        await updateProductAction(id, formData);
                    }}                    initialData={initialFormData}
                />
            </div>
        </DefaultLayout>
    );
}