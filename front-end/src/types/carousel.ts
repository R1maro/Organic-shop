export interface SlideProps {
    image: string;
    title?: string;
    subtitle?: string;
    description?: string;
    offset: number;
    isPageBackground?: boolean;
}

export interface SlideData {
    id: number;
    image: string;
    title?: string;
    subtitle?: string;
    description?: string;
}

export interface CarouselProps {
    slides: SlideData[];
    isPageBackground?: boolean;
}