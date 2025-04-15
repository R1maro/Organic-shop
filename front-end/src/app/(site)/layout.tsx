import "@/css/carousel.css";
import "@/css/navbar.css";
import "@/css/benefits.css";
import "@/css/product.css";
import "@/css/footer.css";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from '@/context/AuthContext';
import {CartProvider} from "@/components/Cart/CartContext";

export default function SiteLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <Navbar/>
                    <main>{children}</main>
                    <Toaster position="top-center"/>
                    <Footer/>
                </CartProvider>
            </AuthProvider>
        </>

    );
}