"use client";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body suppressHydrationWarning={true}>
        {children}
        </body>
        </html>
    );
}