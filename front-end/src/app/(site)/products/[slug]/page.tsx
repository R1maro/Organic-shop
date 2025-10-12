import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductsSection/ProductDetail';
import { getProductBySlug } from '@/utils/website/productService';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} | Your Store Name`,
        description: product.description || `Buy ${product.name} - ${product.formatted_final_price}`,
    };
}

export default async function ProductPage({ params }: Props) {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-gray-50/20">
            <ProductDetail product={product} />
        </div>
    );
}