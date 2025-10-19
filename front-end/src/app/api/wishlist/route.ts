import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';

export async function GET() {
    try {
        const data = await apiRequest('/wishlist');
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Wishlist fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch wishlist' },
            { status: error.message.includes('Unauthorized') ? 401 : 500 }
        );
    }
}