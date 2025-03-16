'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconSelector, IconDisplay } from '@/components/Settings/IconSelector';
import {
    MenuItem,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemActive
} from "@/utils/dashboard/menu";

interface MenuItemFormProps {
    initialData?: MenuItem;
    isEdit?: boolean;
}

export default function MenuItemForm({ initialData, isEdit = false }: MenuItemFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        url: initialData?.url || '',
        icon: initialData?.icon || '',
        order: initialData?.order?.toString() || '',
        parent_id: initialData?.parent_id?.toString() || '',
        is_active: initialData?.is_active ?? true,
    });

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showIconSelector, setShowIconSelector] = useState<boolean>(false);
    const [deleteOptions, setDeleteOptions] = useState({
        isOpen: false,
        strategy: 'delete' as 'delete' | 'orphan' | 'promote',
    });

    useEffect(() => {
        const fetchMenuItems = async () => {
            setIsLoading(true);
            try {
                const items = await getMenuItems();
                const filteredItems = isEdit && initialData
                    ? items.filter(item => item.id !== initialData.id)
                    : items;
                setMenuItems(filteredItems);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Failed to load menu items for selection');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, [isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleIconSelect = (iconName: string) => {
        setFormData(prev => ({
            ...prev,
            icon: iconName
        }));
        setShowIconSelector(false);
    };

    const clearIcon = () => {
        setFormData(prev => ({
            ...prev,
            icon: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const apiData = {
            ...formData,
            order: formData.order ? parseInt(formData.order) : undefined,
            parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
        };

        let result;

        if (isEdit && initialData) {
            result = await updateMenuItem(initialData.id, apiData);
        } else {
            result = await createMenuItem(apiData);
        }

        if (result.success) {
            setSuccess(`Menu item ${isEdit ? 'updated' : 'created'} successfully!`);

            if (!isEdit) {
                setFormData({
                    name: '',
                    url: '',
                    order: '',
                    parent_id: '',
                    is_active: true,
                    icon: ''
                });
            }

            if (isEdit) {
                setTimeout(() => {
                    router.push('/dashboard/menu-items');
                }, 1500);
            }
        } else {
            setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} menu item`);
        }

        setIsSubmitting(false);
    };

    const handleToggleActive = async () => {
        if (!isEdit || !initialData) return;

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const result = await toggleMenuItemActive(initialData.id);

        if (result.success) {
            setSuccess(`Menu item ${result.isActive ? 'activated' : 'deactivated'} successfully!`);
            setFormData(prev => ({
                ...prev,
                is_active: result.isActive ?? prev.is_active
            }));
        } else {
            setError(result.error || 'Failed to toggle menu item status');
        }

        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        if (!isEdit || !initialData) return;

        setIsSubmitting(true);
        setError(null);

        const result = await deleteMenuItem(initialData.id, deleteOptions.strategy);

        if (result.success) {
            router.push('/dashboard/menu-items');
        } else {
            setError(result.error || 'Failed to delete menu item');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-screen-lg p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-black dark:text-white">
                    {isEdit ? 'Edit Menu Item' : 'Create Menu Item'}
                </h2>
                <nav>
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link
                                href="/dashboard"
                                className="font-medium text-primary"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="text-body dark:text-bodydark">/</li>
                        <li>
                            <Link
                                href="/dashboard/menu-items"
                                className="font-medium text-primary"
                            >
                                Menu Items
                            </Link>
                        </li>
                        <li className="text-body dark:text-bodydark">/</li>
                        <li className="text-body dark:text-bodydark">
                            {isEdit ? 'Edit' : 'Create'}
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                    <h3 className="font-semibold text-black dark:text-white">
                        Menu Item Details
                    </h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {error && (
                            <div className="mb-5 rounded-md bg-danger bg-opacity-10 px-4 py-3 text-danger">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-5 rounded-md bg-success bg-opacity-10 px-4 py-3 text-success">
                                {success}
                            </div>
                        )}

                        <div className="mb-5">
                            <label htmlFor="name" className="mb-2 block text-black dark:text-white">
                                Menu Item Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter menu item name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="icon" className="mb-2 block text-black dark:text-white">
                                Icon
                            </label>
                            <div className="flex gap-3 items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowIconSelector(true)}
                                    className="flex items-center gap-2 rounded border border-stroke bg-white py-3 px-4 text-black hover:bg-gray-100 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-10"
                                >
                                    {formData.icon ? (
                                        <>
                                            <IconDisplay iconName={formData.icon} size={20} />
                                            <span>{formData.icon}</span>
                                        </>
                                    ) : (
                                        "Select an icon"
                                    )}
                                </button>

                                {formData.icon && (
                                    <button
                                        type="button"
                                        onClick={clearIcon}
                                        className="rounded border border-stroke bg-white py-3 px-4 text-black hover:bg-gray-100 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-10"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Optional. Select an icon to display with the menu item.
                            </p>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="url" className="mb-2 block text-black dark:text-white">
                                URL <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="url"
                                name="url"
                                placeholder="Enter URL (e.g., /products or https://example.com)"
                                value={formData.url}
                                onChange={handleChange}
                                required
                                className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                For internal links, use relative paths like '/products'. For external links, use the full URL including 'https://'.
                            </p>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="order" className="mb-2 block text-black dark:text-white">
                                Display Order
                            </label>
                            <input
                                type="number"
                                id="order"
                                name="order"
                                placeholder="Enter display order (leave blank for auto)"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Controls the order in which menu items appear. Lower numbers appear first.
                            </p>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="parent_id" className="mb-2 block text-black dark:text-white">
                                Parent Menu Item
                            </label>
                            <select
                                id="parent_id"
                                name="parent_id"
                                value={formData.parent_id}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            >
                                <option value="">None (Top Level)</option>
                                {isLoading ? (
                                    <option disabled>Loading menu items...</option>
                                ) : (
                                    menuItems.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Optional. Select a parent to create a hierarchical menu structure.
                            </p>
                        </div>

                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2 h-5 w-5 rounded border border-stroke bg-transparent text-primary focus:border-primary focus:ring-primary dark:border-strokedark"
                            />
                            <label htmlFor="is_active" className="text-black dark:text-white">
                                Active (visible in navigation)
                            </label>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70"
                                disabled={isSubmitting}
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
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                {isSubmitting ? 'Saving...' : isEdit ? 'Update Menu Item' : 'Create Menu Item'}
                            </button>

                            {isEdit && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleToggleActive}
                                        className={`flex items-center justify-center gap-2.5 rounded-md ${formData.is_active ? 'bg-warning' : 'bg-success'} py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70`}
                                        disabled={isSubmitting}
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
                                            {formData.is_active ? (
                                                <path d="M18.6 2.4a9.9 9.9 0 0 0-3.5-.3c-9.2.4-11.3 11.3-11.3 11.3s5.3-2 8.6-.4" />
                                            ) : (
                                                <path d="M2 12s5.4-5.4 12-5.4c4 0 7.4 2 9.3 3.5" />
                                            )}
                                            <path d="M22 12s-5.4 5.4-12 5.4a13 13 0 0 1-5-1" />
                                            <path d="M18 22a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                                            {!formData.is_active && (
                                                <line x1="14.5" y1="17.5" x2="21.5" y2="17.5" />
                                            )}
                                        </svg>
                                        {formData.is_active ? 'Deactivate' : 'Activate'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteOptions(prev => ({ ...prev, isOpen: true }))}
                                        className="flex items-center justify-center gap-2.5 rounded-md bg-danger py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70"
                                        disabled={isSubmitting}
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
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            )}

                            <Link
                                href="/dashboard/menu-items"
                                className="flex items-center justify-center gap-2.5 rounded-md border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 disabled:cursor-not-allowed"
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
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* Icon Selector Modal */}
            <IconSelector
                selectedIcon={formData.icon}
                onSelectIcon={handleIconSelect}
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
            />

            {/* Delete confirmation modal */}
            {deleteOptions.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                                Delete Menu Item
                            </h3>
                            <p className="mb-6 text-body dark:text-bodydark">
                                How would you like to handle child menu items?
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="delete-strategy-delete"
                                        name="delete-strategy"
                                        value="delete"
                                        checked={deleteOptions.strategy === 'delete'}
                                        onChange={() => setDeleteOptions(prev => ({ ...prev, strategy: 'delete' }))}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor="delete-strategy-delete" className="text-black dark:text-white">
                                        Delete all child items
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="delete-strategy-orphan"
                                        name="delete-strategy"
                                        value="orphan"
                                        checked={deleteOptions.strategy === 'orphan'}
                                        onChange={() => setDeleteOptions(prev => ({ ...prev, strategy: 'orphan' }))}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor="delete-strategy-orphan" className="text-black dark:text-white">
                                        Make child items top-level
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="delete-strategy-promote"
                                        name="delete-strategy"
                                        value="promote"
                                        checked={deleteOptions.strategy === 'promote'}
                                        onChange={() => setDeleteOptions(prev => ({ ...prev, strategy: 'promote' }))}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor="delete-strategy-promote" className="text-black dark:text-white">
                                        Move child items to this item's parent
                                    </label>
                                </div>
                            </div>

                            <div className="text-danger font-medium mb-6">
                                Are you sure you want to delete this menu item? This action will move the item to trash.
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteOptions(prev => ({ ...prev, isOpen: false }))}
                                    className="flex items-center justify-center gap-2.5 rounded-md border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center justify-center gap-2.5 rounded-md bg-danger py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                    Delete Menu Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}