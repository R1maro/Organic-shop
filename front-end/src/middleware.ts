import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import apiConfig from "@/config/config";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }


    if (token) {
        try {
            const authCheckResponse = await fetch(`${apiConfig.API_URL}/auth-check`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (authCheckResponse.ok) {
                const data = await authCheckResponse.json();

                if (
                    !data.authenticated ||
                    !data.user?.roles.some((role: any) => role.slug === 'admin')
                ) {

                    return NextResponse.redirect(new URL('/403', request.url));
                }
            } else {

                return NextResponse.redirect(new URL('/auth/signin', request.url));
            }
        } catch (error) {
            // Handle network errors
            console.error('Error during auth check:', error);
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'], // Apply middleware to all dashboard routes
};
