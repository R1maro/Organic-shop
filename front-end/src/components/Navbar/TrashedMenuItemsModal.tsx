'use client';
import { useState, useEffect } from "react";
import { getTrashedMenuItems, restoreMenuItem, forceDeleteMenuItem, MenuItem } from "@/utils/dashboard/menu";

interface TrashedMenuItemsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRestored: () => void;
}

export default function TrashedMenuItemsModal({
                                                  isOpen,
                                                  onClose,
                                                  onRestored
                                              }: TrashedMenuItemsModalProps) {
    const [trashedItems, setTrashedItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionItem, setActionItem] = useState<{id: number, action: string} | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchTrashedItems();
        }
    }, [isOpen]);

    const fetchTrashedItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const items = await getTrashedMenuItems();
            setTrashedItems(items);
        } catch (error) {
            console.error('Error fetching trashed menu items:', error);
            setError('Failed to load trashed menu items');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleRestore = async (id: number) => {
        setActionItem({ id, action: 'restore' });
        setError(null);
        setSuccess(null);

        const result = await restoreMenuItem(id);

        if (result.success) {
            setSuccess(`Menu item restored successfully!`);
            setTrashedItems(trashedItems.filter(item => item.id !== id));
            onRestored();
        } else {
            setError(result.error || 'Failed to restore menu item');
        }

        setActionItem(null);
    };

    const handleForceDelete = async (id: number) => {
        if (!confirm('Are you sure you want to permanently delete this menu item? This action cannot be undone.')) {
            return;
        }

        setActionItem({ id, action: 'delete' });
        setError(null);
        setSuccess(null);

        const result = await forceDeleteMenuItem(id);

        if (result.success) {
            setSuccess(`Menu item permanently deleted!`);
            setTrashedItems(trashedItems.filter(item => item.id !== id));
        } else {
            setError(result.error || 'Failed to delete menu item');
        }

        setActionItem(null);
    };

    const formatDate = (dateString?: string | null | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-stroke dark:border-strokedark">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Trashed Menu Items</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

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

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {trashedItems.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                        <tr className="border-b border-stroke dark:border-strokedark">
                                            <th className="p-3 font-medium">Name</th>
                                            <th className="p-3 font-medium">URL</th>
                                            <th className="p-3 font-medium">Deleted At</th>
                                            <th className="p-3 font-medium text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {trashedItems.map(item => (
                                            <tr key={item.id} className="border-b border-stroke dark:border-strokedark">
                                                <td className="p-3">{item.name}</td>
                                                <td className="p-3 text-sm truncate max-w-xs">{item.url}</td>
                                                <td className="p-3 text-sm">{formatDate(item.deleted_at)}</td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRestore(item.id)}
                                                            disabled={actionItem?.id === item.id}
                                                            className="p-2 text-success hover:bg-success hover:bg-opacity-10 rounded-md"
                                                        >
                                                            {actionItem?.id === item.id && actionItem.action === 'restore' ? (
                                                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                                    <path d="M3 3v5h5"/>
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleForceDelete(item.id)}
                                                            disabled={actionItem?.id === item.id}
                                                            className="p-2 text-danger hover:bg-danger hover:bg-opacity-10 rounded-md"
                                                        >
                                                            {actionItem?.id === item.id && actionItem.action === 'delete' ? (
                                                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M3 6h18"/>
                                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No trashed menu items found.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-stroke dark:border-strokedark flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2.5 rounded-md border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}