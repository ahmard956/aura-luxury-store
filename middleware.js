import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith('/admin') ||
    path.startsWith('/dashboard')
  ) {
    const authCookie =
      request.cookies.get(
        'sb-access-token'
      );

    if (!authCookie) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
};