
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SurahList from "@/components/quran/SurahList";
import { useQuran } from "@/context/QuranContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { surahs, isLoading } = useQuran();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <section className="container mx-auto section-padding">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="mb-2" variant="outline">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Al-Quran Digital Indonesia</span>
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-balance">
              Baca Al-Quran dengan Terjemahan Bahasa Indonesia
            </h1>
            <p className="text-muted-foreground text-balance">
              Akses semua surah Al-Quran lengkap dengan terjemahan dan murottal. 
              Gunakan fitur pencarian untuk menemukan surah yang Anda inginkan.
            </p>
          </div>
          
          <div className="mt-12">
            <SurahList />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
