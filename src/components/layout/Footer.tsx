
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Quran Digital</h3>
            <p className="text-sm text-muted-foreground">
              Aplikasi Al-Quran digital dengan terjemahan bahasa Indonesia, 
              fitur pencarian, dan audio murottal untuk memudahkan dalam 
              mempelajari Al-Quran.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Tautan</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  to="/bookmark" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Bookmark
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Tentang
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Sumber Data</h3>
            <p className="text-sm text-muted-foreground">
              Data Al-Quran yang ditampilkan diambil dari 
              <a 
                href="https://github.com/renomureza/quran-api-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary ml-1 hover:underline"
              >
                Quran API ID
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="h-3 w-3 text-destructive fill-destructive animate-pulse-gentle" /> {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
