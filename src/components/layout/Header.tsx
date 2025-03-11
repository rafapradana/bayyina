import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, MenuIcon, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/LoginButton";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out", isScrolled ? "py-2 glass shadow-sm" : "py-4 bg-transparent")}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-medium text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="text-lg">Bayyina</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className={cn("nav-link", location.pathname === "/" && "active")}>
            Beranda
          </Link>
          <Link to="/bookmark" className={cn("nav-link", location.pathname === "/bookmark" && "active")}>
            Bookmark
          </Link>
          <Link to="/about" className={cn("nav-link", location.pathname === "/about" && "active")}>
            Tentang
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LoginButton />
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden glass animate-fade-in py-4 px-4 max-h-[75vh] overflow-y-auto">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className={cn("nav-link text-center py-2", location.pathname === "/" && "active")}>
              Beranda
            </Link>
            <Link to="/bookmark" className={cn("nav-link text-center py-2", location.pathname === "/bookmark" && "active")}>
              Bookmark
            </Link>
            <Link to="/about" className={cn("nav-link text-center py-2", location.pathname === "/about" && "active")}>
              Tentang
            </Link>
          </nav>
        </div>}
    </header>;
};
export default Header;