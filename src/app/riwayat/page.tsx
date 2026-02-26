'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RiwayatPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchRiwayat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('pesanan').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      setOrders(data || []);
    };
    fetchRiwayat();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black mb-6">RIWAYAT PESANAN</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="p-5 bg-white border rounded-3xl shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
              <p className="font-bold">Rp {o.total_bayar.toLocaleString()}</p>
              {o.alasan_batal && <p className="text-xs text-red-500 italic">Batal: {o.alasan_batal}</p>}
            </div>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Dibatalkan' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
              }
