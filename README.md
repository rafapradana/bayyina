# Bayyina - Al-Quran Digital

<div align="center">
  <img src="public/logo.png" alt="Bayyina Logo" width="150" />
  <p><em>Aplikasi Al-Quran digital dengan fitur modern dan interface yang ramah pengguna</em></p>
</div>

## 🌟 Tentang Aplikasi

Bayyina adalah aplikasi web Al-Quran digital yang memungkinkan pengguna untuk membaca Al-Quran lengkap dengan terjemahan bahasa Indonesia dan mendengarkan murottal (bacaan) dari setiap surah dan ayat dari berbagai qori (pembaca) pilihan. Aplikasi ini dirancang dengan antarmuka yang modern, bersih, dan mudah digunakan.

## ✨ Fitur Utama

- **Bacaan Al-Quran Lengkap** - Semua 114 surah Al-Quran lengkap dengan teks Arab, latin, dan terjemahan bahasa Indonesia.
- **Murottal Audio** - Dengarkan bacaan Al-Quran untuk setiap surah dengan pilihan berbagai qori terkenal.
- **Pilihan Qori** - Pilih qori favorit dari beberapa pilihan seperti Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman as-Sudais, Ibrahim Al-Dossari, dan Misyari Rasyid Al-Afasi.
- **Toggle Terjemahan** - Tampilkan atau sembunyikan terjemahan sesuai kebutuhan dengan satu klik.
- **Navigasi Antar Surah** - Berpindah ke surah sebelumnya atau selanjutnya dengan mudah.
- **Pencarian Surah** - Temukan surah dengan cepat menggunakan fitur pencarian berdasarkan nama atau nomor surah.
- **Mode Gelap & Terang** - Sesuaikan tampilan dengan preferensi Anda, pilih antara mode gelap atau terang.
- **Bookmark** - Simpan ayat favorit untuk akses cepat di kemudian hari.
- **Terakhir Dibaca** - Tandai dan langsung kembali ke ayat terakhir yang Anda baca untuk melanjutkan bacaan.
- **Lazy Loading Audio** - Audio hanya dimuat saat tombol play ditekan, menghemat bandwidth dan mempercepat performa.

## 🛠️ Teknologi

Bayyina dibangun dengan teknologi modern:

- [React](https://reactjs.org/) - Library JavaScript untuk membangun antarmuka pengguna
- [React Router](https://reactrouter.com/) - Navigasi antar halaman
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript dengan pengetikan yang kuat
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS untuk desain yang cepat dan responsif
- [Shadcn UI](https://ui.shadcn.com/) - Komponen UI yang dapat digunakan kembali
- [Lucide Icons](https://lucide.dev/) - Set ikon yang indah dan konsisten
- [Vite](https://vitejs.dev/) - Build tool yang cepat untuk pengembangan modern

## 🚀 Instalasi dan Penggunaan

### Prasyarat

- Node.js versi 16 atau lebih tinggi
- NPM atau Yarn

### Langkah Instalasi

1. Clone repositori
   ```bash
   git clone https://github.com/username/bayyina.git
   cd bayyina
   ```

2. Install dependensi
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Jalankan aplikasi dalam mode pengembangan
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. Buka [http://localhost:5173](http://localhost:5173) untuk melihat aplikasi di browser

### Build untuk Produksi

```bash
npm run build
# atau
yarn build
```

## 📊 API dan Sumber Data

Data Al-Quran yang ditampilkan dalam aplikasi ini diambil dari API yang disediakan oleh equran.id melalui:

```
https://equran.id/apidev/v2
```

Data ini mencakup teks Arab, teks latin, terjemahan bahasa Indonesia, dan file audio murottal untuk setiap surah dan ayat dari berbagai qori.

## 👨‍💻 Developer

Aplikasi ini dikembangkan oleh Muhammad Rafa Shaquille Pradana.

### Media Sosial
- Instagram: [@rafashaqq](https://www.instagram.com/rafashaqq/)
- Twitter/X: [@rafapradanaa](https://x.com/rafapradanaa)
- GitHub: [@rafapradana](https://github.com/rafapradana)

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Penghargaan

- Terima kasih kepada [equran.id](https://equran.id) untuk menyediakan API Al-Quran yang komprehensif.
- Semua qori yang membacakan ayat-ayat suci Al-Quran.
- Semua kontributor yang telah membantu dalam pengembangan aplikasi ini.
