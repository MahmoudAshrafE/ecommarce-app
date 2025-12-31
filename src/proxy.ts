import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n.config';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
    locales: i18n.locales,
    defaultLocale: i18n.defaultLocale,
    localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Enhanced secret handling with explicit Secure Cookie detection for Vercel
    const secret = process.env.NEXTAUTH_SECRET || "very-secret-key-for-dev";
    const useSecureCookies = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

    const token = await getToken({
        req,
        secret,
        secureCookie: useSecureCookies,
        cookieName: useSecureCookies ? "__Secure-next-auth.session-token" : "next-auth.session-token",
    });

    // Detect current locale
    const locale = i18n.locales.find(
        (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    ) || i18n.defaultLocale;

    // Define segments more precisely
    const isAuthPage = pathname.includes(`/${locale}/auth/`) || pathname.includes('/auth/');
    const isProfilePage = pathname.includes(`/${locale}/profile`) || pathname.includes('/profile');
    const isAdminPage = pathname.includes(`/${locale}/admin`) || pathname.includes('/admin');
    const isOrdersPage = pathname.includes(`/${locale}/orders`) || pathname.includes('/orders');

    // 1. Redirect logged-in users away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // 2. Redirect guests away from protected pages
    if ((isProfilePage || isOrdersPage || isAdminPage) && !token) {
        const hasSessionCookie = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
        console.log(`[Middleware] Access Denied: No token. Cookie present? ${!!hasSessionCookie}. Path: ${pathname}`);
        return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
    }

    // 3. Admin role protection
    if (isAdminPage && token) {
        const userRole = (token.role as string)?.toUpperCase();
        console.log(`[Middleware] Admin Check - Path: ${pathname}, Role: ${userRole}`);
        if (userRole !== 'ADMIN') {
            console.log(`[Middleware] Forbidden: Role ${userRole} is not ADMIN.`);
            return NextResponse.redirect(new URL(`/${locale}`, req.url));
        }
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
