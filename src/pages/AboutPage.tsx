import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookOpen, Bookmark, Search, Volume, Languages, Moon, Sun, UserRound, BookmarkCheck, Github, Instagram, Twitter } from "lucide-react";

const AboutPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Tentang Aplikasi
            </h1>
            <p className="text-muted-foreground">
              Informasi tentang aplikasi Al-Quran Digital
            </p>
          </div>
          
          <div className="space-y-8">
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Apa itu Bayyina ?</h2>
              <p className="text-muted-foreground mb-4">Bayyina adalah aplikasi web yang memungkinkan pengguna untuk membaca Al-Quran lengkap dengan terjemahan bahasa Indonesia dan mendengarkan murottal (bacaan) dari setiap surah dan ayat dari berbagai qori (pembaca) pilihan.</p>
              <p className="text-muted-foreground">
                Aplikasi ini dirancang untuk memudahkan pengguna dalam mempelajari 
                dan memahami Al-Quran dengan tampilan yang bersih, modern, dan nyaman 
                dilihat.
              </p>
            </section>
            
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Developer</h2>
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-lg font-medium mb-2">Muhammad Rafa Shaquille Pradana</h3>
                <div className="flex space-x-4 mt-2">
                  <a 
                    href="https://www.instagram.com/rafashaqq/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                  </a>
                  <a 
                    href="https://x.com/rafapradanaa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-primary" />
                  </a>
                  <a 
                    href="https://github.com/rafapradana" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Github className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                Bayyina dikembangkan dengan semangat untuk mempermudah akses terhadap Al-Quran
                dan membantu umat Islam dalam mempelajari kitab suci.
              </p>
            </section>
            
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Fitur Utama</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <BookOpen className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Bacaan Al-Quran Lengkap</h3>
                    <p className="text-sm text-muted-foreground">
                      Semua 114 surah Al-Quran lengkap dengan teks Arab, latin, 
                      dan terjemahan bahasa Indonesia.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <Volume className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Murottal Audio</h3>
                    <p className="text-sm text-muted-foreground">
                      Dengarkan bacaan Al-Quran untuk setiap surah dengan pilihan
                      berbagai qori terkenal dan kualitas audio yang baik.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <UserRound className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Pilihan Qori</h3>
                    <p className="text-sm text-muted-foreground">
                      Pilih qori favorit dari beberapa pilihan seperti Abdullah Al-Juhany,
                      Misyari Rasyid Al-Afasi, dan lainnya.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <Languages className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Toggle Terjemahan</h3>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan atau sembunyikan terjemahan sesuai kebutuhan 
                      dengan satu klik.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <Search className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Pencarian Surah</h3>
                    <p className="text-sm text-muted-foreground">
                      Temukan surah dengan cepat menggunakan fitur pencarian 
                      berdasarkan nama atau nomor surah.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <div className="flex-shrink-0 mt-0.5">
                    <Moon className="h-5 w-5 text-primary dark:hidden" />
                    <Sun className="h-5 w-5 text-primary hidden dark:block" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Mode Gelap & Terang</h3>
                    <p className="text-sm text-muted-foreground">
                      Sesuaikan tampilan dengan preferensi Anda, pilih antara 
                      mode gelap atau terang.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <Bookmark className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Bookmark</h3>
                    <p className="text-sm text-muted-foreground">
                      Simpan ayat favorit untuk akses cepat 
                      di kemudian hari.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg border border-border/40">
                  <BookmarkCheck className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium">Terakhir Dibaca</h3>
                    <p className="text-sm text-muted-foreground">
                      Tandai dan langsung kembali ke ayat terakhir yang Anda baca
                      untuk melanjutkan bacaan.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Sumber Data</h2>
              <p className="text-muted-foreground mb-4">
                Data Al-Quran yang ditampilkan dalam aplikasi ini diambil dari API 
                yang disediakan oleh equran.id melalui:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">https://equran.id/apidev/v2</div>
              <p className="text-sm text-muted-foreground mt-4">
                Data ini mencakup teks Arab, teks latin, terjemahan bahasa Indonesia, 
                dan file audio murottal untuk setiap surah dan ayat dari berbagai qori.
              </p>
            </section>
            
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Pembaruan Terbaru</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border/40">
                  <h3 className="font-medium mb-1">Pilihan Qori</h3>
                  <p className="text-sm text-muted-foreground">
                    Sekarang Anda dapat memilih qori favorit dari beberapa pilihan seperti
                    Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman as-Sudais,
                    Ibrahim Al-Dossari, dan Misyari Rasyid Al-Afasi.
                  </p>
                </div>
                
                <div className="p-3 rounded-lg border border-border/40">
                  <h3 className="font-medium mb-1">Pengoptimalan Audio</h3>
                  <p className="text-sm text-muted-foreground">
                    Audio sekarang hanya dimuat saat tombol play ditekan, menghemat 
                    penggunaan data dan mempercepat waktu muat halaman.
                  </p>
                </div>
                
                <div className="p-3 rounded-lg border border-border/40">
                  <h3 className="font-medium mb-1">Fitur Terakhir Dibaca</h3>
                  <p className="text-sm text-muted-foreground">
                    Menambahkan fitur untuk menandai dan kembali ke ayat terakhir
                    yang Anda baca untuk kemudahan melanjutkan bacaan.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default AboutPage;