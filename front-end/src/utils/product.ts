import {apiClient} from "@/lib/apiClient";
import {ProductCreateUpdateData, ProductsResponse, SingleProductResponse} from "@/types/product";

export async function getProducts(page: number = 1, categoryId?: string) {
    let endpoint = `/admin/products?page=${page}`;
    if (categoryId) {
        endpoint += `&category_id=${categoryId}`;
    }

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<ProductsResponse>;
}

export async function getProduct(id: string): Promise<SingleProductResponse> {
    return apiClient(`/admin/products/${id}`, {
        method: 'GET',
        cache: 'no-store',
    });
}

export async function apiCreateProduct(data: ProductCreateUpdateData) {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'price' || key === 'discount') {
                form.append(key, value.toString().replace(/,/g, ''));
            } else if (key === 'images' && Array.isArray(value)) {
                value.forEach((file) => {
                    form.append('images[]', file);
                });
            } else {
                form.append(key, value.toString());
            }
        }
    });


    return apiClient('/admin/products', {
        method: 'POST',
        body: form,
    });
}

export async function apiUpdateProduct(
    id: string,
    data: ProductCreateUpdateData,
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'price' || key === 'discount') {
                form.append(key, value.toString().replace(/,/g, ''));
            } else if (key === 'images' && Array.isArray(value)) {
                form.delete('images[]');
                value.forEach((file, index) => {
                    if (file instanceof File) {
                        console.log(`Appending image ${index}:`, file.name);
                        form.append('images[]', file);
                    }
                });
            } else {
                form.append(key, value.toString());
            }
        }
    });

    return apiClient(`/admin/products/${id}`, {
        method: 'POST',
        body: form,
    });
}

export async function apiDeleteProduct(id: string) {
    return apiClient(`/admin/products/${id}`, {
        method: 'DELETE',
    });
}
