import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings']

export async function middleware(req: NextRequest) {
    const isProtected = PROTECTED_ROUTES.some(function (route) {
        return req.nextUrl.pathname.startsWith(route);
    });

    if (!isProtected) return NextResponse.next()

    // check your session cookie / call your backend
    const res = await fetch('http://localhost:3001/me', {
        headers: { cookie: req.headers.get('cookie') ?? '' },
    })

    if (!res.ok) {
        return NextResponse.redirect(new URL('/login?reason=unauthorized', req.url))

    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
}