# Rumah Digital - Crypto Mining Web App

Website mining crypto modern dengan sistem login, dashboard real-time, dan unlock withdraw via QRIS.

## Struktur (Flat - tanpa folder)
```
rumah-digital/
├── index.html          # Login / Register
├── home.html
├── dashboard.html
├── withdraw.html
├── riwayat.html
├── logo.png
├── style.css
├── data.js
├── auth.js
├── app.js
└── README.md
```

## Fitur
- Login & Registrasi (data tersimpan di localStorage)
- Dashboard dengan saldo USD + IDR
- Mining otomatis setiap 5 detik
- Progress bar target $10
- Unlock fitur Withdraw dengan pembayaran QRIS $5 (real API BuatQris)
- Form penarikan + riwayat
- Bottom navigation ala aplikasi mobile
- UI dark neon modern

## Cara Deploy ke Vercel
1. Upload folder ini ke GitHub, atau
2. Drag & drop folder ke https://vercel.com/new
3. Deploy!

## Catatan
- Data user disimpan di localStorage browser.
- Secret token QRIS ada di dashboard.html (static site).
- Setelah bayar QRIS, klik "Saya Sudah Bayar" untuk unlock.
