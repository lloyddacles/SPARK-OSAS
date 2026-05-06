import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_user');
  const { pathname } = request.nextUrl;

  // 1. Redirect logged-in users away from the landing page
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect all internal routes
  const protectedRoutes = ['/dashboard', '/referrals', '/scholarships', '/events', '/organizations', '/guidance', '/submissions', '/admin', '/passport', '/vault'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Role-Based Access Control (RBAC) - Institutional Hardening
  if (session) {
    try {
      const userData = JSON.parse(session.value);
      
      // ELITE PROTECTION: Only SYSTEM_ADMIN can access /admin
      if (pathname.startsWith('/admin') && userData.role !== 'SYSTEM_ADMIN') {
         return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Only Guidance and OSAS can access /guidance
      if (pathname.startsWith('/guidance') && !['OSAS_DIRECTOR', 'GUIDANCE_COUNSELOR', 'SYSTEM_ADMIN'].includes(userData.role)) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      // If cookie is malformed, force logout
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/', 
    '/dashboard/:path*', 
    '/referrals/:path*', 
    '/scholarships/:path*', 
    '/events/:path*', 
    '/organizations/:path*', 
    '/guidance/:path*', 
    '/submissions/:path*', 
    '/admin/:path*',
    '/passport/:path*',
    '/vault/:path*'
  ],
};
