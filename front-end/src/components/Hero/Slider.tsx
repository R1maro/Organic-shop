// components/Hero/Slider.tsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../services/website/useSettings';

const Slider: React.FC = () => {
    const { getValue, loading, error } = useSettings();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get slider images
    const sliderImages = [
        getValue('slider_image_1'),
        getValue('slider_image_2'),
        getValue('slider_image_3'),
    ].filter(Boolean);

    // Get slider settings
    const autoplaySpeed = getValue('slider_autoplay_speed', 6000);
    const showNavigation = getValue('slider_show_navigation', true);
    const showIndicators = getValue('slider_show_indicators', true);

    useEffect(() => {
        if (autoplaySpeed > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
            }, autoplaySpeed);

            return () => clearInterval(interval);
        }
    }, [sliderImages.length, autoplaySpeed]);

    if (loading) {
        return <div className="w-full h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
    }

    if (error || sliderImages.length === 0) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-red-500">خطا در بارگذاری اسلایدر</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden mx-4">
            <div
                className="w-full h-full flex items-center justify-center bg-gray-200"
            >
                <img
                    rel="preload"
                    src={`${sliderImages[currentIndex]}`}
                    alt="#"
                    className="h-full w-full object-cover"
                />
                {/* Slider content */}
            </div>

            {/* Navigation Buttons */}
            {showNavigation && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % sliderImages.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
                    >
                        ❯
                    </button>
                </>
            )}

            {/* Slide Indicators */}
            {showIndicators && (
                <div className="absolute bottom-4 flex justify-center gap-2 w-full">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-4 rounded-full ${
                                index === currentIndex ? 'bg-white' : 'bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;