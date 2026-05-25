import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';

export async function GET() {
    try {
        const data = await apiClient('/admin/products/trashed', {
            method: 'GET',
            cache: 'no-store',
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch trashed products' },
            { status: 500 }
        );
    }
}