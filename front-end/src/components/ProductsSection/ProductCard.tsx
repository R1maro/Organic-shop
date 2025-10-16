'use client';


import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import config from "@/config/config";
import { useCart } from '@/components/Cart/CartContext';
import Image from "next/image";


interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    final_price: number;
    quantity: number;
    shipping_time: string;
    status: number;
    category_id: number;
    display_photo_url: string;
    full_image_url: string;
    formatted_price: string;
    formatted_final_price: string;
}

async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${config.API_URL}/products/last`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const response = await res.json();
    return response.success ? response.data : [];
}

function ensureProtocol(url: string): string {
    if (!url) return '';

    const urlWithoutProtocol = url.replace(/^https?:\/\//, '');

    return `https://${urlWithoutProtocol}`;
}



function SingleProductCard({product}: { product: Product }) {

    const { addItem } = useCart();

    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isAdding) return;

        setIsAdding(true);
        try {
            await addItem(product.id, 1);
        } catch (error) {
            console.error('Failed to add product to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="card my-10">
            <div className="card-img">
                {product.full_image_url ? (
                    <Image
                        src={ensureProtocol(product.full_image_url)}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover"
                        priority
                    />
                ) : (
                    <Image
                        src="https://i.postimg.cc/sgs5xf0d/img.png"
                        alt="Default product image"
                        width={500}
                        height={500}
                        className="object-cover"
                    />
                )}
            </div>
            <div className="card-data">
                <h1 className="card-title">{product.name}</h1>
                <div className="card-price">
                    {product.discount > 0 ? (
                        <>
                            <span className="original-price line-through ">{product.formatted_price}</span>
                            <span className="final-price flex">{product.formatted_final_price}</span>
                        </>
                    ) : (
                        <span>{product.formatted_price}</span>
                    )}
                </div>
                {product.description ? (
                    <>
                        <p className="card-description">
                            Description: {product.description}
                        </p>
                    </>
                ):(
                    <p></p>
                )}
                <p className="card-description">
                    Shipping time: {product.shipping_time}
                </p>
                <div className="flex flex-row gap-2">
                    <Link href={`/products/${product.slug}`} className="card-button">
                        View details
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`card-button ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isAdding ? 'Adding...' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const ProductCard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                if (isMounted) {
                    setProducts(data);
                    setError(null);
                }
            } catch (err) {
                console.error('Error loading products:', err);
                if (isMounted) {
                    setError('Failed to load products');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h2 className="text-title-xl2 text-gray-500 font-bold text-center mb-5">
                Best-selling products
            </h2>
            <div className="container flex flex-wrap gap-5 justify-center">
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <SingleProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;