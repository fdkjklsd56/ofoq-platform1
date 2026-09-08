import { NextResponse } from 'next/server'
import type { NextRequest } next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // الصفحات العامة (مش محتاجة تسجيل)
  const publicRoutes = ['/', '/splash', '/intro', '/start', '/login', '/register', '/verify', '/about', '/help', '/contact']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')

  // لو مش مسجل وبيحاول يخش على صفحة محمية → يروح للـ splash
  if (!token && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL('/splash', request.url))
  }

  // لو مسجل وبيحاول يخش على صفحة عامة → يروح للداشبورد بتاعه
  if (token && isPublicRoute) {
    const role = token.role as string
    const dashboardPath = role === 'ADMIN' ? '/admin' : 
                          role === 'TEACHER' ? '/teacher' : '/student'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}