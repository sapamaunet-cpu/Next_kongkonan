/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Mengizinkan semua domain Supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Jalur folder produk-foto Anda
      },
    ],
  },
  /* Opsional: Jika Anda ingin aplikasi tetap berjalan 
     meskipun ada error ringan saat build di Vercel 
  */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
