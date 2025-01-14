import axios from 'axios';
import config from '../../config'; // Adjust this import if necessary

export interface Product {
    id: number;
    name: string;
    price: number;
    discount: number | null;
    image_url: string | null;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products: Product[];
}

export const categorySaleService = {
    // Fetch categories with their products
    getCategoriesWithProducts: async (): Promise<Category[]> => {
        try {
            const response = await axios.get<Category[]>(`${config.API_URL}/categories`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch categories with products');
        }
    }
};