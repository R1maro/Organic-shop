import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from "@/config/config";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'You must be authenticated to perform this action' },
                { status: 401 }
            );
        }

        const response = await fetch(`${config.API_URL}/user/orders/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch order stats' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Order stats fetch error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching order stats' },
            { status: 500 }
        );
    }
}