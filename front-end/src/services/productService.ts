import axios from 'axios';
import config from '../config';

interface ApiResponse<T> {
    data: T;
}

export interface Media {
    id: number;
    original_url: string;
    preview_url?: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    discount: number | null;
    final_price: number,
    quantity: number;
    category_id: number;
    status: boolean;
    media: Media[];
}

export interface ProductInput {
    name: string;
    description?: string | null;
    price: number;
    discount: number;
    sku: string;
    quantity: number;
    category_id: number;
    status?: boolean;

}
interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const productService = {
    getAll: async (page: number = 1): Promise<PaginatedResponse<Product>> => {
        try {
            const response = await axios.get<PaginatedResponse<Product>>(
                `${config.API_URL}/admin/products`,
                {
                    params: {
                        page,
                        per_page: 10,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Product> => {
        try {
            const response = await axios.get<Product>(`${config.API_URL}/admin/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: ProductInput | FormData): Promise<Product> => {
        try {
            const response = await axios.post<ApiResponse<Product>>(`${config.API_URL}/admin/products`, data, {
                headers: data instanceof FormData ? {'Content-Type': 'multipart/form-data'} : {},
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: ProductInput | FormData): Promise<Product> => {
        try {
            if (data instanceof FormData) {
                data.append('_method', 'PUT');
                const response = await axios.post<{ message: string , product: Product }>(`${config.API_URL}/admin/products/${id}`, data, {
                    headers: {'Content-Type': 'multipart/form-data'},
                });
                return response.data.product;
            } else {
                const response = await axios.put<{ message: string, product: Product }>(`${config.API_URL}/admin/products/${id}`, data);
                return response.data.product;
            }
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/products/${id}`);
        } catch (error) {
            throw error;
        }
    },
};

