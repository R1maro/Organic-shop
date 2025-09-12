import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from "@/config/config";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || data.error || 'Authentication failed' },
                { status: response.status }
            );
        }

        cookies().set('token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours in seconds
        });

        return NextResponse.json({
            success: true,
            user: data.user,
            expires_at: data.expires_at
        });
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return NextResponse.json(
                { error: 'Unable to connect to the authentication server. Please check your connection.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred during login. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ success: true, message: 'Already logged out' });
        }

        try {
            const response = await fetch(`${config.API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                console.warn('Backend logout failed, but proceeding with client-side logout');
            }
        } catch (error) {
            console.error('Error calling logout endpoint:', error);
        }

        cookies().delete('token');

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Logout process failed, please clear your cookies manually' },
            { status: 500 }
        );
    }
}