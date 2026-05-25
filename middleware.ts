import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/sessionCrypto';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session_user');
  const { pathname } = request.nextUrl;

  // 1. Redirect logged-in users away from the landing page
  if (pathname === '/' && session) {
    const verified = await verifySession(session.value);
    if (verified) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Protect all internal routes
  const protectedRoutes = ['/dashboard', '/referrals', '/scholarships', '/events', '/organizations', '/guidance', '/submissions', '/admin', '/passport', '/vault'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const verified = await verifySession(session.value);
    if (!verified) {
      // Tampered/invalid session -> clear cookie and redirect
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('session_user');
      return response;
    }

    // 3. Role-Based Access Control (RBAC) - Institutional Hardening
    try {
      const userData = JSON.parse(verified);
      
      // ELITE PROTECTION: Only SYSTEM_ADMIN can access /admin
      if (pathname.startsWith('/admin') && userData.role !== 'SYSTEM_ADMIN') {
         return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Only Guidance and OSAS can access /guidance
      if (pathname.startsWith('/guidance') && !['OSAS_DIRECTOR', 'GUIDANCE_COUNSELOR', 'SYSTEM_ADMIN'].includes(userData.role)) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      // If cookie payload is malformed, force logout
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('session_user');
      return response;
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

