// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 1. Ambil session user
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Tentukan email admin dari .env
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // 3. Cek apakah user mencoba mengakses folder /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    // Jika belum login, atau email tidak cocok dengan admin
    if (!session || session.user.email !== adminEmail) {
      // Lempar ke halaman login atau home
      const url = req.nextUrl.clone();
      url.pathname = '/login'; 
      return NextResponse.redirect(url);
    }
  }

  return res;
}

// Atur agar middleware hanya berjalan pada folder admin
export const config = {
  matcher: ['/admin/:path*'],
};
