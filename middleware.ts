import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('accessToken')?.value
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key')
      const { payload } = await jwtVerify(token, secret)
      if (path.startsWith('/dashboard/admin')) {
        if (payload.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 통과
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}