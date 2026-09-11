import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || "default_super_secret";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isDashboardRoute = path.startsWith('/dashboard');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password') || path.startsWith('/reset-password');

  // Allow public routes
  if (!isAdminRoute && !isDashboardRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Get session cookie
  const session = request.cookies.get('session')?.value;

  let payload: any = null;
  if (session) {
    try {
      const verified = await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      payload = verified.payload;
    } catch (err) {
      // Invalid or expired token
      request.cookies.delete('session');
    }
  }

  // Auth routes (login/register) - Redirect to dashboard if already logged in
  if (isAuthRoute && payload) {
    if (payload.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected Routes - Redirect to login if not logged in
  if ((isAdminRoute || isDashboardRoute) && !payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin Routes - Restrict to ADMIN role only
  if (isAdminRoute && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect normal users away from admin
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|uploads).*)',
  ],
};
