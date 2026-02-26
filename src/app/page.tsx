'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { checkIsStoreOpen } from '@/lib/shopStatus';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: prod } = await supabase.from('products').select('*').order('id', { ascending: false });
      const { data: set } = await supabase.from('settings').select('*').single();
      setProducts(prod || []);
      setSettings(set);
      setLoading(false);
    }
    fetchData();
  }, []);

  const isOpen = checkIsStoreOpen(settings);

  if (loading) return <div className="flex justify-center items-center h-screen font-bold italic text-indigo-600">Loading Kongkonan...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* HERO SECTION */}
      <div className="bg-indigo-700 rounded-[3rem] p-8 text-white mb-8 relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic leading-none mb-2 uppercase">Jasa Kurir<br/>Terpercaya</h2>
          <p className="text-indigo-100 text-sm max-w-[200px]">Titip belanja atau antar barang jadi lebih mudah.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600 rounded-full opacity-50"></div>
      </div>

      {/* PRODUK GRID */}
      <h3 className="text-xl font-black italic mb-4 px-2 uppercase tracking-tight">Katalog Kami</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <div key={item.id} className="card-produk flex flex-col justify-between">
            <div>
              <div className="relative mb-3">
                <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-[1.5rem]" />
                {item.category === 'Promo' && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-lg">PROMO</span>
                )}
              </div>
              <h4 className="font-bold text-gray-800 leading-tight mb-1">{item.name}</h4>
              <p className="text-indigo-600 font-black mb-3 text-lg">Rp {item.price.toLocaleString()}</p>
            </div>
            
            <button 
              disabled={!isOpen}
              onClick={() => {/* Fungsi Add to Cart */}}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-tighter transition-all ${
                isOpen ? 'bg-black text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isOpen ? '+ Keranjang' : 'Toko Tutup'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
