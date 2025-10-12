import { NextRequest, NextResponse } from 'next/server';
import config from '@/config/config';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const res = await fetch(`${config.API_URL}/products/${params.slug}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}