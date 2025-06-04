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

        const response = await fetch(`${config.API_URL}/auth-check`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json({
                isAuthenticated: false,
                user: null
            });
        }

        const data = await response.json();

        return NextResponse.json({
            isAuthenticated: data.authenticated,
            user: data.user
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { isAuthenticated: false, user: null },
            { status: 500 }
        );
    }
}