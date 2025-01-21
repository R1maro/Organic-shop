import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import config from "@/config/config";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email, password} = body;

        const response = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {error: data.message || 'Authentication failed'},
                {status: response.status}
            );
        }

        // Set the token in an HTTP-only cookie
        cookies().set('token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: data.user,
        });
    } catch (error) {
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

export async function DELETE() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');

        if (token) {
            // Call Laravel logout endpoint
            await fetch(`${config.API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Accept': 'application/json',
                },
            });

            // Remove the token cookie
            cookies().delete('token');
        }

        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json(
            {error: 'Logout failed'},
            {status: 500}
        );
    }
}