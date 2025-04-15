import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import apiConfig from "@/config/config";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;


    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        const signinUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(signinUrl);
    }

    if (token && request.nextUrl.pathname.startsWith('/dashboard')) {
        try {

            const authCheckResponse = await fetch(`${apiConfig.API_URL}/auth-check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store',
                next: { revalidate: 0 }
            });

            if (!authCheckResponse.ok) {
                try {
                    const errorData = await authCheckResponse.json();
                    console.error('Middleware: Auth check error details:', errorData);
                } catch (parseError) {
                    console.error('Middleware: Could not parse error response');
                }

                const signinUrl = new URL('/auth/signin', request.url);
                signinUrl.searchParams.set('error', 'session_expired');
                return NextResponse.redirect(signinUrl);
            }

            const data = await authCheckResponse.json();

            if (!data.authenticated) {
                const signinUrl = new URL('/auth/signin', request.url);
                return NextResponse.redirect(signinUrl);
            }

            const roles = data.user?.roles || [];
            const isAdmin = Array.isArray(roles) && roles.some((role: any) => role && role.slug === 'admin');


            if (!isAdmin) {
                return NextResponse.redirect(new URL('/403', request.url));
            }

            return NextResponse.next();
        } catch (error) {
            const signinUrl = new URL('/auth/signin', request.url);
            signinUrl.searchParams.set('error', 'network_error');
            return NextResponse.redirect(signinUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};