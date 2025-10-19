import { ProductDetail , Product  } from '@/types/product';
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


export async function getProducts(): Promise<Product[] | null> {
    try {
        const res = await fetch('/api/products', { cache: 'no-store' })


        if (!res.ok) return null

        const response = await res.json()
        return response?.data ?? null
    } catch (error) {
        console.error('Error fetching products:', error)
        return null
    }
}

export async function toggle(productId: number) {

    const response = await fetch(`api/wishlist/toggle/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to toggle wishlist');
    }

    return response.json();
}

export async function getAll() {

    const response = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
    }

    return response.json();
}