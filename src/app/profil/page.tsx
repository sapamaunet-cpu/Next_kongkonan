'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const user = session.user;
      setEmail(user.email || '');

      // Cek apakah user adalah admin berdasarkan .env
      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
      }

      // Ambil nama dari tabel profiles
      let { data, error } = await supabase
        .from('profiles')
        .select(`full_name`)
        .eq('id', user.id)
        .single();

      if (data) setFullName(data.full_name || '');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('profiles').upsert({
      id: session?.user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    if (error) alert(error.message);
    else alert('Profil diperbarui!');
    setLoading(false);
  }

  if (loading) return <p className="p-10 text-center">Memuat...</p>;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-3xl border shadow-sm">
      <h1 className="text-2xl font-black mb-6">PROFIL SAYA</h1>

      <div className="space-y-4">
        {/* INFO EMAIL (Read Only) */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
          <p className="p-3 bg-gray-50 rounded-xl text-gray-600 border">{email}</p>
        </div>

        {/* EDIT NAMA */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Masukkan nama Anda"
          />
        </div>

        <button 
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          SIMPAN PERUBAHAN
        </button>

        {/* LINK KHUSUS ADMIN */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-dashed">
            <p className="text-xs font-bold text-indigo-500 mb-3">PANEL KHUSUS ADMIN</p>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/admin" className="flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100">
                🚀 Kelola Produk
                <span>→</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100">
                ⚙️ Admin Settings
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
          className="w-full text-red-500 py-3 text-sm font-bold mt-4"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
  }
                
