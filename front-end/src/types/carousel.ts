export interface SlideProps {
    image: string;
    label?: string;
    subtitle?: string;
    description?: string;
    offset: number;
    isPageBackground?: boolean;
}

export interface SlideData {
    id: number;
    image: string;
    label?: string;
    subtitle?: string;
    description?: string;
}
export interface SliderImage {
    key: string;
    value: string;
    label:string;
    image_url: string;
}

export interface CarouselProps {
    slides: SlideData[];
    isPageBackground?: boolean;
}
