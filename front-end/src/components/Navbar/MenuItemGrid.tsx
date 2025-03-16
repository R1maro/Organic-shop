'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MenuItem } from "@/utils/dashboard/menu";
import {IconDisplay} from "@/components/Settings/IconSelector";

interface MenuItemGridProps {
    items: MenuItem[];
    allItems: MenuItem[];
}

export default function MenuItemGrid({ items, allItems }: MenuItemGridProps) {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const filteredItems = searchTerm
        ? items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : items;

    if (filteredItems.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-meta-4 rounded-md">
                No menu items found in this group{searchTerm ? ` matching "${searchTerm}"` : ''}.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
                <Link
                    key={item.id}
                    href={`/dashboard/menu-items/edit/${item.id}`}
                    className="block"
                >
                    <div className={`rounded-sm border border-stroke bg-white p-6 shadow-default hover:shadow-lg transition-shadow duration-300 dark:border-strokedark dark:bg-boxdark h-full flex flex-col ${!item.is_active ? 'opacity-60' : ''}`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-20 text-primary mb-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                                <path d="M12 3v6"/>
                            </svg>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl flex gap-3 items-center font-semibold text-black dark:text-white">
                                {item.name}
                                {item.icon && <IconDisplay iconName={item.icon} size={18} />}
                            </h3>
                            {!item.is_active && (
                                <span className="text-xs bg-danger bg-opacity-20 text-danger px-2 py-1 rounded">
                                    Inactive
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-body dark:text-bodydark mb-2 break-all">
                            {item.url}
                        </p>
                        {item.parent_id && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Parent: {allItems.find(parent => parent.id === item.parent_id)?.name || 'Unknown'}
                            </p>
                        )}
                        <div className="mt-auto flex justify-between items-center">
                            <p className="text-sm text-body dark:text-bodydark">
                                Order: {item.order}
                            </p>
                            <span className="text-primary text-sm">Click to edit</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}