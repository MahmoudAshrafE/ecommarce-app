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
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // List of routes that should only be accessible to guests
    const isAuthPage = pathname.includes('/auth/signin') ||
        pathname.includes('/auth/signup') ||
        pathname.includes('/auth/forgot-password');

    if (isAuthPage && token) {
        // Find the current locale from the pathname or fallback to default
        const locale = i18n.locales.find(
            (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
        ) || i18n.defaultLocale;

        // Redirect to the home page with the current locale
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    return intlMiddleware(req);
}

export const config = {
    // Matcher ignoring api, _next, and static files
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
