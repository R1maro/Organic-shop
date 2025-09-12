'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ProfileButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleProfileClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const authStatus = localStorage.getItem('auth_status');

            if (authStatus !== 'logged_in') {
                router.push('/auth/signin');
                return;
            }

            const response = await fetch('/api/auth/check', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('auth_status');
                    router.push('/auth/signin?error=session_expired');
                    return;
                }
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();

            const isAdmin = data.user?.roles?.some((role: any) => role.slug === "admin");

            if (isAdmin) {
                router.push('/dashboard');
            } else {
                router.push('/account');
            }

        } catch (error) {
            console.error('Profile navigation error:', error);

            const authStatus = localStorage.getItem('auth_status');
            if (authStatus === 'logged_in') {
                router.push('/account');
            } else {
                router.push('/auth/signin');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleProfileClick}
            disabled={loading}
            className="inline-flex items-center justify-center hover:opacity-75 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            title="Profile"
        >
            {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M437.02 330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521 243.251 404 198.548 404 148 404 66.393 337.607 0 256 0S108 66.393 108 148c0 50.548 25.479 95.251 64.262 121.962-36.21 12.495-69.398 33.136-97.281 61.018C26.629 379.333 0 443.62 0 512h40c0-119.103 96.897-216 216-216s216 96.897 216 216h40c0-68.38-26.629-132.667-74.98-181.02zM256 256c-59.551 0-108-48.448-108-108S196.449 40 256 40s108 48.448 108 108-48.449 108-108 108z" />
                </svg>
            )}
        </button>
    );
};

export default ProfileButton;