
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, Copy, Check, Volume2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuran } from "@/context/QuranContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";

interface SurahDetailProps {
  surahId?: string;
}

const SurahDetail = ({ surahId }: SurahDetailProps) => {
  const navigate = useNavigate();
  const { currentSurah, isLoadingDetail, fetchSurahDetail, showTranslation, toggleTranslation } = useQuran();
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Validate ID and fetch surah data - only run when surahId changes
  useEffect(() => {
    if (!surahId) {
      navigate("/");
      return;
    }
    
    const surahIdNumber = parseInt(surahId);
    
    if (isNaN(surahIdNumber) || surahIdNumber < 1 || surahIdNumber > 114) {
      navigate("/not-found");
      return;
    }
    
    // Reset playing ayah when changing surahs
    setPlayingAyah(null);
    fetchSurahDetail(surahIdNumber);
  }, [surahId, navigate, fetchSurahDetail]);

  // Scroll to top when surah changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    window.scrollTo(0, 0);
  }, [surahId]);

  // Copy ayah text to clipboard - memoized with useCallback
  const copyAyahText = useCallback(async (text: string, ayahNumber: number) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setIsCopied(prev => ({ ...prev, [ayahNumber]: true }));
      
      toast({
        title: "Teks disalin",
        description: "Teks ayat berhasil disalin ke clipboard",
        duration: 2000,
      });
      
      // Clear copied state after delay
      setTimeout(() => {
        setIsCopied(prev => ({ ...prev, [ayahNumber]: false }));
      }, 2000);
    } catch (err) {
      toast({
        title: "Gagal menyalin teks",
        description: "Terjadi kesalahan saat menyalin teks",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle audio playback - memoized with useCallback
  const playAyahAudio = useCallback((ayahNumber: number) => {
    setPlayingAyah(prev => prev === ayahNumber ? null : ayahNumber);
  }, []);

  // When audio finishes playing - memoized with useCallback
  const handleAudioEnded = useCallback(() => {
    setPlayingAyah(null);
  }, []);

  // Memoize Ayah component to prevent unnecessary re-renders
  const AyahItem = useMemo(() => {
    return ({ ayah, isPlaying, hasCopied }: { 
      ayah: { nomorAyat: number; teksArab: string; teksLatin: string; teksIndonesia: string; audio: string }; 
      isPlaying: boolean;
      hasCopied: boolean;
    }) => (
      <div 
        key={`ayah-${ayah.nomorAyat}`}
        className={cn(
          "pb-6 border-b border-border/40 group",
          isPlaying ? "bg-primary/5 rounded-lg p-4 -mx-4" : ""
        )}
        data-ayah-id={ayah.nomorAyat}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
            {ayah.nomorAyat}
          </div>
          
          <div className="flex items-center space-x-2 opacity-100 sm:opacity-70 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => copyAyahText(ayah.teksArab, ayah.nomorAyat)}
            >
              {hasCopied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                isPlaying && "text-primary"
              )}
              onClick={() => playAyahAudio(ayah.nomorAyat)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-right leading-loose text-xl md:text-2xl mb-4 font-quran">
          {ayah.teksArab}
        </p>
        
        {showTranslation && (
          <div className="space-y-2">
            <p className="text-muted-foreground italic text-sm">
              {ayah.teksLatin}
            </p>
            <p className="text-foreground">
              {ayah.teksIndonesia}
            </p>
          </div>
        )}
        
        {isPlaying && ayah.audio && (
          <div className="mt-4">
            <AudioPlayer
              key={`player-${ayah.nomorAyat}`}
              src={ayah.audio}
              title={`Ayat ${ayah.nomorAyat}`}
              onEnded={handleAudioEnded}
            />
          </div>
        )}
      </div>
    );
  }, [copyAyahText, playAyahAudio, handleAudioEnded, showTranslation]);

  // Memoize loading skeleton to prevent re-renders
  const loadingSkeleton = useMemo(() => (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-2" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        
        <div className="space-y-8 mt-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-4 border-b pb-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full inline-block" />
                  <Skeleton className="h-8 w-8 rounded-full inline-block" />
                </div>
              </div>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ), []);

  if (isLoadingDetail || !currentSurah) {
    return loadingSkeleton;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl" ref={contentRef}>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-2" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-lg font-medium">
          Surah {currentSurah.namaLatin}
        </h1>
      </div>
      
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-quran font-bold">{currentSurah.nama}</h2>
        
        <div className="space-y-1">
          <p className="text-lg font-medium">{currentSurah.namaLatin}</p>
          <p className="text-muted-foreground">{currentSurah.arti}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline">{currentSurah.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"}</Badge>
            <Badge variant="outline">{currentSurah.jumlahAyat} Ayat</Badge>
          </div>
        </div>
        
        {currentSurah.audioFull && (
          <div className="mt-6 max-w-md mx-auto">
            <AudioPlayer
              key="full-surah-audio"
              src={currentSurah.audioFull}
              title={`Murottal Surah ${currentSurah.namaLatin}`}
            />
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full flex items-center gap-2"
            onClick={toggleTranslation}
          >
            {showTranslation ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Sembunyikan Terjemahan</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Tampilkan Terjemahan</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-12 mt-12">
        {currentSurah.ayat.map((ayah) => (
          <AyahItem
            key={ayah.nomorAyat}
            ayah={ayah}
            isPlaying={playingAyah === ayah.nomorAyat}
            hasCopied={!!isCopied[ayah.nomorAyat]}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
