"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
        </div>
    );
}