# RESTful API Pengaduan Mahasiswa (Node.js + MySQL)

Proyek sederhana untuk praktikum Pemrograman Mobile. **Tidak ada antarmuka web**. Input dilakukan lewat **Postman**, data disimpan di **MySQL**, dan aplikasi mobile nantinya mengakses **JSON** dari API.

## Persyaratan
- Node.js 20 atau lebih baru
- MySQL / MariaDB (boleh memakai MySQL dari XAMPP; Apache tidak perlu dijalankan)
- Postman

## 1. Instalasi

1. Jalankan **MySQL**.
2. Impor `database.sql` melalui phpMyAdmin atau MySQL CLI. Contoh CLI: `mysql -u root -p < database.sql`.
3. Buka Terminal di folder proyek.
4. Instal dependency:

   ```bash
   npm install
   ```

5. Duplikasi konfigurasi lalu sesuaikan DB_USER / DB_PASSWORD:
   - macOS / Linux: `cp .env.example .env`
   - Windows Command Prompt: `copy .env.example .env`
6. Jalankan API:

   ```bash
   npm start
   ```

   Untuk mode pengembangan: `npm run dev` (Node.js 20+).

7. Buka di browser atau Postman (metode GET):

   **http://localhost:3000/api/pengaduan**

   Bila database masih kosong, hasilnya: `{"success":true,"total":0,"data":[]}`.

> Jalankan **Node.js dan MySQL saja**. Tidak perlu Apache, PHP, Vue.js, atau halaman web. Jika pesan gagal koneksi MySQL muncul, periksa layanan DB, database SQL, dan file `.env`.

## 2. Endpoint API

| Metode | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/pengaduan` | Semua pengaduan |
| GET | `/api/pengaduan?nim=20260001` | Filter NIM |
| GET | `/api/pengaduan/1` | Detail pengaduan ID 1 |
| POST | `/api/pengaduan` | Tambah pengaduan |
| PATCH | `/api/pengaduan/1` | Ubah status dan/atau tanggapan |
| DELETE | `/api/pengaduan/1` | Hapus pengaduan |

### POST dari Postman
Metode **POST**, URL `http://localhost:3000/api/pengaduan`, pilih **Body → raw → JSON**:

```json
{
  "nama": "Andi Saputra",
  "nim": "20260001",
  "kategori": "Fasilitas",
  "judul": "AC ruang kelas rusak",
  "isi": "AC tidak dingin saat perkuliahan."
}
```

Respons sukses `201 Created`:

```json
{
  "success": true,
  "message": "Pengaduan berhasil ditambahkan.",
  "data": {
    "id": 1,
    "nama": "Andi Saputra",
    "nim": "20260001",
    "kategori": "Fasilitas",
    "judul": "AC ruang kelas rusak",
    "isi": "AC tidak dingin saat perkuliahan.",
    "status": "Menunggu",
    "tanggapan": null,
    "dibuat_pada": "2026-11-16 10:00:00",
    "diperbarui_pada": "2026-11-16 10:00:00"
  }
}
```

*Waktu di atas contoh; server mengisi waktu otomatis dari MySQL.*

### GET data
GET `http://localhost:3000/api/pengaduan`:

```json
{
  "success": true,
  "total": 1,
  "data": [
    { "id": 1, "nama": "Andi Saputra", "nim": "20260001", "kategori": "Fasilitas", "judul": "AC ruang kelas rusak", "isi": "AC tidak dingin saat perkuliahan.", "status": "Menunggu", "tanggapan": null, "dibuat_pada": "2026-11-16 10:00:00", "diperbarui_pada": "2026-11-16 10:00:00" }
  ]
}
```

### PATCH status
Metode **PATCH** `http://localhost:3000/api/pengaduan/1` dengan Body JSON:

```json
{ "status": "Diproses", "tanggapan": "Laporan diteruskan ke bagian sarana." }
```

Nilai status yang diizinkan: `Menunggu`, `Diproses`, `Selesai`.

### DELETE
Gunakan **DELETE** `http://localhost:3000/api/pengaduan/1` untuk menghapus data ber-ID 1.

## 3. Import Postman
Buka Postman → Import → pilih `Pengaduan_Mahasiswa_NodeJS.postman_collection.json`.
Jalankan permintaan **POST Tambah**, lalu **GET Semua**, **PATCH Status**, **GET Detail**. Gunakan **DELETE** bila ingin membersihkan data.

## 4. Mengakses dari aplikasi mobile
- Di komputer tempat Node.js berjalan: `http://localhost:3000/api/pengaduan`
- Android Emulator: `http://10.0.2.2:3000/api/pengaduan`
- HP fisik pada Wi-Fi yang sama: ubah `HOST=0.0.0.0` dalam `.env`, restart `npm start`, dan gunakan `http://IP_KOMPUTER:3000/api/pengaduan`. Pastikan firewall mengizinkan akses lokal.

`localhost` di HP berarti HP itu sendiri, bukan komputer pengembang.

## 5. Pengujian
- Validasi input tanpa MySQL: `npm test`
- Pengujian API: impor Postman dan uji GET/POST/PATCH/DELETE setelah MySQL aktif.

## 6. Catatan keamanan
Proyek ini **hanya untuk praktikum lokal**. Belum ada autentikasi, izin pengguna, HTTPS, atau pembatasan akses. Jangan dibuka ke internet publik atau diisi identitas/pengaduan asli. Untuk penggunaan produksi, tambahkan kontrol keamanan sebelum dipakai.
# -BE-WhistleBlowing
