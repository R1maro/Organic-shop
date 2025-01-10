import { useEffect, useState } from 'react';
import { productService, Product } from '../../services/website/productService'; // Adjust the path accordingly

const CardsSection = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the products from the API using the service
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsData = await productService.getAllProducts();
            console.log(productsData)
            setProducts(productsData);
        } catch (error) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Call this function when the component mounts
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    محصولات پرفروش
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg border shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {product.discount ? `${product.discount}%` : 'No Discount'}
                        </div>
                        <img
                            src={product.image_url || '/images/default-product.png'}
                            alt={product.name}
                            className="mx-auto w-55 h-45 object-cover"
                        />
                        <h3 className="text-lg font-semibold mt-4 text-gray-800">
                            {product.name}
                        </h3>
                        <p className="text-gray-800 mt-2 text-sm font-bold">
                            {product.price.toLocaleString()} تومان
                        </p>
                        <button className="mt-4 bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                            افزودن به سبد خرید
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsSection;
