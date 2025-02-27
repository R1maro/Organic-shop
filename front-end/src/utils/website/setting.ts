import {SliderImage} from "@/types/carousel";
import config from "@/config/config";

export const mapSliderImagesToSlides = (sliderImages: SliderImage[]) => {
    return sliderImages.map((slider, index) => {
        // Extract a numerical ID from the key (e.g., slider_image_1 -> 1)
        const idMatch = slider.key.match(/slider_image_(\d+)/);
        const id = idMatch ? parseInt(idMatch[1]) : index + 1;

        return {
            id,
            title: slider.value || `Slide ${id}`,
            subtitle: '',
            description: '',
            image: slider.image_url // Use the media URL from the API
        };
    });
};

// Server-side function to fetch slider images
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
        console.log((data));

        if (!data.success || !data.data) {
            return [];
        }

        return mapSliderImagesToSlides(data.data);
    } catch (error) {
        console.error('Error fetching slider images:', error);
        return []; // Return empty array in case of error
    }
}