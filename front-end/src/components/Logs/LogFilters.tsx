"use client";

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface LogFiltersProps {
    users?: { id: number; name: string }[];
    actions?: string[];
}

const LogFilters = ({ users = [], actions = [] }: LogFiltersProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        userId: searchParams.get('user_id') || '',
        action: searchParams.get('action') || '',
        sort: searchParams.get('sort') || 'created_at',
        order: searchParams.get('order') || 'desc',
        search: searchParams.get('search') || '',
    });

    // Update URL when filters change
    const updateUrlParams = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Set or remove filters from URL
        if (filters.userId) params.set('user_id', filters.userId);
        else params.delete('user_id');

        if (filters.action) params.set('action', filters.action);
        else params.delete('action');

        if (filters.search) params.set('search', filters.search);
        else params.delete('search');

        if (filters.sort) params.set('sort', filters.sort);
        else params.delete('sort');

        if (filters.order) params.set('order', filters.order);
        else params.delete('order');

        // Ensure page parameter is reset to 1 when filters change
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrlParams();
    };

    const handleReset = () => {
        setFilters({
            userId: '',
            action: '',
            sort: 'created_at',
            order: 'desc',
            search: '',
        });

        // Use setTimeout to allow state to update before triggering URL change
        setTimeout(() => updateUrlParams(), 0);
    };

    return (
        <div className="mb-4 p-4 bg-white rounded-sm border border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-lg font-medium mb-3 text-black dark:text-white">Filters and Search</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium mb-1 text-black dark:text-white">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search in description..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="userId" className="block text-sm font-medium mb-1 text-black dark:text-white">
                        User
                    </label>
                    <select
                        id="userId"
                        name="userId"
                        value={filters.userId}
                        onChange={handleFilterChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="">All Users</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="action" className="block text-sm font-medium mb-1 text-black dark:text-white">
                        Action Type
                    </label>
                    <select
                        id="action"
                        name="action"
                        value={filters.action}
                        onChange={handleFilterChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="">All Actions</option>
                        {actions.map(action => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sort" className="block text-sm font-medium mb-1 text-black dark:text-white">
                        Sort By
                    </label>
                    <div className="flex">
                        <select
                            id="sort"
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                            className="w-2/3 rounded-l border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="created_at">Timestamp</option>
                            <option value="action">Action</option>
                            <option value="ip">IP Address</option>
                            <option value="user.name">User Name</option>
                        </select>
                        <select
                            id="order"
                            name="order"
                            value={filters.order}
                            onChange={handleFilterChange}
                            className="w-1/3 rounded-r border-[1.5px] border-l-0 border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="asc">Asc</option>
                            <option value="desc">Desc</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-white hover:bg-opacity-90"
                    >
                        Apply Filters
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogFilters;