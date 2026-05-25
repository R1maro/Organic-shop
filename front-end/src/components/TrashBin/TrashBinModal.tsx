'use client';
import { useState, useEffect, ReactNode } from "react";

export interface TrashBinColumn<T> {
    /** Header label shown in the table */
    header: string;
    /** Function that returns what to render in the cell for a given item */
    accessor: (item: T) => ReactNode;
    /** Optional extra classes for the <td> (e.g. "text-sm truncate max-w-xs") */
    cellClassName?: string;
}

export interface TrashBinModalProps<T extends { id: number }> {
    isOpen: boolean;
    onClose: () => void;

    /** Title shown in the modal header (e.g. "Trashed Menu Items") */
    title: string;
    /** Singular name of the entity, used in success/confirmation messages (e.g. "menu item") */
    itemLabel: string;

    /** Async fetcher returning the list of trashed items */
    fetchItems: () => Promise<T[]>;
    /** Async restore handler */
    restoreItem: (id: number) => Promise<{ success: boolean; error?: string }>;
    /** Async permanent-delete handler */
    forceDeleteItem: (id: number) => Promise<{ success: boolean; error?: string }>;

    /**
     * Columns shown before the "Deleted At" + Actions columns.
     * Defaults to a single "Name" column reading `item.name`.
     */
    columns?: TrashBinColumn<T>[];
    /** Accessor for the deleted_at timestamp; defaults to (item) => item.deleted_at */
    deletedAtAccessor?: (item: T) => string | null | undefined;

    /** Called after a successful restore so parent can refresh its data */
    onRestored?: () => void;
    /** Called after a successful permanent delete */
    onForceDeleted?: () => void;
}

const DEFAULT_COLUMNS: TrashBinColumn<{ id: number; name?: string }>[] = [
    { header: 'Name', accessor: (item) => item.name ?? `#${item.id}` },
];

export default function TrashBinModal<T extends { id: number }>({
                                                                    isOpen,
                                                                    onClose,
                                                                    title,
                                                                    itemLabel,
                                                                    fetchItems,
                                                                    restoreItem,
                                                                    forceDeleteItem,
                                                                    columns,
                                                                    deletedAtAccessor = (item: T) => (item as T & { deleted_at?: string | null }).deleted_at,
                                                                    onRestored,
                                                                    onForceDeleted,
                                                                }: TrashBinModalProps<T>) {
    const resolvedColumns = (columns ?? (DEFAULT_COLUMNS as unknown as TrashBinColumn<T>[]));

    const [trashedItems, setTrashedItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionItem, setActionItem] = useState<{ id: number; action: 'restore' | 'delete' } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            void loadItems();
        }
    }, [isOpen]);

    const loadItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const items = await fetchItems();
            setTrashedItems(items);
        } catch (err) {
            console.error(`Error fetching trashed ${itemLabel}s:`, err);
            setError(`Failed to load trashed ${itemLabel}s`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleRestore = async (id: number) => {
        setActionItem({ id, action: 'restore' });
        setError(null);
        setSuccess(null);

        const result = await restoreItem(id);

        if (result.success) {
            setSuccess(`${capitalize(itemLabel)} restored successfully!`);
            setTrashedItems(prev => prev.filter(item => item.id !== id));
            onRestored?.();
        } else {
            setError(result.error || `Failed to restore ${itemLabel}`);
        }

        setActionItem(null);
    };

    const handleForceDelete = async (id: number) => {
        if (!confirm(`Are you sure you want to permanently delete this ${itemLabel}? This action cannot be undone.`)) {
            return;
        }

        setActionItem({ id, action: 'delete' });
        setError(null);
        setSuccess(null);

        const result = await forceDeleteItem(id);

        if (result.success) {
            setSuccess(`${capitalize(itemLabel)} permanently deleted!`);
            setTrashedItems(prev => prev.filter(item => item.id !== id));
            onForceDeleted?.();
        } else {
            setError(result.error || `Failed to delete ${itemLabel}`);
        }

        setActionItem(null);
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-stroke dark:border-strokedark">
                    <h2 className="text-xl font-semibold text-black dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
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
                    ) : trashedItems.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="border-b border-stroke dark:border-strokedark">
                                    {resolvedColumns.map((col, idx) => (
                                        <th key={idx} className="p-3 font-medium">{col.header}</th>
                                    ))}
                                    <th className="p-3 font-medium">Deleted At</th>
                                    <th className="p-3 font-medium text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {trashedItems.map(item => {
                                    const isActing = actionItem?.id === item.id;
                                    return (
                                        <tr key={item.id} className="border-b border-stroke dark:border-strokedark">
                                            {resolvedColumns.map((col, idx) => (
                                                <td key={idx} className={`p-3 ${col.cellClassName ?? ''}`}>
                                                    {col.accessor(item)}
                                                </td>
                                            ))}
                                            <td className="p-3 text-sm">{formatDate(deletedAtAccessor(item))}</td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRestore(item.id)}
                                                        disabled={isActing}
                                                        className="p-2 text-success hover:bg-success hover:bg-opacity-10 rounded-md disabled:cursor-not-allowed"
                                                        aria-label={`Restore ${itemLabel}`}
                                                    >
                                                        {isActing && actionItem?.action === 'restore' ? (
                                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                                <path d="M3 3v5h5" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleForceDelete(item.id)}
                                                        disabled={isActing}
                                                        className="p-2 text-danger hover:bg-danger hover:bg-opacity-10 rounded-md disabled:cursor-not-allowed"
                                                        aria-label={`Permanently delete ${itemLabel}`}
                                                    >
                                                        {isActing && actionItem?.action === 'delete' ? (
                                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 6h18" />
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <p className="text-gray-500 dark:text-gray-400">
                                No trashed {itemLabel}s found.
                            </p>
                        </div>
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

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}