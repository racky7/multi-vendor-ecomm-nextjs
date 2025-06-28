import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: [
        /*
        Match all paths except fot:
        1. /api routes
        2. /_next (Next js internals)
        3. /_static (Inside public folder)
        4. All root files inside /public
        */
        "/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)",
    ]
}

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    // Extract the hostname (e.g. - "racky.funroad.com", "racky.localhost:3000")
    const hostname = req.headers.get('host') || '';

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || '';

    if (hostname.endsWith(`.${rootDomain}`)) {
        const subdomain = hostname.split('.')[0];
        return NextResponse.rewrite(
            new URL(`/tenants/${subdomain}${url.pathname}`, req.url)
        );
    }

    return NextResponse.next()
}