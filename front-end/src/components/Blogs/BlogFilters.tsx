'use client';

import { useRouter } from 'next/navigation';
import {useState} from 'react';
import { Category } from '@/types/blog';

interface BlogFiltersProps {
    initialStatus?: string;
    initialSearch?: string;
    initialCategoryId?: string;
    categories: Category[];
}

export default function BlogFilters({
                                        initialStatus = '',
                                        initialSearch = '',
                                        initialCategoryId = '',
                                        categories = []
                                    }: BlogFiltersProps) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [search, setSearch] = useState(initialSearch);
    const [categoryId, setCategoryId] = useState(initialCategoryId);


    const handleFilter = () => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        if (categoryId) params.append('category_id', categoryId);
        params.append('page', '1');
        router.push(`/dashboard/blogs?${params.toString()}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFilter();
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Search by title or content..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:outline-none"
                />
            </div>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-auto rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4"
            >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="archived">Archived</option>
            </select>

            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full md:w-auto rounded-md border border-stroke px-5 py-3 dark:border-strokedark dark:bg-meta-4"
            >
                <option value="">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                        {category.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleFilter}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 md:px-10 text-center font-medium text-white hover:bg-opacity-90"
            >
                Apply Filters
            </button>
        </div>
    );
}