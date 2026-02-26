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

    if (!file) return alert("Pilih foto produk!");
    setUploading(true);

    // 1. Upload ke Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: upData, error: upError } = await supabase.storage
      .from('produk-foto')
      .upload(fileName, file);

    if (upError) return alert(upError.message);

    // 2. Ambil URL
    const { data: urlData } = supabase.storage.from('produk-foto').getPublicUrl(fileName);

    // 3. Simpan ke Database
    await supabase.from('products').insert([{
      name,
      price: parseInt(price),
      image: urlData.publicUrl
    }]);

    setUploading(false);
    alert("Produk berhasil ditambahkan!");
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black italic mb-6">ADMIN: KELOLA PRODUK</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-3xl border mb-10 space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-2" />
        <input name="name" placeholder="Nama Produk" className="w-full p-3 bg-gray-50 rounded-xl" required />
        <input name="price" type="number" placeholder="Harga" className="w-full p-3 bg-gray-50 rounded-xl" required />
        <button disabled={uploading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
          {uploading ? 'Mengupload...' : 'TAMBAH PRODUK'}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border p-3 rounded-2xl flex items-center gap-4">
            <img src={p.image} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-xs text-indigo-600 font-bold">Rp {p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
