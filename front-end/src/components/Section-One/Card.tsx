import Product from '../../images/product/mahsol.png';

const CardsSection = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Top Section: Product Cards */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    محصولات پرفروش
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 1"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول اول
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 2"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول دوم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 3"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول سوم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>

                {/* Card 4 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 4"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول چهارم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>
                {/* Card 5 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 4"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول چهارم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>
                {/* Card 6 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 4"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول چهارم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>
                {/* Card 7 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 4"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول چهارم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>
                {/* Card 8 */}
                <div className="bg-whiten rounded-lg shadow-md p-4 text-center">
                    <img
                        src={Product}
                        alt="Product 4"
                        className="mx-auto w-32 h-32 object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        محصول چهارم
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                        توضیحات مختصر برای این محصول
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardsSection;
