import { NextResponse } from 'next/server'
import config from '@/config/config'

export async function GET() {
    try {
        const response = await fetch(`${config.API_URL}/products`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch products from backend' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error: unknown) {
        console.error('Products API Error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
