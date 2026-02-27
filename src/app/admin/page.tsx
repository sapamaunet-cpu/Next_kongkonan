'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []);
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const seller_name = formData.get('seller_name') as string; // TAMBAHAN: Ambil dari input

    if (!file) return alert("Pilih foto produk!");
    setUploading(true);

    // 1. Upload ke Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: upData, error: upError } = await supabase.storage
      .from('produk-foto')
      .upload(fileName, file);

    if (upError) {
      setUploading(false);
      return alert(upError.message);
    }

    // 2. Ambil URL
    const { data: urlData } = supabase.storage.from('produk-foto').getPublicUrl(fileName);

    // 3. Simpan ke Database
    const { error: dbError } = await supabase.from('products').insert([{
      name,
      price: parseInt(price),
      image: urlData.publicUrl,
      seller_name: seller_name // TAMBAHAN: Simpan ke kolom seller_name
    }]);

    if (dbError) {
      alert("Gagal simpan ke database: " + dbError.message);
    } else {
      alert("Produk berhasil ditambahkan!");
      window.location.reload();
    }
    
    setUploading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black italic mb-6">ADMIN: KELOLA PRODUK</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-3xl border mb-10 space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 ml-1">Foto Produk</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-2" />
        </div>
        
        <input name="name" placeholder="Nama Produk" className="w-full p-3 bg-gray-50 rounded-xl" required />
        
        {/* TAMBAHAN: Input Nama Toko */}
        <input name="seller_name" placeholder="Nama Toko / Penjual" className="w-full p-3 bg-gray-50 rounded-xl border-l-4 border-green-500" required />
        
        <input name="price" type="number" placeholder="Harga" className="w-full p-3 bg-gray-50 rounded-xl" required />
        
        <button disabled={uploading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          {uploading ? 'Mengupload...' : 'TAMBAH PRODUK'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border p-3 rounded-2xl flex items-center gap-4">
            <img src={p.image} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight">{p.name}</p>
              {/* Menampilkan Nama Toko di List Admin */}
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Seller: {p.seller_name || '-'}</p>
              <p className="text-xs text-indigo-600 font-black mt-1">Rp {p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
              }
