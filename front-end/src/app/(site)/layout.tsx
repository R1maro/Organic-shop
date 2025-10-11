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
                        <div className="min-h-screen mt-15 bg-gradient-to-br from-slate-900 via-green-100 to-slate-900">
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div
                                    className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                                <div
                                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                                <div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
                            </div>
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