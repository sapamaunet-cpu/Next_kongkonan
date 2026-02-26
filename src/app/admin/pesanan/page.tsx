'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaPesanan() {
  const [orders, setOrders] = useState<any[]>([]);
  const [kurirs, setKurirs] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchKurirs();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('pesanan').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  async function fetchKurirs() {
    const { data } = await supabase.from('kurir').select('*');
    setKurirs(data || []);
  }

  const teruskanKeKurir = (order: any, kurir: any) => {
    const listBarang = order.daftar_barang.map((i: any) => `- ${i.nama_item} (x${i.jumlah})`).join('\n');
    const teks = `*TUGAS KURIR: ${kurir.nama_kurir}*\n\n` +
                 `*BARANG:*\n${listBarang}\n\n` +
                 `*PENERIMA:* ${order.nama_pembeli}\n` +
                 `*ALAMAT:* ${order.alamat_lengkap}\n` +
                 `*TAGIHAN:* Rp ${order.total_bayar.toLocaleString()}`;
    
    window.open(`https://wa.me/${kurir.whatsapp_kurir}?text=${encodeURIComponent(teks)}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-black mb-6 italic">PESANAN MASUK</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="p-5 bg-white border rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold">{o.nama_pembeli}</p>
                <p className="text-xs text-gray-500">{o.alamat_lengkap}</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">{o.status}</span>
            </div>
            
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Kirim ke Kurir:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {kurirs.map(k => (
                <button key={k.id} onClick={() => teruskanKeKurir(o, k)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                  {k.nama_kurir}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
