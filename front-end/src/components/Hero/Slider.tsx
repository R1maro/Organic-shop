import React, { useState, useEffect } from 'react';

interface SliderProps {
    slides: string[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <div className="relative w-4/5 mx-auto mt-4 h-90 rounded overflow-hidden">
            {/* Slides */}
            <div
                className="w-full h-full flex items-center justify-center bg-gray-200"
                style={{
                    backgroundImage: `url(${slides[currentIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute bottom-12 text-center pr-10 w-full text-white">
                    <h2 className="text-4xl font-bold drop-shadow-md">Slide {currentIndex + 1}</h2>
                    <p className="text-lg drop-shadow-md">Caption for slide {currentIndex + 1}.</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
            >
                ❮
            </button>
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-4 rounded-full shadow-md hover:bg-gray-600"
            >
                ❯
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 text-center right-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full me-2.5 ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Slider;
