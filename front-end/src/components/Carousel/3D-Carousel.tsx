'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { CarouselProps } from "@/types/carousel";
import Slide from "@/components/Carousel/Slide";
import config from "@/config/config";

const Carousel: React.FC<CarouselProps> = ({ slides, isPageBackground }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [autoplayInterval, setAutoplayInterval] = useState(3000);

    useEffect(() => {
        async function fetchAutoplaySpeed() {
            try {
                const response = await fetch(`${config.API_URL}/settings/slider_autoplay_speed`, {
                    method: "GET",
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.value) {
                    const ms = Number(data.value);
                    if (!Number.isNaN(ms) && ms > 0) setAutoplayInterval(ms);
                }
            } catch (error) {
                console.error("Error fetching autoplay speed:", error);
            }
        }
        fetchAutoplaySpeed();
    }, []);

    const handlePrevSlide = useCallback(() => {
        setSlideIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    const handleNextSlide = useCallback(() => {
        setSlideIndex(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (isPaused) return;
        const id = setInterval(handleNextSlide, autoplayInterval);
        return () => clearInterval(id);
    }, [isPaused, autoplayInterval, handleNextSlide]);

    return (
        <section
            className="slidesWrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="slides">
                <button className="prevSlideBtn" onClick={handlePrevSlide}>&#60;</button>

                {[...slides, ...slides, ...slides].map((slide, i) => {
                    const offset = slides.length + (slideIndex - i);
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

                <button className="nextSlideBtn" onClick={handleNextSlide}>&#62;</button>
            </div>
        </section>
    );
};

export default Carousel;
