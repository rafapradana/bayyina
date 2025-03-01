
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    
    toast({
      title: theme === "light" ? "Mode Gelap Diaktifkan" : "Mode Terang Diaktifkan",
      description: theme === "light" 
        ? "Tampilan telah diubah ke mode gelap" 
        : "Tampilan telah diubah ke mode terang",
      duration: 2000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full w-9 h-9 transition-all duration-300 ease-in-out hover:bg-accent"
      aria-label={theme === "light" ? "Beralih ke mode gelap" : "Beralih ke mode terang"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground/80" />
      ) : (
        <Sun className="h-5 w-5 text-foreground/80" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Beralih ke mode gelap" : "Beralih ke mode terang"}
      </span>
    </Button>
  );
};

export default ThemeToggle;
