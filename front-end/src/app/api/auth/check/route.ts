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

        console.log('API route: Calling backend auth-check');

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


            let responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON');
                data = { error: 'Invalid JSON response' };
            }


            return NextResponse.json({
                isAuthenticated: data.authenticated,
                user: data.user
            });
        } catch (error) {
            return NextResponse.json({
                isAuthenticated: false,
                user: null,
                error: 'Failed to verify authentication status'
            });
        }
    } catch (error) {
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