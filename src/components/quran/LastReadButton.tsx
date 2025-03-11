import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HistoryIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { saveLastRead } from '@/lib/bookmarkService';

interface LastReadButtonProps {
  surahId: number;
  ayahNumber: number;
  surahName: string;
}

export const LastReadButton = ({ surahId, ayahNumber, surahName }: LastReadButtonProps) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveLastRead = async () => {
    if (!user) {
      toast({
        title: 'Masuk diperlukan',
        description: 'Silakan masuk untuk menyimpan posisi terakhir baca',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await saveLastRead({
        user_id: user.id,
        surah_id: surahId,
        ayah_number: ayahNumber,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      toast({
        title: 'Posisi terakhir baca disimpan',
        description: `Surah ${surahName} ayat ${ayahNumber} ditandai sebagai terakhir dibaca`,
      });
    } catch (error) {
      console.error('Error saving last read position:', error);
      toast({
        title: 'Gagal menyimpan posisi',
        description: 'Terjadi kesalahan saat menyimpan posisi terakhir baca',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={handleSaveLastRead}
      disabled={saving}
      title="Tandai sebagai terakhir dibaca"
    >
      {success ? (
        <CheckCircle className="h-4 w-4 text-primary" />
      ) : (
        <HistoryIcon className="h-4 w-4" />
      )}
    </Button>
  );
}; 