'use client';
import Link from "next/link";
import { useState } from "react";
import CreateSettingGroupModal from "@/components/Settings/CreateSettingGroupModal";

interface SettingsGroupsViewProps {
    groups: string[];
    search?: string;
}

export default function SettingsGroupsView({ groups, search }: SettingsGroupsViewProps) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredGroups = searchTerm
        ? groups.filter(group => group.toLowerCase().includes(searchTerm.toLowerCase()))
        : groups;

    const handleSearchChange = (newSearch: string) => {
        setSearchTerm(newSearch);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3">
                <div className="mb-6 flex flex-row gap-3 flex-wrap">
                    <Link
                        href="/dashboard/settings/create"
                        className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Setting
                    </Link>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2.5 rounded-md bg-success py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Create Group
                    </button>

                    <div className="w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search settings group..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full rounded-md border border-stroke py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredGroups.map((group) => (
                    <Link
                        key={group}
                        href={`/dashboard/settings/group/${encodeURIComponent(group)}`}
                        className="block"
                    >
                        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default hover:shadow-lg transition-shadow duration-300 dark:border-strokedark dark:bg-boxdark h-full flex flex-col">
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
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                                {group}
                            </h3>
                            <p className="mt-auto text-sm text-body dark:text-bodydark">
                                Click to view and manage settings
                            </p>
                        </div>
                    </Link>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="col-span-full p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            No setting groups found matching &quot;{searchTerm}&quot;
                        </p>
                    </div>
                )}
            </div>
            <CreateSettingGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}