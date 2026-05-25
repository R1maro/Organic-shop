import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await apiClient(`/admin/products/${params.id}/force`, {
            method: 'DELETE',
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to permanently delete product' },
            { status: 500 }
        );
    }
}