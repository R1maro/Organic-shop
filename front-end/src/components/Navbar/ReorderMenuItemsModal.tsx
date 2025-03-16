'use client';
import { useState, useEffect } from "react";
import { getMenuItems, reorderMenuItems, MenuItem } from "@/utils/dashboard/menu";

interface ReorderMenuItemsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReordered: () => void;
}

export default function ReorderMenuItemsModal({
                                                  isOpen,
                                                  onClose,
                                                  onReordered
                                              }: ReorderMenuItemsModalProps) {
    const [groupedItems, setGroupedItems] = useState<Record<string, MenuItem[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchMenuItems();
        }
    }, [isOpen]);

    const fetchMenuItems = async () => {
        setIsLoading(true);
        try {
            const items = await getMenuItems();

            const grouped = items.reduce((groups: Record<string, MenuItem[]>, item) => {
                const groupKey = item.parent_id === null ? 'Main Menu' :
                    items.find(parent => parent.id === item.parent_id)?.name || 'Other';

                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
                return groups;
            }, {});

            Object.keys(grouped).forEach(key => {
                grouped[key].sort((a, b) => a.order - b.order);
            });

            setGroupedItems(grouped);
            setActiveGroup(Object.keys(grouped)[0] || null);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setError('Failed to load menu items');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleMoveItem = (groupKey: string, index: number, direction: 'up' | 'down') => {
        if (!groupedItems[groupKey]) return;

        const newGroupedItems = { ...groupedItems };
        const items = [...newGroupedItems[groupKey]];

        if (direction === 'up' && index > 0) {
            [items[index - 1], items[index]] = [items[index], items[index - 1]];
        } else if (direction === 'down' && index < items.length - 1) {
            [items[index], items[index + 1]] = [items[index + 1], items[index]];
        }

        items.forEach((item, idx) => {
            item.order = idx + 1;
        });

        newGroupedItems[groupKey] = items;
        setGroupedItems(newGroupedItems);
    };

    const handleSaveOrder = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const itemsToUpdate = Object.values(groupedItems).flat().map(item => ({
            id: item.id,
            order: item.order
        }));

        const result = await reorderMenuItems(itemsToUpdate);

        if (result.success) {
            setSuccess('Menu items reordered successfully!');

            setTimeout(() => {
                onReordered();
            }, 1500);
        } else {
            setError(result.error || 'Failed to reorder menu items');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-stroke dark:border-strokedark">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Reorder Menu Items</h2>
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
                            {/* Group tabs */}
                            {Object.keys(groupedItems).length > 0 ? (
                                <div className="mb-6">
                                    <div className="flex flex-wrap border-b border-stroke dark:border-strokedark">
                                        {Object.keys(groupedItems).map(groupKey => (
                                            <button
                                                key={groupKey}
                                                className={`py-3 px-4 text-sm font-medium focus:outline-none ${
                                                    activeGroup === groupKey
                                                        ? 'border-b-2 border-primary text-primary'
                                                        : 'text-body dark:text-bodydark'
                                                }`}
                                                onClick={() => setActiveGroup(groupKey)}
                                            >
                                                {groupKey} ({groupedItems[groupKey].length})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No menu items found.
                                    </p>
                                </div>
                            )}

                            {activeGroup && groupedItems[activeGroup] && (
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="space-y-2">
                                        {groupedItems[activeGroup].map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-meta-4 rounded-md"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-lg font-medium text-black dark:text-white">
                                                        {item.order}.
                                                    </span>
                                                    <div>
                                                        <h4 className="font-medium text-black dark:text-white">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.url}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveItem(activeGroup, index, 'up')}
                                                        disabled={index === 0}
                                                        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-meta-3 ${
                                                            index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m18 15-6-6-6 6"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveItem(activeGroup, index, 'down')}
                                                        disabled={index === groupedItems[activeGroup].length - 1}
                                                        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-meta-3 ${
                                                            index === groupedItems[activeGroup].length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m6 9 6 6 6-6"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-stroke dark:border-strokedark flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2.5 rounded-md border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveOrder}
                        className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70"
                        disabled={isSubmitting || isLoading || Object.keys(groupedItems).length === 0}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}