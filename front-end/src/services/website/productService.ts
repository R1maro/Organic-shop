import axios from 'axios';
import config from '../../config'; // Adjust this import if necessary

export interface Product {
    id: number;
    name: string;
    price: number;
    discount: number | null;
    image_url: string | null;
}

export const productService = {
    // Fetch products for the website
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const response = await axios.get<Product[]>(`${config.API_URL}/products`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch products');
        }
    }
};
