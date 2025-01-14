import { useEffect, useState } from 'react';
import { categorySaleService ,Category  } from '../../services/website/categorySaleService.ts'; // Adjust the path as needed

const CategorySale = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await categorySaleService.getCategoriesWithProducts();
                console.log(data)
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    خرید بر اساس دسته‌بندی
                </h2>
            </div>

            {/* Categories Grid */}
            {categories.map((category) => (
                <div key={category.id} className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {category.products.map((product: any) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg border border-gray-200 shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
                            >
                                {/* Product Image */}
                                <div className="flex justify-center items-center mb-4">
                                    <img
                                        src={product.image_url || 'default-product-image.jpg'}
                                        alt={product.name}
                                        className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
                                    />
                                </div>

                                {/* Product Name */}
                                <h4 className="text-sm font-medium text-gray-700">
                                    {product.name}
                                </h4>

                                {/* Product Price */}
                                <p className="text-gray-800 mt-2 text-sm font-bold">
                                    {product.price ? `${product.price} تومان` : 'قیمت موجود نیست'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategorySale;
