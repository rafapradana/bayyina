import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HistoryIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { getLastRead } from '@/lib/bookmarkService';
import { useQuran } from '@/context/QuranContext';

export const LastReadShortcut = () => {
  const [lastRead, setLastRead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { surahs } = useQuran();
  
  // Fungsi untuk mendapatkan nama surat berdasarkan ID
  const getSurahName = (id: number) => {
    const surah = surahs?.find(s => s.nomor === id);
    return surah?.namaLatin || `Surah ${id}`;
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLastRead = async () => {
      try {
        setLoading(true);
        const { data, error } = await getLastRead(user.id);
        
        if (error) throw error;
        
        if (data) {
          setLastRead(data);
        }
      } catch (error) {
        console.error('Error fetching last read:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastRead();
  }, [user]);

  if (!user || (!loading && !lastRead)) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-6 p-3 flex flex-col items-center">
        <Skeleton className="h-6 w-6 rounded-full mb-2" />
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  const surahName = getSurahName(lastRead.surah_id);

  return (
    <div className="mb-6 flex flex-col items-center text-center bg-muted/20 py-4 px-2 rounded-lg border border-primary/10">
      <div className="bg-primary/10 p-2 rounded-full mb-2">
        <HistoryIcon className="h-5 w-5 text-primary" />
      </div>
      
      <h3 className="text-base font-medium mb-0.5">Terakhir Dibaca</h3>
      
      <p className="text-sm text-muted-foreground mb-3">
        {surahName}, Ayat {lastRead.ayah_number}
      </p>
      
      <Button asChild size="sm" variant="outline" className="gap-1 px-4">
        <Link to={`/surah/${lastRead.surah_id}${lastRead.ayah_number ? `#ayat-${lastRead.ayah_number}` : ''}`}>
          <span>Lanjutkan</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}; 