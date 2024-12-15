import axios from 'axios';
import config from '../config';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean;
}

interface CategoryInput {
    name: string;
    description?: string;
    parent_id?: number | null;
    is_active?: boolean;
}

export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        try {
            const response = await axios.get(`${config.API_URL}/admin/categories`);
            return response.data as Category[];
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Category> => {
        try {
            const response = await axios.get(`${config.API_URL}/admin/categories/${id}`);
            return response.data as Category;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: CategoryInput): Promise<Category> => {
        try {
            const response = await axios.post(`${config.API_URL}/admin/categories`, data);
            return response.data as Category;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: CategoryInput): Promise<Category> => {
        try {
            const response = await axios.put(`${config.API_URL}/admin/categories/${id}`, data);
            return response.data as Category;
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
    }
};
