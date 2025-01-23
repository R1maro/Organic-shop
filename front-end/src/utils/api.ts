import config from "@/config/config";
import {UsersResponse} from "@/types/user";
import {
    ProductsResponse,
    SingleProductResponse,
    ProductCreateUpdateData
} from '@/types/product';
import {CategoriesResponse, SingleCategoryResponse, Category} from "@/types/category";
import {SettingsResponse} from "@/types/setting";
import {BlogApiData} from '@/types/blog';
import {cookies} from "next/headers";


export async function getUsers(page: number = 1, search: string = '') {
    const url = new URL(`${config.API_URL}/admin/users`);
    url.searchParams.append('page', page.toString());
    if (search) {
        url.searchParams.append('search', search);
    }

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return res.json() as Promise<UsersResponse>;
}

export async function getCategories(page: number = 1): Promise<CategoriesResponse> {
    const url = new URL(`${config.API_URL}/admin/categories`);
    url.searchParams.append('page', page.toString());

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}

export async function getCategory(id: string): Promise<SingleCategoryResponse> {
    const res = await fetch(`${config.API_URL}/admin/categories/${id}`, {
        headers: {
            'Accept': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category');
    }

    return res.json();
}

export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${config.API_URL}/admin/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    const response = await res.json();
    return response.data || [];
}

export async function apiCreateCategory(data: {
    name: string;
    description: string;
    status: number;
    parent_id: string | null;
}, csrfToken: string) {
    const response = await fetch(`${config.API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create category');
    }

    return responseData;
}

export async function apiUpdateCategory(
    id: string,
    data: {
        name: string | null;
        description: string | null;
        status: number;
        parent_id: string | null;
    },
    csrfToken: string
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            form.append(key, value.toString());
        }
    });

    const response = await fetch(`${config.API_URL}/admin/categories/${id}`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update category');
    }

    return responseData;
}


export async function getProducts(page: number = 1, categoryId?: string) {

    const url = new URL(`${config.API_URL}/admin/products`);

    url.searchParams.append('page', page.toString());
    if (categoryId) {
        url.searchParams.append('category_id', categoryId);
    }

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json() as Promise<ProductsResponse>;
}

export async function getProduct(id: string): Promise<SingleProductResponse> {
    const res = await fetch(`${config.API_URL}/admin/products/${id}`, {
        headers: {
            'Accept': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}

export async function apiCreateProduct(data: ProductCreateUpdateData, csrfToken: string) {
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

    const response = await fetch(`${config.API_URL}/admin/products`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create product');
    }

    return responseData;
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


    const response = await fetch(`${config.API_URL}/admin/products/${id}`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update product');
    }

    return responseData;
}

export async function getOrders({page = 1, per_page = 10, status, payment_status}: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
}) {
    const url = new URL(`${config.API_URL}/admin/orders`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    if (status) url.searchParams.append('status', status);
    if (payment_status) url.searchParams.append('payment_status', payment_status);

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }

    return res.json();
}

export async function getOrder(id: number) {
    const res = await fetch(`${config.API_URL}/admin/orders/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch order');
    }

    const response = await res.json();
    return response.data;
}

export async function getInvoices({page = 1, per_page = 10, status,}: {
    page?: number;
    per_page?: number;
    status?: string;
}) {
    const url = new URL(`${config.API_URL}/admin/invoices`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    if (status) url.searchParams.append('status', status);

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoices');
    }

    return res.json();
}

export async function getInvoice(id: number) {
    const res = await fetch(`${config.API_URL}/admin/invoices/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoice');
    }

    const response = await res.json();
    return response.data;
}

export async function getUserInvoices(userId: number, page = 1, per_page = 15) {
    const url = new URL(`${config.API_URL}/admin/users/${userId}/invoices`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page.toString());

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user invoices');
    }

    return res.json();
}

export async function getSettings(page: number = 1, group?: string, search?: string): Promise<SettingsResponse> {
    const url = new URL(`${config.API_URL}/admin/settings`);

    url.searchParams.append('page', page.toString());
    if (group) {
        url.searchParams.append('group', group);
    }
    if (search) {
        url.searchParams.append('search', search);
    }

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch settings');
    }

    return res.json();
}

export async function getSetting(id: string) {
    const response = await fetch(`${config.API_URL}/admin/settings/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch setting');
    }

    return response.json();
}

export async function getSettingGroups() {
    const res = await fetch(`${config.API_URL}/admin/settings/groups`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch setting groups');
    }

    const response = await res.json();
    return response.data as string[];
}

export async function getSettingTypes() {
    const res = await fetch(`${config.API_URL}/admin/settings/types`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch setting types');
    }

    const response = await res.json();
    return response.data as string[];
}


export async function apiCreateSetting(data: any, csrfToken: string) {
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

    const response = await fetch(`${config.API_URL}/admin/settings`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create setting');
    }

    return responseData;
}

export async function apiUpdateSetting(
    id: string,
    data: any,
    csrfToken: string
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

    const response = await fetch(`${config.API_URL}/admin/settings/${id}`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
        },
        body: form,
        credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update setting');
    }

    return responseData;
}

export async function getBlogs(page: number = 1, categoryId?: string): Promise<{
    data: BlogApiData[];
    meta: {
        current_page: number;
        total: number;
        per_page: number;
    };
}> {
    const url = new URL(`${config.API_URL}/admin/blogs`);

    url.searchParams.append('page', page.toString());
    if (categoryId) {
        url.searchParams.append('category_id', categoryId);
    }

    const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await res.json()
    if (!res.ok) {
        throw new Error(response.message || 'Failed to fetch blogs');
    }

    return response;
}


export async function apiCreateBlog(data: BlogApiData) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error('Authentication token is missing');
    }

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

        const response = await fetch(`${config.API_URL}/admin/blogs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message ||
                responseData.error ||
                `Server error: ${response.status}`
            );
        }

        return responseData;
    } catch (error) {
        // Log the complete error
        console.error('API call failed:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }
}

export async function apiUpdateBlog(id: string, data: BlogApiData) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error('Authentication token is missing');
    }

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

        const response = await fetch(`${config.API_URL}/admin/blogs/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message ||
                responseData.error ||
                `Server error: ${response.status}`
            );
        }

        return responseData;
    } catch (error) {
        console.error('API call failed:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }
}


export async function getBlog(id: string) {
    const response = await fetch(`${config.API_URL}/admin/blogs/${id}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch blog');
    }

    return response.json();
}

export async function getAllTags() {
    const res = await fetch(`${config.API_URL}/admin/tags`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tags');
    }

    const response = await res.json();
    return response.data;
}






