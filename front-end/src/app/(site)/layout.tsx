import "@/css/carousel.css";
import "@/css/navbar.css";
import "@/css/benefits.css";
import "@/css/product.css";
import "@/css/footer.css";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function SiteLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar/>
            <main>{children}</main>
            <Footer/>
        </>
    );
}