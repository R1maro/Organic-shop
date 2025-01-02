import React, { useState, useEffect } from 'react';

interface SliderProps {
    slides: string[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden mx-4">
            <div
                className="w-full h-full flex items-center justify-center bg-gray-200"
                style={{
                    backgroundImage: `url(${slides[currentIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute bottom-12 text-center w-full text-white px-4">
                    <h2 className="text-5xl font-bold drop-shadow-md"></h2>
                    <p className="text-xl drop-shadow-md"> پیشنهاد ویژه {currentIndex + 1}</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
            >
                ❮
            </button>
            <button
                onClick={goToNext}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
            >
                ❯
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 flex justify-center space-x-2 gap-2 w-full">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-4 h-4 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Slider;
