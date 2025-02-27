import {CategoriesResponse, Category, CategoryFormData, SingleCategoryResponse} from "@/types/category";
import {apiClient} from "@/lib/apiClient";

export async function getCategories(page: number = 1): Promise<CategoriesResponse> {
    return apiClient(`/admin/categories?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getCategory(id: string): Promise<SingleCategoryResponse> {
    return apiClient(`/admin/categories/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getAllCategories(): Promise<Category[]> {
    const response = await apiClient(`/admin/categories`, {
        method: 'GET',
        cache: 'no-store',
    });

    return response.data || [];
}

export async function apiCreateCategory(data: CategoryFormData) {
    return apiClient(`/admin/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    });
}

export async function apiUpdateCategory(
    id: string,
    data: Partial<CategoryFormData>
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            form.append(key, value.toString());
        }
    });

    return apiClient(`/admin/categories/${id}`, {
        method: 'POST',
        body: form,
    });
}
