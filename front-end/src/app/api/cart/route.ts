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

        const response = await fetch(`${config.API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch cart' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Cart fetch error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching your cart' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'You must be authenticated to perform this action' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, ...data } = body;

        let endpoint = '/cart/add';

        if (action === 'update') {
            endpoint = '/cart/update';
        }

        const response = await fetch(`${config.API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.message || 'Failed to process cart action' },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Cart action error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your cart action' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'You must be authenticated to perform this action' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, ...data } = body;

        let endpoint = '';

        if (action === 'remove') {
            endpoint = `/cart/remove/${data.cart_item_id}`;
        } else if (action === 'clear') {
            endpoint = '/cart/clear';
        } else {
            return NextResponse.json(
                { error: 'Invalid delete action' },
                { status: 400 }
            );
        }

        const response = await fetch(`${config.API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.message || 'Failed to process delete action' },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Cart delete error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing delete action' },
            { status: 500 }
        );
    }
}