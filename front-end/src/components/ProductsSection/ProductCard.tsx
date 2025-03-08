import React from 'react';
import Link from 'next/link';
import config from "@/config/config";

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

async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${config.API_URL}/products`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const response = await res.json();
    return response.success ? response.data : [];
}

function SingleProductCard({product}: { product: Product }) {
    return (
        <div className="card my-10">
            <div className="card-img">
                {product.full_image_url ? (
                    <img
                        src={product.full_image_url}
                        alt={product.name}
                        width={200}
                        height={200}
                    />
                ) : (
                    <img
                        src="https://i.postimg.cc/sgs5xf0d/img.png"
                        alt="Default product image"
                        width={500}
                        height={500}
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
                <Link href={`/products/${product.slug}`} className="card-button">
                    Buy Now
                </Link>
            </div>
        </div>
    );
}

const ProductCard = async () => {
    let products: Product[] = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }

    return (
        <div>
            <h2 className="text-title-xl2 font-bold text-center mb-5">
                Best-selling products
            </h2>
            <div className="container flex flex-wrap gap-5 justify-center">
                {products.length > 0 ? (
                    products.map((product) => (
                        <SingleProductCard key={product.id} product={product}/>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;