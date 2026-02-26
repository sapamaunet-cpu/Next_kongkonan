/**
 * Fungsi untuk mengecek status operasional toko
 * @param settings - Objek dari tabel settings (jam_buka, jam_tutup, is_manual_closed)
 */
export function checkIsStoreOpen(settings: any): boolean {
  if (!settings) return false;

  // 1. Cek jika admin menutup toko secara manual (darurat)
  if (settings.is_manual_closed) return false;

  // 2. Ambil waktu saat ini dalam format HH:mm (24 Jam)
  const sekarang = new Date();
  const jamMenitSekarang = sekarang.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta' // Pastikan sesuai dengan zona waktu Anda
  });

  const jamBuka = settings.jam_buka; // Format dari DB biasanya 'HH:mm:ss'
  const jamTutup = settings.jam_tutup;

  // 3. Perbandingan waktu
  // Membandingkan string "09:00" >= "08:00" secara leksikografis bekerja dengan baik untuk format 24 jam
  return jamMenitSekarang >= jamBuka && jamMenitSekarang <= jamTutup;
}

/**
 * Fungsi format mata uang Rupiah
 */
export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
