import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // الصفحات العامة (مش محتاجة تسجيل)
  const publicRoutes = ['/', '/splash', '/intro', '/start', '/login', '/register', '/verify', '/about', '/help', '/contact']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')

  // ✅ 1. لو مش مسجل وبيحاول يخش على صفحة محمية → روح splash
  if (!token && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL('/splash', request.url))
  }

  // ✅ 2. لو مسجل وبيحاول يخش على صفحة عامة → روح dashboard
  if (token && isPublicRoute && pathname !== '/') {
    const role = token.role as string
    const dashboardPath = role === 'ADMIN' ? '/admin' : 
                          role === 'TEACHER' ? '/teacher' : '/student'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // ✅ 3. لو مسجل وبيحاول يخش على / → روح dashboard
  if (token && pathname === '/') {
    const role = token.role as string
    const dashboardPath = role === 'ADMIN' ? '/admin' : 
                          role === 'TEACHER' ? '/teacher' : '/student'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // ✅ 4. كل حاجة تانية → عادي
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}