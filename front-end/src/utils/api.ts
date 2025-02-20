import config from "@/config/config";
import {UsersResponse} from "@/types/user";
import {
    ProductsResponse,
    SingleProductResponse,
    ProductCreateUpdateData
} from '@/types/product';
import {CategoriesResponse, SingleCategoryResponse, Category, CategoryFormData} from "@/types/category";
import {SettingCreateUpdateData, SettingsResponse} from "@/types/setting";
import {BlogCreatePayload, BlogApiResponse, BlogApiListResponse} from '@/types/blog';
import {LogsParams} from "@/types/logs";
import {PaginatedResponse} from "@/types/order";
import {InvoicePaginatedResponse} from "@/types/invoice";
import {cookies} from "next/headers";
import {apiClient} from "@/lib/apiClient";


export async function getUsers(page: number = 1, search: string = '') {
    let endpoint = `/admin/users?page=${page}`;
    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return await apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<UsersResponse>;
}

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
    csrfToken: string
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

export async function getOrders({page = 1, per_page = 10, status, payment_status}: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
}) {
    let endpoint = `/admin/orders?page=${page}&per_page=${per_page}`;

    if (status) endpoint += `&status=${encodeURIComponent(status)}`;
    if (payment_status) endpoint += `&payment_status=${encodeURIComponent(payment_status)}`;

    return await apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<PaginatedResponse<any>>;
}

export async function getOrder(id: number) {
    const response = await apiClient(`/admin/orders/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data;
}

export async function getInvoices({page = 1, per_page = 10, status,}: {
    page?: number;
    per_page?: number;
    status?: string;
}) {
    let endpoint = `/admin/invoices?page=${page}&per_page=${per_page}`;

    if (status) endpoint += `&status=${encodeURIComponent(status)}`;

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<InvoicePaginatedResponse<any>>;
}

export async function getInvoice(id: number) {
    const response = await apiClient(`/admin/invoices/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data;
}

export async function getUserInvoices(userId: number, page = 1, per_page = 15) {
    return apiClient(`/admin/users/${userId}/invoices?page=${page}&per_page=${per_page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getSettings(page: number = 1, group?: string, search?: string): Promise<SettingsResponse> {
    let endpoint = `/admin/settings?page=${page}`;

    if (group) {
        endpoint += `&group=${encodeURIComponent(group)}`;
    }

    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getSetting(id: string) {
    return apiClient(`/admin/settings/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getSettingGroups() {
    const response = await apiClient(`/admin/settings/groups`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data as string[];
}

export async function getSettingTypes() {
    const response = await apiClient(`/admin/settings/types`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data as string[];
}


export async function apiCreateSetting(data: SettingCreateUpdateData) {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'image' && value instanceof File) {
                form.append(key, value);
            } else {
                form.append(key, value.toString());
            }
        }
    });


    return apiClient(`/admin/settings`, {
        method: 'POST',
        body: form,
    });
}

export async function apiUpdateSetting(
    id: string,
    data: SettingCreateUpdateData,
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'image' && value instanceof File) {
                form.append(key, value);
            } else {
                form.append(key, value.toString());
            }
        }
    });

    return apiClient(`/admin/settings/${id}`, {
        method: 'POST',
        body: form,
    });
}

export async function apiDeleteSetting(id: string) {
    return apiClient(`/admin/settings/${id}`, {
        method: 'DELETE',
    });
}

export async function getBlogs(page: number = 1,
                               categoryId?: string,
                               status?: string,
                               search?: string
): Promise<BlogApiListResponse> {
    let endpoint = `/admin/blogs?page=${page}`;

    if (categoryId) {
        endpoint += `&category_id=${encodeURIComponent(categoryId)}`;
    }

    if (status) {
        endpoint += `&status=${encodeURIComponent(status)}`;
    }

    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getBlog(id: string) {
    return apiClient(`/admin/blogs/${id}`, {
        method: 'GET',
        cache: 'no-store',
    });
}

export async function apiCreateBlog(data: BlogCreatePayload) {

    const formData = new FormData();
    try {


        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item.toString());
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        return apiClient('/admin/blogs', {
            method: 'POST',
            body: formData,
        });
    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }
}

export async function apiUpdateBlog(id: string, data: Partial<BlogApiResponse>) {

    const formData = new FormData();
    try {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item.toString());
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        formData.append('_method', 'PUT');

        return apiClient(`/admin/blogs/${id}`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function apiDeleteBlog(id: string) {
    return apiClient(`/admin/blogs/${id}`, {
        method: 'DELETE',
    });
}


export async function getAllTags() {
    return apiClient('/admin/tags', {
        method: 'GET',
    });
}

export async function getUserActivityLogs({
                                              page = 1,
                                              per_page = 10,
                                          }: LogsParams = {}) {
    return apiClient(`/admin/user-activity-logs?page=${page}&per_page=${per_page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getUserActivityLog(id: number) {
    return apiClient(`/admin/user-activity-logs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}


