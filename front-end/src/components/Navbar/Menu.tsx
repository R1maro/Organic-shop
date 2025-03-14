'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import config from '@/config/config';
import {MenuItem} from "@/types/menuItem";

export default function Menu({ className = 'header-menu' }) {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function fetchMenuItems() {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.API_URL}/menu-items`, {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setMenuItems(data.menu_items || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Failed to load menu items');
                setMenuItems([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMenuItems();
    }, []);

    if (isLoading) {
        return <div className={className}>Loading menu...</div>;
    }

    if (error) {
        return <div className={className}>Menu unavailable</div>;
    }

    return (
        <div className={className}>
            {menuItems.length > 0 ? (
                menuItems.map((item:MenuItem) => (
                    <Link
                        key={item.id}
                        href={item.url || '#'}
                    >
                        {item.name}
                    </Link>
                ))
            ) : (
                <span>No menu items available</span>
            )}
        </div>
    );
}