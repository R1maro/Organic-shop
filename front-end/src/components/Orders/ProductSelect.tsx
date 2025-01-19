'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import config from "@/config/config";

interface ProductSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export default function ProductSelect({ value, onChange }: ProductSelectProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${config.API_URL}/admin/products?status=active`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error instanceof Error ? error.message : 'Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <select disabled className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                <option>Loading products...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select disabled className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input text-danger">
                <option>Error: {error}</option>
            </select>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
        >
            <option value="0">Select a product</option>
            {products.map((product) => (
                <option key={product.id} value={product.id}>
                    {product.name} - ${product.final_price}
                    {product.quantity > 0 ? ` (${product.quantity} in stock)` : ' (Out of stock)'}
                </option>
            ))}
        </select>
    );
}