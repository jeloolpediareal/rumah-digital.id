# Rumah Digital — Futuristic Mining UI

Versi ini menambahkan:
- `admin.html` dengan login admin, statistik pengguna, kontrol Close/Online Server, tambah/edit/hapus server, tarif USD per tick dan interval.
- Saat daftar, pengguna wajib memilih server mining yang sedang tersedia.
- Dashboard menampilkan server yang dipilih dan otomatis mengikuti status server.
- Tampilan dipoles dengan emoji, glass/neon cards, dan nuansa aplikasi futuristik.

## Demo admin
- URL: `/admin.html`
- Username: `admin`
- Password: `Admin@2026`

## Penting untuk deployment Vercel
Versi ini masih **frontend/localStorage demo**. Artinya data pengguna dan konfigurasi server hanya tersimpan di browser tempat data dibuat. `Close Server` di satu perangkat tidak otomatis mematikan mining pada perangkat pengguna lain.

Untuk website produksi multi-pengguna, login admin, saldo, status online, server mining, dan pembayaran harus dipindahkan ke backend/database (mis. Vercel Functions + database) dan password/token rahasia tidak boleh ditaruh di HTML/JavaScript frontend.

Jangan menaruh secret API QRIS di frontend. Gunakan endpoint backend untuk membuat dan memverifikasi transaksi.
