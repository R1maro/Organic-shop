import {useNavigate} from "react-router-dom";
import Avatar from '../../images/thunder.jpg'

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end py-3">
                {/* Logo Section */}
                <div className="flex items-center space-x-4">
                    <img
                        src={Avatar}
                        alt="Category 6"
                        className=" rounded-full w-15 h-15"
                    />
                </div>
                {/* Search Bar */}
                <div className="flex-1 mx-20">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="جستجو..."
                            className="w-1/2 py-2 px-10 bg-whiten text-white border border-b-whiter rounded-full focus:outline-none focus:ring-1 focus:ring-gray-600 text-right"
                        />
                        <button className="relative left-6 top-1 text-gray-500 hover:text-red-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m2.35-4.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Icons and Navigation */}
                <div className="flex items-center space-x-4">
                    {/* Login/Signup Button */}
                    <div
                        className="flex items-center border border-gray-300 rounded-md px-4 py-2 mx-5.5 space-x-2 hover:shadow-6 bg-gray cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                        <button onClick={() => navigate('auth/signin')}
                                className="text-gray-700 text-sm font-medium hover:text-red-500">
                            ورود | ثبت ‌نام
                        </button>
                    </div>
                    <div className="font-bold text-center font-medium">
                        <p>
                            |
                        </p>
                    </div>
                    {/* Shopping Cart Button */}
                    <button className="relative text-gray-700 hover:text-red-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                            3
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;