'use client';
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl font-black italic text-gray-300 mb-4 uppercase">Kongkonan Service</h2>
        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
          Solusi jasa pengantaran dan belanja harian Anda. Cepat, Aman, dan Amanah.
        </p>
        <div className="flex justify-center gap-4">
            <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">fb</div>
            <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">ig</div>
            <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">wa</div>
        </div>
        <p className="mt-10 text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          &copy; 2024 Kongkonan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
