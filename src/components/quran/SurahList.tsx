
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuran } from "@/context/QuranContext";
import { ChevronRight, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";

const SurahList = () => {
  const { surahs, isLoading, searchSurahs } = useQuran();
  const [filteredSurahs, setFilteredSurahs] = useState(surahs);

  const handleSearch = (query: string) => {
    setFilteredSurahs(searchSurahs(query));
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 rounded-lg border border-border/40">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-4 space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSurahs.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Surah tidak ditemukan</h3>
              <p className="text-muted-foreground mt-1">
                Coba gunakan kata kunci lain
              </p>
            </div>
          ) : (
            filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                to={`/surah/${surah.nomor}`}
                className={cn(
                  "block p-4 rounded-lg border border-border/40 hover:border-primary/40",
                  "transition-all duration-300 hover:shadow-md glass-card"
                )}
              >
                <div className="flex items-center">
                  <div className="relative flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-medium">
                      {surah.nomor}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">
                        {surah.namaLatin}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
                        {surah.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground">
                        {surah.arti} • {surah.jumlahAyat} Ayat
                      </p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SurahList;
