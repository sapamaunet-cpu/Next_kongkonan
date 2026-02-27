import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { checkIsStoreOpen } from '@/lib/shopStatus';
import Link from 'next/link';

export const revalidate = 0; // Agar data selalu fresh

export default async function HomePage() {
  // 1. Ambil Data Produk & Settings dari Supabase
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const { data: settings } = await supabase.from('settings').select('*').single();
  
  const status = checkIsStoreOpen(settings);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-green-100 text-center">
        <div className="flex justify-center mb-4">
          <Image 
            src="/logo.png" 
            alt="Kongkonan Logo" 
            width={120} 
            height={120} 
            className="drop-shadow-md"
          />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          KONG<span className="text-green-600">KONAN</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Solusi Belanja & Kurir Terpercaya</p>

        {/* Status Toko Badge */}
        <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
          status.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${status.isOpen ? 'bg-green-600' : 'bg-red-600'}`}></span>
          {status.isOpen ? `BUKA (Tutup jam ${settings?.jam_tutup})` : 'TOKO SEDANG TUTUP'}
        </div>
      </section>

      {/* --- KATALOG PRODUK --- */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Menu Pilihan</h2>
          <span className="text-xs font-medium px-3 py-1 bg-white border rounded-lg text-slate-400">
            {products?.length || 0} Produk
          </span>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-transparent hover:border-green-400 transition-all group">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-slate-100">
                <Image 
                  src={item.image || '/placeholder.png'} 
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-slate-800 leading-tight h-10 line-clamp-2">
                {item.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-600 font-bold">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
                <Link 
                  href={`/produk/${item.id}`}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Jika Produk Kosong */}
        {(!products || products.length === 0) && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Belum ada produk yang ditambahkan.</p>
          </div>
        )}
      </main>

      {/* Floating Button Admin (Hanya tampil saat dev/admin) */}
      <Link href="/admin" className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </Link>
    </div>
  );
}
