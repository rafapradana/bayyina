-- SCHEMA FOR BAYYINA APP
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABEL BOOKMARKS 
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_id INTEGER NOT NULL,
    ayah_number INTEGER,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_surah_id CHECK (surah_id >= 1 AND surah_id <= 114)
);

-- Menambahkan indeks untuk performa query
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);

-- Mengatur Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Membuat policy agar pengguna hanya bisa melihat bookmark mereka sendiri
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks FOR SELECT 
USING (auth.uid() = user_id);

-- Membuat policy agar pengguna hanya bisa menambahkan bookmark untuk diri mereka sendiri
CREATE POLICY "Users can insert their own bookmarks" 
ON public.bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Membuat policy agar pengguna hanya bisa menghapus bookmark mereka sendiri
CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- TABEL LAST READ
-- ==========================================
CREATE TABLE IF NOT EXISTS public.last_read (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_id INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_surah_id CHECK (surah_id >= 1 AND surah_id <= 114),
    CONSTRAINT unique_user_last_read UNIQUE (user_id)
);

-- Menambahkan indeks untuk performa query
CREATE INDEX IF NOT EXISTS last_read_user_id_idx ON public.last_read(user_id);

-- Mengatur Row Level Security (RLS)
ALTER TABLE public.last_read ENABLE ROW LEVEL SECURITY;

-- Membuat policy agar pengguna hanya bisa melihat posisi terakhir dibaca mereka sendiri
CREATE POLICY "Users can view their own last read position" 
ON public.last_read FOR SELECT 
USING (auth.uid() = user_id);

-- Membuat policy agar pengguna hanya bisa menambahkan posisi terakhir dibaca untuk diri mereka sendiri
CREATE POLICY "Users can insert their own last read position" 
ON public.last_read FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Membuat policy agar pengguna hanya bisa mengupdate posisi terakhir dibaca mereka sendiri
CREATE POLICY "Users can update their own last read position" 
ON public.last_read FOR UPDATE 
USING (auth.uid() = user_id);

-- ==========================================
-- OTENTIKASI & PENGATURAN TAMBAHAN
-- ==========================================

-- Mengatur Supabase Auth untuk menerima login Google
-- (Catatan: Ini perlu dikonfigurasi melalui dashboard Supabase juga)

-- Function untuk memperbarui timestamp terakhir saat update data
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk last_read
CREATE TRIGGER update_last_read_timestamp
BEFORE UPDATE ON public.last_read
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 