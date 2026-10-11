import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken, AUTH_COOKIE_NAME } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Excluir endpoints públicos de autenticación admin
  if (pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSessionToken(sessionCookie);

    if (!isValid) {
      if (isAdminApi) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Acceso no autorizado. Se requiere sesión de administrador activa." 
          }, 
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
