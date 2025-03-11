import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, Copy, Check, Volume2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuran } from "@/context/QuranContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./BookmarkButton";
import { LastReadButton } from "./LastReadButton";
import { useAuth } from "@/context/AuthContext";

interface SurahDetailProps {
  surahId?: string;
}

const SurahDetail = ({ surahId }: SurahDetailProps) => {
  const navigate = useNavigate();
  const { currentSurah, isLoadingDetail, fetchSurahDetail, showTranslation, toggleTranslation, surahs } = useQuran();
  const [isCopied, setIsCopied] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const ayahElementsRef = useRef<HTMLElement[]>([]);
  const { user } = useAuth();
  
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
    if (currentSurah?.nomor !== surahIdNumber) {
      console.log('Fetching surah detail for ID:', surahIdNumber);
      fetchSurahDetail(surahIdNumber);
    }
  }, [surahId, navigate, fetchSurahDetail, currentSurah]);

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

  // Memoize Ayah component to prevent unnecessary re-renders
  const AyahItem = useMemo(() => {
    return ({ ayah, hasCopied }: { 
      ayah: { nomorAyat: number; teksArab: string; teksLatin: string; teksIndonesia: string; audio: { [key: string]: string } | string }; 
      hasCopied: boolean;
    }) => {
      console.log('Ayah data:', ayah);
      return (
        <div 
          key={`ayah-${ayah.nomorAyat}`}
          className="pb-6 border-b border-border/40"
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
              <BookmarkButton 
                surahId={currentSurah?.nomor || 0} 
                surahName={currentSurah?.namaLatin || ''} 
                ayahNumber={ayah.nomorAyat} 
              />
              <LastReadButton
                surahId={currentSurah?.nomor || 0}
                surahName={currentSurah?.namaLatin || ''}
                ayahNumber={ayah.nomorAyat}
              />
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
        </div>
      );
    };
  }, [copyAyahText, showTranslation, currentSurah]);

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

  // Get previous and next surah information
  const getAdjacentSurahs = useMemo(() => {
    if (!currentSurah || !surahs.length) return { prevSurah: null, nextSurah: null };
    
    const currentSurahNumber = currentSurah.nomor;
    let prevSurah = null;
    let nextSurah = null;
    
    if (currentSurahNumber > 1) {
      prevSurah = surahs.find(surah => surah.nomor === currentSurahNumber - 1) || null;
    }
    
    if (currentSurahNumber < 114) {
      nextSurah = surahs.find(surah => surah.nomor === currentSurahNumber + 1) || null;
    }
    
    return { prevSurah, nextSurah };
  }, [currentSurah, surahs]);

  if (isLoadingDetail || !currentSurah) {
    return loadingSkeleton;
  }

  console.log('Loading:', isLoadingDetail); console.log('Ayat:', currentSurah.ayat);

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
        {user && (
          <div className="ml-auto">
            <BookmarkButton 
              surahId={currentSurah.nomor} 
              surahName={currentSurah.namaLatin} 
            />
          </div>
        )}
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
        
        {/* Navigation between surahs */}
        <div className="flex items-center justify-between mt-6 mb-2">
          {getAdjacentSurahs.prevSurah ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
              asChild
            >
              <Link to={`/surah/${getAdjacentSurahs.prevSurah.nomor}`}>
                <ArrowLeft className="h-4 w-4 text-primary" />
                <span>
                  <span className="text-muted-foreground mr-1 text-xs">{getAdjacentSurahs.prevSurah.nomor}.</span>
                  <span className="text-sm">{getAdjacentSurahs.prevSurah.namaLatin}</span>
                </span>
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
          
          {getAdjacentSurahs.nextSurah ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
              asChild
            >
              <Link to={`/surah/${getAdjacentSurahs.nextSurah.nomor}`}>
                <span>
                  <span className="text-muted-foreground mr-1 text-xs">{getAdjacentSurahs.nextSurah.nomor}.</span>
                  <span className="text-sm">{getAdjacentSurahs.nextSurah.namaLatin}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
        
        {currentSurah && currentSurah.audioFull && (
          <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border z-10">
            <AudioPlayer
              key={currentSurah.nomor}
              src={currentSurah.audioFull}
              title={`Murottal Surah ${currentSurah.namaLatin}`}
            />
          </div>
        )}
      </div>

      <div className="sticky top-20 z-10 py-2 bg-background/80 backdrop-blur-md border-y">
        <div className="container max-w-4xl mx-auto flex justify-center">
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
            hasCopied={!!isCopied[ayah.nomorAyat]}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
