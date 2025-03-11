import { supabase } from './supabase';

// Tipe data untuk bookmark
export interface Bookmark {
  id?: string;
  user_id: string;
  surah_id: number;
  ayah_number?: number;
  name: string;
  created_at?: string;
}

// Tipe data untuk posisi terakhir dibaca
export interface LastRead {
  id?: string;
  user_id: string;
  surah_id: number;
  ayah_number: number;
  updated_at?: string;
}

// Fungsi untuk mendapatkan semua bookmark pengguna
export const getUserBookmarks = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Fungsi untuk menambahkan bookmark baru
export const addBookmark = async (bookmark: Bookmark) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([bookmark])
    .select();

  return { data, error };
};

// Fungsi untuk menghapus bookmark
export const deleteBookmark = async (bookmarkId: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId);

  return { error };
};

// Fungsi untuk mendapatkan posisi terakhir dibaca pengguna
export const getLastRead = async (userId: string) => {
  const { data, error } = await supabase
    .from('last_read')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

// Fungsi untuk menyimpan atau memperbarui posisi terakhir dibaca
export const updateLastRead = async (lastRead: LastRead) => {
  // Cek apakah sudah ada posisi terakhir dibaca
  const { data: existingData } = await supabase
    .from('last_read')
    .select('id')
    .eq('user_id', lastRead.user_id)
    .single();

  // Jika sudah ada, update; jika belum, buat baru
  if (existingData?.id) {
    const { data, error } = await supabase
      .from('last_read')
      .update({
        surah_id: lastRead.surah_id,
        ayah_number: lastRead.ayah_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingData.id)
      .select();

    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('last_read')
      .insert([{
        ...lastRead,
        updated_at: new Date().toISOString()
      }])
      .select();

    return { data, error };
  }
};

// Fungsi untuk menyimpan posisi terakhir dibaca secara manual
export const saveLastRead = async (lastRead: LastRead) => {
  // Cek apakah sudah ada posisi terakhir dibaca
  const { data: existingData } = await supabase
    .from('last_read')
    .select('id')
    .eq('user_id', lastRead.user_id)
    .single();

  if (existingData?.id) {
    return await supabase
      .from('last_read')
      .update({
        surah_id: lastRead.surah_id,
        ayah_number: lastRead.ayah_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingData.id)
      .select();
  } else {
    return await supabase
      .from('last_read')
      .insert([{
        ...lastRead,
        updated_at: new Date().toISOString()
      }])
      .select();
  }
}; 