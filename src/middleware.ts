// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Ambil session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Ambil email admin dari env
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // Proteksi folder admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Jika email tidak cocok atau tidak ada session, lempar ke login
      if (!session || !session.user || session.user.email !== adminEmail) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return res;
  } catch (e) {
    // Jika terjadi error di middleware, jangan biarkan error 500
    // Melainkan arahkan ke home atau login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
