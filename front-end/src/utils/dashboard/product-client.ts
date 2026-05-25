import { Product } from "@/types/product";

export async function getTrashedProducts(): Promise<Product[]> {
    try {
        const response = await fetch('/api/products/trashed', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching trashed products:', error);
        return [];
    }
}

export async function restoreProduct(
    id: number
): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const response = await fetch(`/api/products/${id}/restore`, {
            method: 'PATCH',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to restore product');
        }

        return { success: true, data: data.data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
}

export async function forceDeleteProduct(
    id: number
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`/api/products/${id}/force`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || data.error || 'Failed to permanently delete product');
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
}

export async function softDeleteProduct(
    id: number
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || data.error || 'Failed to delete product');
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
}