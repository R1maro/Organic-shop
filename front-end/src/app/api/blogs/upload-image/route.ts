import { NextRequest, NextResponse } from 'next/server';
import { getServerSideAuth } from '@/lib/auth';
import config from "@/config/config";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const res = await getServerSideAuth();
        const user = res.user;
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return NextResponse.json({ message: 'No image provided' }, { status: 400 });
        }

        // Make API call to your Laravel backend
        const backendResponse = await fetch(`${config.API_URL}/admin/blogs/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
            body: formData,
        });

        if (!backendResponse.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}