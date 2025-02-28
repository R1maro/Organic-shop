import {SliderImage} from "@/types/carousel";
import config from "@/config/config";

export const mapSliderImagesToSlides = (sliderImages: SliderImage[]) => {
    return sliderImages.map((slider, index) => {
        const idMatch = slider.key.match(/slider_image_(\d+)/);
        const id = idMatch ? parseInt(idMatch[1]) : index + 1;

        return {
            id,
            label: slider.label || `Slide ${id}`,
            subtitle: '',
            description: '',
            image: slider.image_url
        };
    });
};

export async function getSliderImages() {
    try {
        const response = await fetch(`${config.API_URL}/settings/slider`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch slider images');
        }

        const data = await response.json();

        if (!data.success || !data.data) {
            return [];
        }

        return mapSliderImagesToSlides(data.data);
    } catch (error) {
        console.error('Error fetching slider images:', error);
        return [];
    }
}