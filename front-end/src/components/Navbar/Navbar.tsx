"use client";
import {useEffect, useState} from 'react';
import Link from 'next/link';
import config from '@/config/config'

const Navbar = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch(`${config.API_URL}/settings/logo/`); // Adjust the path if necessary
                const data = await response.json();
                console.log(data);
                setLogoUrl(data.logo_url || null);
            } catch (error) {
                console.error('Error fetching logo:', error);
            }
        };
        fetchLogo();
    }, []);
    return (
        <>
            {/* Top Section - Scrolls Away */}
            <div className="bg-green-300 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between ">

                    {/* User and Cart Buttons */}
                    <div className="relative text-gray-700 hover:text-gray-400 -left-4">
                        <span
                            className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                        >
                                20
                            </span>
                    </div>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <Link
                            href="/dashboard"
                            className="flex items-center left-2/4 space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 right-1/2 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <span
                                style={{
                                    fontSize: '1.4rem',
                                    marginLeft: '0.5rem',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"

                                     color="#000000" fill="none">
                                    <path
                                        d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                     <path
                                         d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                                         stroke="currentColor" strokeWidth="1.5"/>
                                </svg>
                            </span> {/* Unicode character for login */}
                            <span>ورود | ثبت ‌نام</span>
                        </Link>
                    </div>
                    {/* Search Bar */}
                    <div className="flex-1 mx-4">
                        <div className="relative w-1/2 mx-auto text-black">
                            <input
                                type="text"
                                placeholder="...جستجو"
                                className="w-full py-2 px-4 bg-gray-200 text-gray-700 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 text-right"
                            />
                            <button
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                            >
                                🔍 {/* Unicode character for search */}
                            </button>
                        </div>
                    </div>
                    {/* Logo */}
                    <div className="flex items-center rounded-b">
                        {logoUrl ? (
                            <img
                                src={`${config.PUBLIC_URL}${logoUrl}`}
                                alt="Logo"
                                width={75}
                                height={75}
                            />
                        ) : (
                            <span>Loading Logo...</span>
                        )}
                    </div>

                </div>
            </div>

            {/* Bottom Menu Section - Fixed */}


            <div className="bg-gray-50 py-2 border-t sticky top-0 z-50 shadow-md">
                <div className="container mx-auto flex justify-center space-x-8 rtl:space-x-reverse">

                    {['عسل', 'حبوبات', 'حبوبات', 'عسل', 'عسل', 'ادویه جات', 'ادویه جات', 'ادویه جات', 'ادویه جات'].map((item, index) => (
                        <Link
                            href="/cat-product"
                            key={index}
                            className="text-slate-600 hover:text-green-400 transition-colors text-sm font-medium
                            px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transform hover:scale-105
                            transition-all duration-300 cursor-pointer"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
