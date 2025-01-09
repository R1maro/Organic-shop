import axios from 'axios';
import config from '../config';

interface ApiResponse<T> {
    data: T;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean;
    children?: Category[];
}

export interface CategoryInput {
    name: string;
    description?: string | null;
    parent_id?: number | null;
    is_active?: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const categoryService = {
    getAll: async (page: number = 1): Promise<PaginatedResponse<Category>> => {
        try {
            const response = await axios.get<PaginatedResponse<Category>>(`${config.API_URL}/admin/categories`, {
                params: { page },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Category> => {
        try {
            const response = await axios.get<Category>(`${config.API_URL}/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: CategoryInput): Promise<Category> => {
        try {
            const response = await axios.post<ApiResponse<Category>>(`${config.API_URL}/admin/categories`, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<CategoryInput>): Promise<Category> => {
        try {
            const response = await axios.put<ApiResponse<Category>>(`${config.API_URL}/admin/categories/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/categories/${id}`);
        } catch (error) {
            throw error;
        }
    },
};
