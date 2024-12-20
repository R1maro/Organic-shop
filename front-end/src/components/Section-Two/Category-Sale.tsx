import Cover from '../../images/cover/cover-01.png';
import Organic from '../../images/cover/organic.jpg';
import Product from '../../images/product/mahsol.png';

const CategorySale = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Bottom Section: Categories */}
            <div className="text-center mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    خرید بر اساس دسته‌بندی
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {/* Categories */}
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 1"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">آرایشی و بهداشتی</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Cover}
                            alt="Category 2"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">طلا و نقره</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 3"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">مد و پوشاک</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Cover}
                            alt="Category 4"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">لوازم خانگی</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Product}
                            alt="Category 5"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">کالای دیجیتال</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                    <div className="text-center">
                        <img
                            src={Organic}
                            alt="Category 6"
                            className="mx-auto rounded-full w-20 h-20"
                        />
                        <p className="mt-2 text-gray-600">خودرو و سفر</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySale;
