'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ initialSearch = '' }) {
    const router = useRouter();
    const [search, setSearch] = useState(initialSearch);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const params = new URLSearchParams();
        if (search) {
            params.append('search', search);
        }
        params.append('page', '1');
        router.push(`/dashboard/users?${params.toString()}`);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4"
            />
            <button
                type="submit"
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
}
