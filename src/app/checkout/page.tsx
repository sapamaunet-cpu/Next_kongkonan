'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const WILAYAH = { "Area Kampus": 2000, "Luar Kampus": 7000, "Ambil Sendiri": 0 };

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ nama: '', alamat: '', wilayah: 'Area Kampus' });
  const [waAdmin, setWaAdmin] = useState('');

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: cart } = await supabase.from('keranjang').select('*').eq('user_id', user?.id);
      const { data: set } = await supabase.from('settings').select('whatsapp_admin').single();
      setItems(cart || []);
      setWaAdmin(set?.whatsapp_admin || '628xxx');
    };
    getData();
  }, []);

  const subtotal = items.reduce((acc, i) => acc + (i.harga * i.jumlah), 0);
  const ongkir = WILAYAH[form.wilayah as keyof typeof WILAYAH];
  const total = subtotal + ongkir;

  const handleOrder = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Simpan ke Supabase
    const { error } = await supabase.from('pesanan').insert([{
      user_id: user?.id,
      nama_pembeli: form.nama,
      alamat_lengkap: form.alamat,
      total_bayar: total,
      ongkir: ongkir,
      daftar_barang: items,
      status: 'Proses'
    }]);

    if (!error) {
      // 2. Clear Keranjang
      await supabase.from('keranjang').delete().eq('user_id', user?.id);
      
      // 3. Pesan WA
      const list = items.map(i => `- ${i.nama_item} (x${i.jumlah})`).join('\n');
      const teks = `*PESANAN BARU*\n\n${list}\n\n*Total:* Rp ${total.toLocaleString()}\n*Alamat:* ${form.alamat}`;
      window.open(`https://wa.me/${waAdmin}?text=${encodeURIComponent(teks)}`);
      window.location.href = '/riwayat';
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-black italic">CHECKOUT</h1>
      <div className="space-y-4 bg-white p-6 rounded-3xl border shadow-sm">
        <input placeholder="Nama Penerima" className="w-full p-4 bg-gray-50 rounded-2xl" onChange={e => setForm({...form, nama: e.target.value})} />
        <textarea placeholder="Alamat Lengkap" className="w-full p-4 bg-gray-50 rounded-2xl" onChange={e => setForm({...form, alamat: e.target.value})} />
        <select className="w-full p-4 bg-gray-50 rounded-2xl" onChange={e => setForm({...form, wilayah: e.target.value})}>
          {Object.keys(WILAYAH).map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div className="bg-indigo-600 p-6 rounded-3xl text-white">
        <div className="flex justify-between font-bold text-xl">
          <span>Total Bayar</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
        <button onClick={handleOrder} className="w-full bg-white text-indigo-600 mt-6 py-4 rounded-2xl font-black">PESAN SEKARANG</button>
      </div>
    </div>
  );
}
