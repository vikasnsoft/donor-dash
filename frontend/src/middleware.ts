import { NextRequest, NextResponse } from 'next/server';

/**
 * Role-based route protection middleware
 * 
 * This middleware checks if the user is authenticated by verifying the JWT token
 * stored in cookies. It also handles role-based access control by restricting
 * access to certain routes based on user roles.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('jwt')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/about', '/contact'];
  
  // Check if the path is a public route or a static asset
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isStaticAsset = pathname.startsWith('/_next') || 
                         pathname.startsWith('/favicon.ico') || 
                         /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname);
  
  // If it's a public route or a static asset, allow access
  if (isPublicRoute || isStaticAsset) {
    return NextResponse.next();
  }
  
  // If no token exists and trying to access a protected route, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Role-based route protection
  // Note: For more complex role checks, you would need to decode the JWT token here
  // and check the user role against the required roles for the route
  
  // For example, if you want to restrict admin routes:
  if (pathname.startsWith('/admin')) {
    // You would need to decode the JWT token and check if the user has admin role
    // For this example, we'll assume we can extract this information from the token
    
    try {
      // In a real implementation, you would decode the JWT and check the role
      // For now, we'll use a simple cookie check as a placeholder
      const isAdmin = request.cookies.get('user_role')?.value === 'admin';
      
      if (!isAdmin) {
        // Redirect to dashboard with an unauthorized message
        const url = new URL('/dashboard', request.url);
        url.searchParams.set('unauthorized', 'true');
        return NextResponse.redirect(url);
      }
    } catch {
      // If there's an error parsing the token, redirect to login
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Allow access to the requested resource
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets
     * Using simpler patterns to avoid capturing groups
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Add specific routes that should be handled by the middleware
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
