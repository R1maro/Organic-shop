import {useNavigate} from 'react-router-dom';
import {FaSearch, FaShoppingCart, FaUserAlt} from 'react-icons/fa';
import Cover from "../../images/thunder.jpg"

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-green-300 shadow-md sticky top-0 z-50">
            {/* Top Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <img
                        src={Cover}
                        alt="Logo"
                        className="w-16 h-16 rounded-full"
                    />
                </div>

                {/* Search Bar */}
                <div className="flex-1 mx-4">
                    <div className="relative w-1/2 left-1/4 mx-auto text-black">
                        <input
                            type="text"
                            placeholder="جستجو..."
                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 text-right"
                        />
                        <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
                            <FaSearch size={20}/>
                        </button>
                    </div>
                </div>

                {/* User and Cart Buttons */}
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    {/* Login/Signup Button */}
                    <button
                        onClick={() => navigate('auth/signin')}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        <FaUserAlt size={18}/>
                        <span>ورود | ثبت ‌نام</span>
                    </button>

                    {/* Shopping Cart Button */}
                    <button className="relative text-gray-700 hover:text-red-500">
                        <FaShoppingCart size={27}/>
                        <span
                            className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">20</span>
                    </button>
                </div>
            </div>

            {/* Bottom Menu Section */}
            <div className="bg-gray-50 py-2 border-t">
                <div className="container mx-auto flex justify-center space-x-8 rtl:space-x-reverse">
                    {['عسل', 'حبوبات', 'حبوبات', 'عسل', 'عسل', 'ادویه جات', 'ادویه جات', 'ادویه جات', 'ادویه جات',].map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className="text-gray-700 hover:text-red-500 transition-colors text-sm font-medium"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
