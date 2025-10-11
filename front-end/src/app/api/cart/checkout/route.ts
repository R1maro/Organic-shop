import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from "@/config/config";

export async function POST() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'You must be authenticated to perform this action' },
                { status: 401 }
            );
        }

        const response = await fetch(`${config.API_URL}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to checkout' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing checkout' },
            { status: 500 }
        );
    }
}