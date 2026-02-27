'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fungsi Mengirim OTP (Menggunakan fitur bawaan Supabase)
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin, // Otomatis kembali ke domain website Anda
      }
    });

    setLoading(false);
    if (error) {
      alert("Gagal kirim OTP: " + error.message);
    } else {
      setOtpSent(true);
      alert("Kode OTP telah dikirim ke email Anda!");
    }
  };

  // 2. Fungsi Verifikasi OTP (Resmi dari Supabase)
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: userOtp,
      type: 'email',
    });

    setLoading(false);
    if (error) {
      alert("Verifikasi Gagal: " + error.message);
    } else {
      // BERHASIL! Arahkan langsung ke dashboard Admin
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            KONG<span className="text-green-600">KONAN</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2">Masuk ke Dashboard Pengelola</p>
        </div>

        {!otpSent ? (
          /* FORM KIRIM EMAIL */
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Email Admin</label>
              <input 
                required
                type="email" 
                placeholder="admin@email.com" 
                className="w-full p-4 mt-1 bg-slate-100 rounded-2xl outline-green-500 text-slate-700 transition-all font-medium"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
            </button>
          </form>
        ) : (
          /* FORM VERIFIKASI OTP */
          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-2 text-center block">Masukkan 6 Digit Kode</label>
              <input 
                required
                type="text" 
                placeholder="000000" 
                maxLength={6}
                className="w-full p-4 mt-1 bg-slate-100 rounded-2xl text-center text-3xl tracking-[1rem] outline-green-500 font-black text-slate-800"
                onChange={(e) => setUserOtp(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </button>
            <button 
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
            >
              Ganti Email
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Secure Login by Supabase</p>
        </div>
      </div>
    </div>
  );
}
