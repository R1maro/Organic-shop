'use client';
import React, { useState, useEffect } from "react";
import config from "@/config/config";
import { useRouter } from "next/navigation";

interface CreateSettingGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateSettingGroupModal: React.FC<CreateSettingGroupModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${config.API_URL}/admin/setting-groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create group');
            }

            setName('');
            router.refresh();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
            <div className="bg-white dark:bg-boxdark w-full max-w-lg rounded border border-stroke shadow-default">
                <div className="flex items-center justify-between border-b border-stroke px-6 py-4">
                    <h3 className="font-medium text-black dark:text-white">Create Setting Group</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="groupName" className="mb-2.5 block text-black dark:text-white">
                            Group Name
                        </label>
                        <input
                            id="groupName"
                            type="text"
                            placeholder="Enter group name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 rounded-md bg-danger bg-opacity-10 p-4 text-danger">{error}</div>
                    )}

                    <div className="flex items-center justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-6 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Group"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSettingGroupModal;
