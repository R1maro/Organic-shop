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
                    <main>
                        <div className="min-h-screen mt-15 bg-gradient-to-tr from-slate-900 via-green-100 to-slate-900">
                            {children}
                        </div>
                    </main>
                    <Toaster position="top-center"/>
                    <Footer/>
                </CartProvider>
            </AuthProvider>
        </>

);
}