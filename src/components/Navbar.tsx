'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { checkIsStoreOpen } from '@/lib/shopStatus';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Cek User & Status Toko saat pertama kali load
    const initNavbar = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      const { data: settings } = await supabase.from('settings').select('*').single();
      setIsOpen(checkIsStoreOpen(settings));

      if (authUser) fetchCartCount(authUser.id);
    };

    initNavbar();

    // 2. Realtime Listener untuk Keranjang
    // Setiap ada perubahan (INSERT/DELETE) di tabel keranjang, angka update otomatis
    const cartSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'keranjang' }, (payload) => {
        if (user) fetchCartCount(user.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(cartSubscription);
    };
  }, [user?.id]);

  async function fetchCartCount(userId: string) {
    const { count } = await supabase
      .from('keranjang')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    setCartCount(count || 0);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* Banner Status Toko Kecil di Atas */}
      <div className={`text-[10px] text-center py-1 font-bold uppercase tracking-widest ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        {isOpen ? 'Toko Sedang Beroperasi' : 'Toko Sedang Tutup'}
      </div>

      <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="group">
          <h1 className="text-2xl font-black italic tracking-tighter text-indigo-700 group-hover:text-black transition">
            KONG<span className="text-black group-hover:text-indigo-700">KONAN</span>
          </h1>
        </Link>

        {/* Action Menu */}
        <div className="flex items-center gap-5">
          {/* Link Riwayat (Hanya muncul jika login) */}
          {user && (
            <Link href="/riwayat" className="text-gray-400 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="box-important"></path>
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </Link>
          )}

          {/* Icon Keranjang dengan Badge */}
          <Link href="/keranjang" className="relative p-2 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Tombol Profil/Login */}
          {user ? (
            <Link href="/profil" className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center border border-indigo-200">
              <span className="text-xs font-black text-indigo-700">
                {user.email?.substring(0, 2).toUpperCase()}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
