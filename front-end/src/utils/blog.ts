import {BlogApiListResponse, BlogApiResponse, BlogCreatePayload} from "@/types/blog";
import {apiClient} from "@/lib/apiClient";

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
