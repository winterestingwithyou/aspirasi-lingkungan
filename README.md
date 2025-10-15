# ECO-RAPID 🌱

> Menjembatani suara warga dengan pemerintah untuk aksi cepat tanggap lingkungan.

ECO-RAPID adalah platform pelaporan lingkungan yang memastikan aspirasi masyarakat tiba ke instansi terkait secara terstruktur. Warga dapat mengirim aduan, melampirkan bukti foto, menentukan titik masalah lewat peta interaktif, dan memantau progres penyelesaian langsung dari dashboard.

## 🚀 Demo Online
- https://eco-rapid.my.id

## ✨ Fitur Utama
- 🗂️ Pengelolaan laporan end-to-end dari pengajuan, verifikasi, hingga tindak lanjut.
- 📍 Penandaan lokasi aduan dengan peta interaktif berbasis Leaflet + Nominatim.
- 📸 Unggah bukti foto ke Cloudinary agar dokumentasi aman dan mudah diakses.
- 🔐 Perlindungan anti-bot lewat Cloudflare Turnstile demi menjaga kualitas data.
- 📬 Notifikasi email otomatis melalui Gmail API untuk pelapor dan petugas.

## 🛠️ Teknologi Inti

<p align="center">
  <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/reactrouter/CA4245" alt="React Router" height="48" />
  &nbsp;
  <img src="https://raw.githubusercontent.com/honojs/hono/main/docs/public/logo-icon.svg" alt="Hono" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/cloudflare/FF7300" alt="Cloudflare" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/bootstrap/7952B3" alt="Bootstrap" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/prisma/2D3748" alt="Prisma" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/neondb/4488FF" alt="Neon" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/cloudinary/4285F4" alt="Cloudinary" height="48" />
  &nbsp;
  <img src="https://cdn.simpleicons.org/openstreetmap/7EBC6F" alt="OpenStreetMap" height="48" />
</p>

- **Frontend**: React 19, React Router v7, Bootstrap 5, React Bootstrap, dan Leaflet untuk antarmuka SPA yang responsif.
- **Backend & Edge Runtime**: Hono JS berjalan di Cloudflare Workers, mengelola routing API dan middleware ringan.
- **Database & ORM**: PostgreSQL di Neon (NeonDB) dengan Prisma ORM serta adapter Prisma Accelerate untuk koneksi Workers.
- **Layanan Pendukung**: Cloudflare Turnstile (anti-bot), Cloudinary (media asset), Nominatim/OpenStreetMap (geocoding), Gmail API (pengiriman email).

## ⚙️ Instalasi & Pemakaian

1. Pastikan Node.js terbaru dan npm sudah terpasang.
2. Instal seluruh dependensi proyek.

   ```bash
   npm install
   ```

3. Duplikasi berkas konfigurasi contoh dan isi kredensial milik Anda.

   ```bash
   cp .env.example .env
   cp .dev.vars.example .dev.vars
   ```

4. (Opsional) Regenerasi Prisma Client bila perintah `postinstall` tidak berjalan otomatis.

   ```bash
   npx prisma generate --no-engine
   ```

5. Jalankan server pengembangan dan akses URL yang ditampilkan di terminal.

   ```bash
   npm run dev
   ```

## 🧰 Skrip Penting

```bash
npm run build       # Membundel aplikasi full-stack untuk Cloudflare Workers
npm run deploy      # Membangun dan langsung melakukan deploy via Wrangler
npm run preview     # Menjalankan build hasil bundel secara lokal sebelum deploy
npm run dev:css     # Mengompilasi stylesheet Bootstrap kustom saat pengembangan
```

## 📌 Hal yang Harus Dilakukan Selanjutnya

- Belum ada
