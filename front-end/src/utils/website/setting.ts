import {SliderImage} from "@/types/carousel";
import config from "@/config/config";



const buildImageUrl = (u?: string | null) => {
    if (!u) return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    const base = config.PUBLIC_URL?.replace(/\/+$/, "") ?? "";
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${base}${path}`;
};
export const mapSliderImagesToSlides = (sliderImages: SliderImage[]) => {
    return sliderImages
        .map((slider, index) => {
            const idMatch = slider.key?.match?.(/slider_image_(\d+)/);
            const id = idMatch ? parseInt(idMatch[1], 10) : index + 1;
            const image = buildImageUrl(slider.image_url);
            return image
                ? {
                    id,
                    label: slider.label || `Slide ${id}`,
                    subtitle: "",
                    description: "",
                    image,
                }
                : null; // drop invalid images
        })
        .filter(Boolean) as Array<{
        id: number;
        label: string;
        subtitle: string;
        description: string;
        image: string;
    }>;
};

export async function getSliderImages(revalidate = 300) {
    try {
        const response = await fetch(`${config.API_URL}/settings/slider`, {
            next: { revalidate },
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch slider images");

        const data = await response.json();
        if (!data?.success || !data?.data) return [];

        return mapSliderImagesToSlides(data.data as SliderImage[]);
    } catch (error) {
        console.error("Error fetching slider images:", error);
        return [];
    }
}

