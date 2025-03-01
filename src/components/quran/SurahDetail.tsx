
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, Copy, Check, Volume2, Eye, EyeOff } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuran } from "@/context/QuranContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";

const SurahDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSurah, isLoadingDetail, fetchSurahDetail, showTranslation, toggleTranslation } = useQuran();
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Validate ID and fetch surah data
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    
    const surahId = parseInt(id);
    
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      navigate("/not-found");
      return;
    }
    
    fetchSurahDetail(surahId);
    
    // Reset playing ayah when changing surahs
    setPlayingAyah(null);
  }, [id, navigate, fetchSurahDetail]);

  // Scroll to top when surah changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    window.scrollTo(0, 0);
  }, [id]);

  // Copy ayah text to clipboard - memoized with useCallback
  const copyAyahText = useCallback(async (text: string, ayahNumber: number) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setIsCopied((prev) => ({ ...prev, [ayahNumber]: true }));
      
      toast({
        title: "Teks disalin",
        description: "Teks ayat berhasil disalin ke clipboard",
        duration: 2000,
      });
      
      setTimeout(() => {
        setIsCopied((prev) => ({ ...prev, [ayahNumber]: false }));
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
    setPlayingAyah(ayahNumber);
  }, []);

  // When audio finishes playing - memoized with useCallback
  const handleAudioEnded = useCallback(() => {
    setPlayingAyah(null);
  }, []);

  if (isLoadingDetail || !currentSurah) {
    return (
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
    );
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
          <div 
            key={ayah.nomorAyat} 
            className={cn(
              "pb-6 border-b border-border/40 transition-all duration-300 group",
              playingAyah === ayah.nomorAyat && "bg-primary/5 rounded-lg p-4 -mx-4"
            )}
            // Loading all audio at once can cause performance issues, so let's add a lazy loading hint
            data-ayah-id={ayah.nomorAyat}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                {ayah.nomorAyat}
              </div>
              
              <div className="flex items-center space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => copyAyahText(ayah.teksArab, ayah.nomorAyat)}
                >
                  {isCopied[ayah.nomorAyat] ? (
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
                    playingAyah === ayah.nomorAyat && "text-primary"
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
              <div className="space-y-2 animate-fade-in">
                <p className="text-muted-foreground italic text-sm">
                  {ayah.teksLatin}
                </p>
                <p className="text-foreground">
                  {ayah.teksIndonesia}
                </p>
              </div>
            )}
            
            {playingAyah === ayah.nomorAyat && ayah.audio && (
              <div className="mt-4 animate-fade-in">
                <AudioPlayer
                  key={`audio-${ayah.nomorAyat}`}
                  src={ayah.audio}
                  title={`Ayat ${ayah.nomorAyat}`}
                  onEnded={handleAudioEnded}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
