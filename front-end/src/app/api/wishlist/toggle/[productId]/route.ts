import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';

export async function POST(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const data = await apiRequest(`/wishlist/toggle/${params.productId}`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
        });
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {

        const status = error?.status ?? 500;``
        const message =
            error?.data?.message ||
            error?.message ||
            'Failed to toggle wishlist';

        return NextResponse.json({ error: message }, { status });
    }
}
