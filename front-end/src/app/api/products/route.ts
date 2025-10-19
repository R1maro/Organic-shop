import { NextResponse } from 'next/server'
import config from '@/config/config'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get('token')?.value

        const response = await fetch(`${config.API_URL}/products`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
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

        // If user is authenticated, fetch wishlist and add status to products
        if (token) {
            try {
                const wishlistResponse = await fetch(`${config.API_URL}/wishlist`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })

                if (wishlistResponse.ok) {
                    const wishlistData = await wishlistResponse.json()
                    const wishlistIds = new Set(
                        wishlistData.data?.map((item: any) => item.id) || []
                    )

                    if (data.data && Array.isArray(data.data)) {
                        data.data = data.data.map((product: any) => ({
                            ...product,
                            in_wishlist: wishlistIds.has(product.id)
                        }))
                    }
                }
            } catch (wishlistError) {
                console.error('Failed to fetch wishlist:', wishlistError)
            }
        } else {
            if (data.data && Array.isArray(data.data)) {
                data.data = data.data.map((product: any) => ({
                    ...product,
                    in_wishlist: false
                }))
            }
        }

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