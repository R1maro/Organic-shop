import { ProductDetail } from '@/types/product';
import config from '@/config/config';

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
    try {
        const res = await fetch(`${config.API_URL}/products/${slug}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            return null;
        }

        const response = await res.json();
        return response.success ? response.data : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}