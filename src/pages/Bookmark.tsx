import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark as BookmarkIcon, Trash2, ChevronRight, BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getUserBookmarks, deleteBookmark, Bookmark as BookmarkType, getLastRead } from '@/lib/bookmarkService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [lastRead, setLastRead] = useState<BookmarkType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Jika user login, ambil data bookmark
    if (user) {
      const fetchBookmarks = async () => {
        setLoading(true);
        try {
          const { data, error } = await getUserBookmarks(user.id);
          if (error) throw error;
          setBookmarks(data || []);
          
          // Ambil posisi terakhir dibaca
          const { data: lastReadData } = await getLastRead(user.id);
          if (lastReadData) {
            setLastRead({
              id: lastReadData.id,
              user_id: lastReadData.user_id,
              surah_id: lastReadData.surah_id,
              ayah_number: lastReadData.ayah_number,
              name: 'Terakhir Dibaca',
              created_at: lastReadData.updated_at,
            });
          }
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
          toast({
            title: 'Gagal memuat bookmark',
            description: 'Terjadi kesalahan saat memuat bookmark Anda',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchBookmarks();
    } else {
      // Jika user tidak login, set loading ke false
      setLoading(false);
    }
  }, [user, toast]);

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await deleteBookmark(id);
      if (error) throw error;

      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      
      toast({
        title: 'Bookmark dihapus',
        description: 'Bookmark berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast({
        title: 'Gagal menghapus bookmark',
        description: 'Terjadi kesalahan saat menghapus bookmark',
        variant: 'destructive',
      });
    }
  };

  // Konten halaman
  const renderContent = () => {
    // Tampilkan loader saat sedang memuat data
    if (loading) {
      return (
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Bookmark</h1>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-9 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Tampilkan pesan login jika belum login
    if (!user) {
      return (
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Bookmark</h1>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookmarkIcon className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-xl font-semibold mb-2">Daftar dengan Google</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Masuk atau daftar dengan akun Google untuk menyimpan bookmark dan melanjutkan membaca dari posisi terakhir Anda.
            </p>
            <Button onClick={signIn} className="gap-2">
              <LogIn className="h-4 w-4" />
              <span>Masuk dengan Google</span>
            </Button>
          </div>
        </div>
      );
    }

    // Tampilkan bookmark jika sudah login
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Bookmark</h1>

        {lastRead && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Terakhir Dibaca</h2>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookmarkIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Surah {lastRead.surah_id}{lastRead.ayah_number ? `, Ayat ${lastRead.ayah_number}` : ''}</span>
                </CardTitle>
                <CardDescription>Terakhir dibaca</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="gap-1">
                  <Link to={`/surah/${lastRead.surah_id}${lastRead.ayah_number ? `#ayat-${lastRead.ayah_number}` : ''}`}>
                    <span>Lanjutkan</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Daftar Bookmark</h2>
        {bookmarks.length === 0 ? (
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertTitle>Tidak ada bookmark</AlertTitle>
            <AlertDescription>
              Anda belum memiliki bookmark. Tambahkan bookmark di halaman surat.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookmarkIcon className="h-5 w-5 mr-2 text-primary" />
                    <span>{bookmark.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Surah {bookmark.surah_id}{bookmark.ayah_number ? `, Ayat ${bookmark.ayah_number}` : ''}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline" className="gap-1">
                    <Link to={`/surah/${bookmark.surah_id}${bookmark.ayah_number ? `#ayat-${bookmark.ayah_number}` : ''}`}>
                      <span>Buka</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => bookmark.id && handleDeleteBookmark(bookmark.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default BookmarkPage; 