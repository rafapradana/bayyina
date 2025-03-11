import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { QuranProvider } from "./context/QuranContext";

import Index from "./pages/Index";
import SurahPage from "./pages/SurahPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import BookmarkPage from "./pages/Bookmark";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <QuranProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/surah/:id" element={<SurahPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/bookmark" element={<BookmarkPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QuranProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
