import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/users']

export async function proxy(req: NextRequest) {
    // authenticated routes logic 
    const authPages = ['/register', '/login'].includes(req.nextUrl.pathname);
    if (authPages) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            method: 'GET',
            headers: { cookie: req.headers.get('cookie') ?? '' }
        })

        if (res.ok) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return NextResponse.next();
    };

    // non-authenticated routes logic
    const isProtected = PROTECTED_ROUTES.some(function (route) {
        return req.nextUrl.pathname.startsWith(route);
    });

    if (!isProtected) return NextResponse.next()

    // check your session cookie / call your backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { cookie: req.headers.get('cookie') ?? '' },
    })

    if (!res.ok) {
        return NextResponse.redirect(new URL('/login?reason=unauthorized', req.url))
    }

    const data = await res.json();

    if (req.nextUrl.pathname.startsWith('/users') && data.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
}
