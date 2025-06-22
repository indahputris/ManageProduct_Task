# 🛍️ ManageProduct_Task

Aplikasi manajemen produk sederhana berbasis **Fullstack JavaScript** yang dibangun dengan **React (Frontend)** dan **Express + MySQL (Backend)**. Aplikasi ini memungkinkan pengguna untuk:

- Menampilkan daftar produk
- Menambahkan produk baru
- Mengedit produk
- Menghapus produk
- Melihat detail produk
- Melakukan pencarian berdasarkan nama dan kategori

---

## 📁 Struktur Proyek
ManageProduct_Task/
│
├── backend/ # API dengan Express.js dan koneksi MySQL
│ ├── db.js # Konfigurasi database
│ ├── server.js # Server utama Express
│ └── package.json # Daftar dependensi backend
│
├── frontend/ # Aplikasi React
│ ├── src/ # Komponen dan file utama React
│ ├── public/ # File statis dan folder upload gambar
│ └── package.json # Daftar dependensi frontend
│
├── .gitignore # File dan folder yang tidak dimasukkan ke Git
└── README.md # Dokumentasi proyek


---

## 🚫 Kenapa `node_modules` diabaikan?

Folder `node_modules/` **tidak dimasukkan ke Git** karena:

- ❌ Ukurannya sangat besar (ratusan MB)
- 🔁 Bisa dibuat ulang dengan `npm install`
- 🧹 Agar repositori tetap ringan, rapi, dan cepat dikloning

Sebagai gantinya, semua dependensi disimpan dalam `package.json` dan `package-lock.json`.

---

## 📦 Cara Install Dependensi

Setelah kamu meng-kloning proyek ini:

### 🔧 Backend
```bash
cd backend
npm install

### 🔧 Frontend
cd frontend
npm install
