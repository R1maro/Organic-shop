import Product from '../../images/product/mahsol.png';

const CardsSection = () => {
    const products = [
        { id: 1, name: 'محصول 1', price: '120,000 تومان', discount: '10%' },
        { id: 2, name: 'محصول 2', price: '150,000 تومان', discount: '15%' },
        { id: 3, name: 'محصول 3', price: '90,000 تومان', discount: '5%' },
        { id: 4, name: 'محصول 4', price: '200,000 تومان', discount: '20%' },
        { id: 5, name: 'محصول 5', price: '170,000 تومان', discount: '10%' },
        { id: 6, name: 'محصول 6', price: '300,000 تومان', discount: '25%' },
        { id: 7, name: 'محصول 7', price: '110,000 تومان', discount: '15%' },
        { id: 8, name: 'محصول 8', price: '250,000 تومان', discount: '10%' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Top Section: Product Cards */}
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
                            {product.discount}
                        </div>
                        <img
                            src={Product}
                            alt={product.name}
                            className="mx-auto w-32 h-32 object-cover"
                        />
                        <h3 className="text-lg font-semibold mt-4 text-gray-800">
                            {product.name}
                        </h3>
                        <p className="text-gray-800 mt-2 text-sm font-bold">
                            {product.price}
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
