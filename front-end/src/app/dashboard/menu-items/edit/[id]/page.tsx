'use client';

import {useEffect, useState} from "react";
import {getMenuItem , MenuItem} from "@/utils/dashboard/menu";
import MenuItemForm from "@/components/Navbar/MenuItemForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function EditMenuItemPage({params}: { params: { id: string } }) {
    const id = parseInt(params.id);
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const item = await getMenuItem(id);
                setMenuItem(item);
            } catch (err) {
                console.error("Error fetching menu item:", err);
                setError("Failed to load menu item");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItem();
    }, [id]);

    if (isLoading) {
        return (
            <DefaultLayout>
                <div className="mx-auto max-w-screen-xl min-h-screen p-4 md:p-6 2xl:p-10">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (error || !menuItem) {
        return (
            <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
                <div className="p-6 text-center">
                    <div className="text-danger text-xl font-bold mb-2">Error</div>
                    <p className="text-body dark:text-bodydark">
                        {error || "Menu item not found"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <DefaultLayout>
            <MenuItemForm
                initialData={menuItem}
                isEdit={true}
            />
        </DefaultLayout>
    );
}