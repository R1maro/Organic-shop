'use client';

import Link from 'next/link';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

interface UsersResponse {
    data: User[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
export default function Pagination({ meta, search }: { meta: UsersResponse['meta']; search: string }) {
    return (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-meta-5 bg-white dark:bg-meta-4 px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-white">
                        Showing <span className="font-medium">{meta.from}</span> to{' '}
                        <span className="font-medium">{meta.to}</span> of{' '}
                        <span className="font-medium">{meta.total}</span> results
                    </p>
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => {
                        const params = new URLSearchParams();
                        params.append('page', pageNum.toString());
                        if (search) {
                            params.append('search', search);
                        }

                        return (
                            <Link
                                key={pageNum}
                                href={`/dashboard/users?${params.toString()}`}
                                className={`px-3 py-1 rounded-md ${
                                    meta.current_page === pageNum
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {pageNum}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}