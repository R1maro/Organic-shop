import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from "@/config/config";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({
                isAuthenticated: false,
                user: null
            });
        }

        try {
            const response = await fetch(`${config.API_URL}/auth-check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                // Token is invalid or expired
                cookies().delete('token');
                return NextResponse.json({
                    isAuthenticated: false,
                    user: null
                });
            }

            const data = await response.json();

            return NextResponse.json({
                isAuthenticated: data.authenticated || false,
                user: data.user || null
            });
        } catch (error) {
            console.error('Backend auth check failed:', error);
            return NextResponse.json({
                isAuthenticated: false,
                user: null,
                error: 'Failed to verify authentication status'
            });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            {
                isAuthenticated: false,
                user: null,
                error: 'Authentication verification failed'
            },
            { status: 500 }
        );
    }
}