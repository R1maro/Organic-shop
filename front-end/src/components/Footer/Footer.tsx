import { useEffect, useState } from 'react';
import { FaTelegramPlane, FaArrowUp, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('footer');
            // @ts-ignore
            const footerPosition = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            setShowButtons(footerPosition < windowHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-green-800 text-white pt-10 pb-6 px-4 rtl relative">
            {/* Top section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Us Section */}
                <div>
                    <h2 className="text-xl font-bold mb-3">درباره ی ما</h2>
                    <p className="text-gray-300 text-sm">
                        Organic Shop is your go-to marketplace for fresh, organic, and sustainably sourced products. We believe in healthy living and supporting local farmers.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-bold mb-3">دسترسی سریع</h2>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-green-400 transition-colors">خانه</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">فروشگاه</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">خانه</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">فروشگاه</a></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h2 className="text-xl font-bold mb-3">خدمات مشتری</h2>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-green-400 transition-colors">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-green-400 transition-colors">FAQs</a></li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div>
                    <div className="grid space-y-4 text-2xl">
                        <a href="#" className="hover:text-green-400 transition-colors"><FaFacebook /></a>
                        <a href="#" className="hover:text-green-400 transition-colors"><FaTwitter /></a>
                        <a href="#" className="hover:text-green-400 transition-colors"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-gray-700"></div>

            {/* Bottom section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Organic Shop. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-green-400 transition-colors text-sm">Privacy Policy</a>
                    <a href="#" className="hover:text-green-400 transition-colors text-sm">Terms of Service</a>
                </div>
            </div>

            {/* Scroll to top and Telegram button */}
            {showButtons && (
                <div className="flex justify-between fixed bottom-4 w-full px-4">
                    <button onClick={scrollToTop} className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110">
                        <FaArrowUp className="w-5 h-5" />
                    </button>
                    <a href="https://t.me/support" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110">
                        <FaTelegramPlane className="w-5 h-5" />
                    </a>
                </div>
            )}
        </footer>
    );
};

export default Footer;
