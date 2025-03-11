import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Proses callback autentikasi
    const handleAuthCallback = async () => {
      const { hash, search } = window.location;
      
      if (hash || search) {
        // Proses OAuth callback
        await supabase.auth.getSession();
        
        // Arahkan kembali ke halaman beranda
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Mengautentikasi...</h2>
            <p className="text-muted-foreground">Mohon tunggu sebentar, Anda akan dialihkan.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthCallback; 