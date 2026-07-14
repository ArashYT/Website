import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Check if user is accessing via dev.arashyt.ca
  if (hostname.includes('dev.arashyt.ca')) {
    // Rewrite the root path to the /dev website manager dashboard
    if (url.pathname === '/') {
      url.pathname = '/dev';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// Support routing configuration matching Next.js 16 proxy spec
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
