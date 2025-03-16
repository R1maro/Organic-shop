'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReorderMenuItemsModal from "@/components/Navbar/ReorderMenuItemsModal";
import TrashedMenuItemsModal from "@/components/Navbar/TrashedMenuItemsModal";

interface MenuActionBarProps {
    initialSearch?: string;
}

export default function MenuActionBar({ initialSearch }: MenuActionBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [isTrashedModalOpen, setIsTrashedModalOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }

        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
    }, [searchTerm, pathname, router, searchParams]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    const handleMenuItemsReordered = () => {
        setIsReorderModalOpen(false);
        router.refresh();
    };

    const handleMenuItemRestored = () => {
        router.refresh();
    };

    return (
        <div className="mb-6 flex flex-col gap-3">
            <div className="mb-6 flex flex-row gap-3 flex-wrap">
                <Link
                    href="/dashboard/menu-items/create"
                    className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                    Add Menu Item
                </Link>


                <button
                    onClick={() => setIsReorderModalOpen(true)}
                    className="flex items-center justify-center gap-2.5 rounded-md bg-info py-4 px-10 text-center font-medium text-meta-4 dark:text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m3 16 4 4 4-4"/>
                        <path d="M7 20V4"/>
                        <path d="m21 8-4-4-4 4"/>
                        <path d="M17 4v16"/>
                    </svg>
                    Reorder Items
                </button>

                <button
                    onClick={() => setIsTrashedModalOpen(true)}
                    className="flex items-center justify-center gap-2.5 rounded-md bg-warning py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    Trash Bin
                </button>

                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full rounded-md border border-stroke py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                </div>
            </div>

            <ReorderMenuItemsModal
                isOpen={isReorderModalOpen}
                onClose={() => setIsReorderModalOpen(false)}
                onReordered={handleMenuItemsReordered}
            />

            <TrashedMenuItemsModal
                isOpen={isTrashedModalOpen}
                onClose={() => setIsTrashedModalOpen(false)}
                onRestored={handleMenuItemRestored}
            />
        </div>
    );
}