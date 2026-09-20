# Rumah Digital - Crypto Mining Platform

Website mining crypto dengan UI futuristik, sistem login/registrasi, dashboard realtime, withdraw, dan panel admin.

## Fitur

- **Login & Registrasi** — Data tersimpan di localStorage (persisten di browser)
- **Dashboard** — Saldo USD + IDR, terminal mining realtime setiap 5 detik, progress unlock
- **Server Mining** — User memilih server saat daftar, rate diatur dari admin
- **Unlock Withdraw** — Capai $10 lalu bayar $5 via QRIS (BuatQris API) untuk aktifkan fitur
- **Withdraw & Riwayat** — Form penarikan + riwayat transaksi
- **Admin Panel** (`/admin.html`)
  - Username: `Jelool`
  - Password: `Jelool`
  - Close / Online Server global
  - Tambah / nonaktifkan server mining + atur rate
  - Status seluruh pengguna & total pengguna

## Struktur File

```
rumah-digital/
├── index.html          # Login & Register
├── home.html           # Halaman utama
├── dashboard.html      # Dashboard mining
├── withdraw.html       # Form penarikan
├── riwayat.html        # Riwayat withdraw
├── admin.html          # Panel admin
├── logo.png
├── style.css
└── data.js
```

## Deploy ke Vercel

1. Upload folder `rumah-digital` ke GitHub atau langsung drag ke Vercel
2. Framework Preset: **Other** / Static
3. Root Directory: folder project
4. Deploy

URL contoh: `https://rumah-digital-id.vercel.app`

Akses admin: `https://rumah-digital-id.vercel.app/admin.html`

## Catatan Penting

- Data disimpan di **localStorage** browser (bukan server). Setiap perangkat/browser memiliki data sendiri.
- Secret Token QRIS terekspos di frontend karena static site. Untuk production sebaiknya pakai backend proxy.
- Rate default: ~$0.03 / 5 detik (bisa diubah di admin).
- Kurs default: 1 USD = Rp 17.800 (dapat diubah di `data.js` → `DEFAULT_SETTINGS`).

## Payment QRIS

Menggunakan BuatQris API (live, tanpa mode demo):

- Account ID & Secret Token sudah di-hardcode sesuai request
- Amount: $5 dikonversi ke IDR
- User dapat cek status pembayaran manual setelah scan QR
