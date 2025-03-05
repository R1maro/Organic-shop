'use client';
import React, {useState, useEffect} from 'react';
import {CarouselProps} from "@/types/carousel";
import Slide from "@/components/Carousel/Slide";
import config from "@/config/config";

const Carousel: React.FC<CarouselProps> = ({slides, isPageBackground}) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [autoplayInterval, setAutoplayInterval] = useState(3000);



    useEffect(() => {
        async function fetchAutoplaySpeed() {
            try {
                const response = await fetch(`${config.API_URL}/settings/slider_autoplay_speed`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.value) {
                    setAutoplayInterval(data.value);
                }
            } catch (error) {
                console.error("Error fetching autoplay speed:", error);
            }
        }

        fetchAutoplaySpeed();
    }, []);

    const handlePrevSlide = () => {
        setSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(handleNextSlide, autoplayInterval);
        return () => clearInterval(interval);
    }, [slideIndex, isPaused, autoplayInterval, handleNextSlide]);

    return (
        <section
            className="slidesWrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="slides">
                <button className="prevSlideBtn" onClick={handlePrevSlide}>
                    &#60;
                </button>

                {[...slides, ...slides, ...slides].map((slide, i) => {
                    let offset = slides.length + (slideIndex - i);

                    return (
                        <Slide
                            key={`slide-${i}`}
                            image={slide.image}
                            label={slide.label}
                            subtitle={slide.subtitle}
                            description={slide.description}
                            offset={offset}
                            isPageBackground={isPageBackground}
                        />
                    );
                })}
                <button className="nextSlideBtn" onClick={handleNextSlide}>
                    &#62;
                </button>
            </div>
        </section>
    );
};

export default Carousel;
