'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [settings, setSettings] = useState({ whatsapp_admin: '', jam_buka: '', jam_tutup: '', is_manual_closed: false });
  const [newKurir, setNewKurir] = useState({ nama: '', wa: '' });

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (data) setSettings(data);
  }

  const saveSettings = async () => {
    await supabase.from('settings').update(settings).eq('id', 1);
    alert("Pengaturan Toko Disimpan!");
  };

  const addKurir = async () => {
    await supabase.from('kurir').insert([{ nama_kurir: newKurir.nama, whatsapp_kurir: newKurir.wa }]);
    alert("Kurir Ditambahkan!");
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-3xl border">
        <h2 className="font-black mb-4 uppercase text-indigo-700">Jam & No WA Toko</h2>
        <input value={settings.whatsapp_admin} onChange={e => setSettings({...settings, whatsapp_admin: e.target.value})} placeholder="WA Toko (628...)" className="w-full p-3 bg-gray-50 rounded-xl mb-4" />
        <div className="flex gap-4 mb-4">
          <input type="time" value={settings.jam_buka} onChange={e => setSettings({...settings, jam_buka: e.target.value})} className="p-3 bg-gray-50 rounded-xl flex-1" />
          <input type="time" value={settings.jam_tutup} onChange={e => setSettings({...settings, jam_tutup: e.target.value})} className="p-3 bg-gray-50 rounded-xl flex-1" />
        </div>
        <button onClick={saveSettings} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">SIMPAN PENGATURAN</button>
      </div>

      <div className="bg-white p-6 rounded-3xl border">
        <h2 className="font-black mb-4 uppercase text-indigo-700">Tambah Kurir</h2>
        <input placeholder="Nama Kurir" onChange={e => setNewKurir({...newKurir, nama: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl mb-2" />
        <input placeholder="WA Kurir (628...)" onChange={e => setNewKurir({...newKurir, wa: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl mb-4" />
        <button onClick={addKurir} className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase text-xs">Tambah Data Kurir</button>
      </div>
    </div>
  );
                                                                                   }
