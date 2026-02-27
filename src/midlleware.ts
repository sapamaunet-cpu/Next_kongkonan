import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tambahkan daftar email admin di sini
const ADMIN_EMAILS = ["emailanda@gmail.com", "partner@gmail.com"];

export async function middleware(req: NextRequest) {
  // ... kode supabase session sebelumnya ...
  const { data: { session } } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Cek apakah user sudah login DAN emailnya ada di daftar admin
    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  // ...
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Jika mencoba buka halaman admin tapi belum login
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/riwayat/:path*'],
}
