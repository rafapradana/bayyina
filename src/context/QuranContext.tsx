import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// List qori yang tersedia
export const AVAILABLE_QARIS = [
  { id: "01", name: "Abdullah Al-Juhany" },
  { id: "02", name: "Abdul Muhsin Al-Qasim" },
  { id: "03", name: "Abdurrahman as-Sudais" },
  { id: "04", name: "Ibrahim Al-Dossari" },
  { id: "05", name: "Misyari Rasyid Al-Afasi" }
];

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: {
    [key: string]: string;
  }; // Ubah ke object untuk mendukung berbagai qori
}

interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  }; // Ubah ke object untuk mendukung berbagai qori
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
  selectedQari: string;
  toggleTranslation: () => void;
  fetchSurahDetail: (id: number) => Promise<void>;
  searchSurahs: (query: string) => Surah[];
  setSelectedQari: (qariId: string) => void;
  getQariName: (qariId: string) => string;
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
  const [selectedQari, setSelectedQari] = useState<string>(() => {
    const stored = localStorage.getItem("selectedQari");
    return stored || "01"; // Default to Abdullah Al-Juhany
  });
  
  const { toast } = useToast();

  // Save qari preference to localStorage
  useEffect(() => {
    localStorage.setItem("selectedQari", selectedQari);
  }, [selectedQari]);

  // Fungsi untuk mendapatkan nama qari berdasarkan ID
  const getQariName = (qariId: string): string => {
    const qari = AVAILABLE_QARIS.find(q => q.id === qariId);
    return qari ? qari.name : "Unknown";
  };

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
      console.log(data.data);
      
      // Normalize audio format for backwards compatibility
      const normalizedData = { ...data.data };
      
      // If audioFull is a string, convert it to object format
      if (typeof normalizedData.audioFull === 'string') {
        normalizedData.audioFull = {
          "01": normalizedData.audioFull
        };
      } else if (!normalizedData.audioFull) {
        normalizedData.audioFull = {}; // Ensure it's at least an empty object
      }
      
      // Normalize audio format for each ayat
      if (normalizedData.ayat) {
        normalizedData.ayat = normalizedData.ayat.map(ayah => ({
          ...ayah,
          audio: typeof ayah.audio === 'string' ? { "01": ayah.audio } : (ayah.audio || {})
        }));
      }
      
      setCurrentSurah(normalizedData);
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
        selectedQari,
        toggleTranslation,
        fetchSurahDetail,
        searchSurahs,
        setSelectedQari,
        getQariName,
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
