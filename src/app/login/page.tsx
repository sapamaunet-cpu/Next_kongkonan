'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const sendOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    const res = await fetch('/api/otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp: code }),
    });

    if (res.ok) {
      setOtpSent(true);
      alert("Kode OTP terkirim ke email Anda!");
    }
  };

  const verifyOtp = async () => {
    if (userOtp === generatedOtp) {
      // Login via Magic Link atau Password (Sederhana: Login Manual)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password_default_atau_rahasia' // Sesuaikan dengan alur registrasi Anda
      });
      if (!error) window.location.href = '/';
    } else {
      alert("OTP Salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border">
        <h2 className="text-3xl font-black italic mb-6 text-indigo-700">LOGIN</h2>
        {!otpSent ? (
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email Anda" 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Kirim OTP</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text" placeholder="Masukkan 6 Digit OTP" 
              className="w-full p-4 bg-gray-50 rounded-2xl text-center text-2xl tracking-widest"
              onChange={(e) => setUserOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="w-full bg-black text-white py-4 rounded-2xl font-bold">Verifikasi & Masuk</button>
          </div>
        )}
      </div>
    </div>
  );
}
