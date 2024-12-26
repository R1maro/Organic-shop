import Cover from '../../images/cover/cover-01.png';
import Organic from '../../images/cover/organic.jpg';
import Product from '../../images/product/mahsol.png';

const CategorySale = () => {
    const categories = [Organic, Cover, Organic, Cover, Product, Organic];
    const labels = [
        'آرایشی و بهداشتی',
        'طلا و نقره',
        'مد و پوشاک',
        'لوازم خانگی',
        'کالای دیجیتال',
        'خودرو و سفر',
    ];

    const discounts = ['10%', '15%', '5%', '20%', '25%', '30%'];
    const prices = ['120,000 تومان', '150,000 تومان', '90,000 تومان', '200,000 تومان', '300,000 تومان', '250,000 تومان'];

    const totalItems = 12;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    خرید بر اساس دسته‌بندی
                </h2>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(totalItems)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
                        {/* Discount Badge */}
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {discounts[index % discounts.length]}
                        </div>

                        {/* Category Image */}
                        <div className="flex justify-center items-center mb-4">
                            <img
                                src={categories[index % categories.length]}
                                alt={`Category ${index + 1}`}
                                className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
                            />
                        </div>

                        {/* Category Label */}
                        <h3 className="text-base font-medium text-gray-700">
                            {labels[index % labels.length]}
                        </h3>

                        {/* Price */}
                        <p className="text-gray-800 mt-2 text-sm font-bold">
                            {prices[index % prices.length]}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySale;
