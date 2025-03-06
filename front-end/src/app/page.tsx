import Navbar from "@/components/Navbar/Navbar";
import "@/css/carousel.css";
import "@/css/navbar.css";
import "@/css/benefits.css";
import "@/css/product.css";
import {Metadata} from "next";
import Carousel from "@/components/Carousel/3D-Carousel";
import {getSliderImages} from "@/utils/website/setting";
import Tools from "@/components/Benefits/Tools";
import ProductCard from "@/components/ProductsSection/ProductCard";

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
            <div className="bg-green-100/20">
                <div>
                    <Navbar/>
                </div>

                <div className="carousel-container">
                    <Carousel slides={carouselSlides} isPageBackground={false}/>
                </div>

                <div className="pb-30">
                    <Tools/>
                </div>
                <div className="flex justify-center">
                    <ProductCard/>
                </div>
            </div>
        </>
    );
}