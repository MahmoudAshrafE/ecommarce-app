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
    // Enhanced secret handling with fallback to match lib/auth.ts
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || "very-secret-key-for-dev"
    });

    const { pathname } = req.nextUrl;

    // Detect current locale
    const locale = i18n.locales.find(
        (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    ) || i18n.defaultLocale;

    // Auth and Protected route definitions
    const isAuthPage = pathname.includes('/auth/signin') ||
        pathname.includes('/auth/signup') ||
        pathname.includes('/auth/forgot-password') ||
        pathname.includes('/auth/reset-password');

    const isProfilePage = pathname.includes('/profile');
    const isAdminPage = pathname.includes('/admin');
    const isOrdersPage = pathname.includes('/orders') && !pathname.includes('/admin');

    // 1. Redirect logged-in users away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // 2. Redirect guests away from protected pages
    if ((isProfilePage || isOrdersPage || isAdminPage) && !token) {
        return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
    }

    // 3. Admin role protection
    if (isAdminPage && token && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
