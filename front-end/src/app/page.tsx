import Navbar from "@/components/Navbar/Navbar"
import {Metadata} from "next";
import Carousel from "@/components/Carousel/3D-Carousel";
import {getSliderImages} from "@/utils/website/setting";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

const fallbackSlides = [
    {
        id: 1,
        title: 'First',
        subtitle: 'slide',
        description: 'Praesent ac sem eget est.',
        image: 'https://picsum.photos/id/1/500/500',
    },
    {
        id: 2,
        title: 'Second',
        subtitle: 'slide',
        description: 'Praesent ac sem eget est.',
        image: 'https://picsum.photos/id/234/500/500',
    },
    {
        id: 3,
        title: 'Third',
        subtitle: 'slide',
        description: 'Praesent ac sem eget est.',
        image: 'https://picsum.photos/id/790/500/500',
    },
];
export default async function Index() {

    const slides = await getSliderImages();

    const carouselSlides = slides.length > 0 ? slides : fallbackSlides;
    return (
        <>
            <div>
                <Navbar/>
            </div>

            <div className="carousel-container">
                <Carousel slides={carouselSlides} isPageBackground={true}/>
            </div>
        </>
    );
}