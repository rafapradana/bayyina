
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: string;
}

interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: string;
}

interface SurahDetail extends Surah {
  ayat: Ayah[];
}

interface QuranContextType {
  surahs: Surah[];
  currentSurah: SurahDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  showTranslation: boolean;
  toggleTranslation: () => void;
  fetchSurahDetail: (id: number) => Promise<void>;
  searchSurahs: (query: string) => Surah[];
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState<boolean>(() => {
    const stored = localStorage.getItem("showTranslation");
    return stored ? JSON.parse(stored) : true;
  });
  
  const { toast } = useToast();

  // Fetch all surahs on initial load
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://equran.id/api/v2/surat");
        
        if (!response.ok) {
          throw new Error("Failed to fetch surahs");
        }
        
        const data = await response.json();
        setSurahs(data.data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data";
        setError(message);
        toast({
          title: "Gagal memuat data",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, [toast]);

  // Save translation preference to localStorage
  useEffect(() => {
    localStorage.setItem("showTranslation", JSON.stringify(showTranslation));
  }, [showTranslation]);

  // Toggle translation visibility
  const toggleTranslation = () => {
    setShowTranslation(prev => !prev);
  };

  // Fetch surah detail by ID
  const fetchSurahDetail = async (id: number) => {
    try {
      setIsLoadingDetail(true);
      const response = await fetch(`https://equran.id/api/v2/surat/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch surah detail for ID: ${id}`);
      }
      
      const data = await response.json();
      setCurrentSurah(data.data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat detail surah";
      setError(message);
      toast({
        title: "Gagal memuat detail surah",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Search surahs by name, latin name, or number
  const searchSurahs = (query: string): Surah[] => {
    if (!query.trim()) return surahs;
    
    const normalized = query.toLowerCase().trim();
    return surahs.filter(surah => 
      surah.nama.toLowerCase().includes(normalized) ||
      surah.namaLatin.toLowerCase().includes(normalized) ||
      surah.nomor.toString() === normalized
    );
  };

  return (
    <QuranContext.Provider 
      value={{
        surahs,
        currentSurah,
        isLoading,
        isLoadingDetail,
        error,
        showTranslation,
        toggleTranslation,
        fetchSurahDetail,
        searchSurahs,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = (): QuranContextType => {
  const context = useContext(QuranContext);
  
  if (context === undefined) {
    throw new Error("useQuran must be used within a QuranProvider");
  }
  
  return context;
};
