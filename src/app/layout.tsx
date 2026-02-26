import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KONGKONAN - Jasa Kurir & Belanja Lokal",
  description: "Solusi belanja harian dan jasa antar jemput barang terpercaya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50 selection:bg-indigo-100 selection:text-indigo-700">
        <Navbar />
        {/* Konten Utama */}
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
