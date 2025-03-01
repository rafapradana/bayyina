
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SurahDetail from "@/components/quran/SurahDetail";

const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <SurahDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default SurahPage;
