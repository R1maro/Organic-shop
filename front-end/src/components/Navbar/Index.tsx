//Start_Navbar
const Index = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
                {/* Logo Section */}
                <div className="flex items-center">
                    <a href="/" className="text-red-500 text-1xl font-bold">
                        Thunder-dev
                    </a>
                </div>
                {/* Search Bar */}
                <div className="flex-1 mx-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for products, brands, and more..."
                            className="w-100 py-1 px-2 bg-blend-color:black border border-gray-600 rounded-full focus:outline-none focus:ring-1 focus:ring-red-300"
                        />
                        <button className="relative right-7 top-1 text-gray-500 hover:text-red-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5">

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
                        className="flex items-center border border-gray-300 rounded-md px-4 py-2 space-x-2 hover:shadow-sm cursor-pointer">
                        {/* Corrected SVG for "Login/Signup" */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                        </svg>

                        <a
                            href="#"
                            className="text-gray-700 text-sm font-medium hover:text-red-500">
                            ورود | ثبت ‌نام
                        </a>
                    </div>
                    <p>
                        |
                    </p>
                    {/* Shopping Cart Button */}
                    <button className="relative text-gray-700 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                        </svg>
                        <span
                            className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                             3
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden px-4 py-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                />
            </div>
        </nav>
    );
};
// End_navbar
export default Index;