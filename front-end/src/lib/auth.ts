import { cookies } from 'next/headers';

export async function getServerSideAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return { user: null, isAuthenticated: false };
    }

    try {
        const response = await fetch('http://localhost:8000/api/auth-check', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store'
        });

        const data = await response.json();

        return {
            user: data.authenticated ? data.user : null,
            isAuthenticated: data.authenticated
        };
    } catch (error) {
        return { user: null, isAuthenticated: false };
    }
}