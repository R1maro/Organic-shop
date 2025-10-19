import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';

export async function POST(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const data = await apiRequest(`/wishlist/toggle/${params.productId}`, {
            method: 'POST',
        });
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Wishlist toggle error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to toggle wishlist' },
            { status: error.message.includes('Unauthorized') ? 401 : 500 }
        );
    }
}