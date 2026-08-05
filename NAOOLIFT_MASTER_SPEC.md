# 🏋️⚡ NAOOLIFT - MASTER SPECIFICATION BLUEPRINT

Dokumen ini adalah **Master Reference Blueprint** untuk seluruh modul, fitur, arsitektur teknis, integrasi notifikasi, Google Calendar, serta **Anti-Slop Design System (taste-skill)** sub-aplikasi **NaooLift** (Next.js + Golang API Stack).

---

## 📐 1. Stack & Arsitektur Teknis

- **Frontend Project**: `z:\Portofolio\NaooLift\frontend`
  - Framework: **Next.js 14+ (App Router)** + TypeScript + Tailwind CSS.
  - UI Design System: **Anti-Slop Design Framework (`z:\Portofolio\NaooLift\taste-skill`)**.
  - Style: **Minimalist, Clean, High-Contrast Dark Mode** (Inspirasi: Hevy App, Strong, & Linear.app).
  - Responsif: Layout desktop & Mobile Bottom Navigation Bar.
- **Backend API Project**: `z:\Portofolio\NaooLift\backend`
  - Language: **Go (Golang)** REST API Server (`main.go`, `go.mod`).
  - ORM / DB: GORM + SQLite / PostgreSQL.
- **Design Skill Reference**: `z:\Portofolio\NaooLift\taste-skill`
- **GitHub Repository**:
  - URL: **`https://github.com/zysrnh/NaooLift_Project.git`**

---

## 📋 2. Modul Fitur Utama

### 📅 Modul A: Manajemen Jadwal & Rutinitas Latihan
1. **Jadwal Mingguan (Weekly Schedule Matrix)**:
   - Pengelompokan latihan berdasarkan **Hari** & **Waktu/Sesi**:
     - *Arm Day (Senin Pagi)*
     - *Back Day (Rabu Pagi)*
     - *Chest Routine (Jumat Sore)*
   - Kustomisasi urutan gerakan, target set, target repetisi, dan target beban.
2. **Katalog Gerakan (Exercise Library)**:
   - **Target Otot**: *Chest*, *Back*, *Arms*, *Legs*, *Core*, *Shoulder*.
   - **Tipe Latihan**: *Beban/Strength*, *Bodyweight*, *Cardio*.
   - **Peralatan**: *Barbell*, *Dumbbell*, *Machine*, *Cable*, *Bodyweight*.
3. **Integrasi Google Calendar (Sync Schedule)** 📅:
   - Tombol **"Sync to Google Calendar"** / Expor event `.ics`.
   - Otomatis memasukkan jadwal workout split ke Google Calendar pengguna lengkap dengan pengingat notifikasi bawaan HP.

---

### 📝 Modul B: Catatan Latihan Harian (Workout Tracker / Log)
1. **Input Sesi Latihan Live**:
   - Tanggal & waktu latihan (otomatis/manual).
   - Pemilihan gerakan latihan yang dilakukan.
   - Per-Set Logger:
     - Beban (`kg` / `lbs` switcher)
     - Repetisi (`Reps`)
     - Tombol Centang Completed (`[✓]`)
2. **Fitur Rest Timer & Sistem Notifikasi Push (iOS & Android)** 🔔:
   - Timer hitung mundur otomatis (30s, 60s, 90s, 120s, custom).
   - **Push Notification Native iOS & Android**: Banner notifikasi + getar HP + suara chime saat jeda istirahat selesai (bahkan saat HP dikunci/di kantong celana).
3. **Catatan Tambahan (Session & Set Notes)**:
   - Kolom catatan fleksibel per sesi & per set (misal: *"Beban ditambah minggu depan"*, *"Form terasa kurang oke pada set ke-3"*).

---

### 📊 Modul C: Pemantauan Progres & Analytics
1. **Personal Record (PR) Tracker**:
   - Deteksi otomatis rekor angkatan terberat (*Max Weight*) & repetisi terbanyak (*Max Reps*) per gerakan.
   - Badge selebrasi PR & notifikasi rekor baru.
2. **Grafik Beban / Volume**:
   - Grafik tren peningkatan total volume angkatan (`Volume = Beban × Reps × Set`) dari waktu ke waktu.
3. **Catatan Fisik (Body Metrics)**:
   - Log berat badan harian/mingguan (`kg`).
   - Galeri / Upload **Foto Progres Fisik** (opsional) untuk pemantauan bentuk tubuh.

---

### 🏆 Modul D: Fitur Rank & Gamifikasi Gym (Tier System)

Sistem Peringkat Level Gym berdasarkan akumulasi total volume angkatan (`kg`):

| Level Rank | Nama Rank | Syarat Accumulative Volume (kg) | Warna Badge |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Iron Novice** | 0 - 5.000 kg | Slate Metal (`#64748B`) |
| **Tier 2** | **Bronze Lifter** | 5.001 - 25.000 kg | Bronze (`#D97706`) |
| **Tier 3** | **Silver Beast** | 25.001 - 75.000 kg | Silver (`#94A3B8`) |
| **Tier 4** | **Gold Athlete** | 75.001 - 200.000 kg | Gold (`#F59E0B`) |
| **Tier 5** | **Platinum Titan** | 200.001 - 500.000 kg | Platinum Cyan (`#06B6D4`) |
| **Tier 6** | **Gym God / Naoo Legend** | 500.000+ kg | Emerald Violet Glow (`#8B5CF6`) |

*Fitur Rank mencakup Progress Bar EXP Volume menuju rank berikutnya & Multiplier Bonus Streak Latihan.*

---

### 📱 Modul E: PWA & Mobile App Wrapper (Tampilan Web -> APK HP)
1. **Progressive Web App (PWA)**:
   - Menambahkan `manifest.json` & Service Worker PWA di Next.js.
   - Support PWA iOS (Safari "Add to Home Screen") & Android (Chrome "Install App").
   - Muncul sebagai ikon aplikasi di Home Screen HP, terbuka **Fullscreen tanpa URL bar**, dan berkinerja 100% seperti Aplikasi Native.
2. **WebView APK Wrapper**:
   - Mempersiapkan konfigurasi WebView ringan (Capacitor/TWA) untuk menghasilkan file `.apk` asli jika ingin langsung di-install di Android.

---

### 🚀 Modul F: Prosedur Git Push Otomatis
Setelah seluruh fitur selesai dibuat & teruji:
```bash
git init
git add .
git commit -m "feat: complete NaooLift core features, clean UI, rank system, Google Calendar, PWA & analytics"
git branch -M main
git remote add origin https://github.com/zysrnh/NaooLift_Project.git
git push -u origin main
```

---

*Dokumen Master Blueprint ini dikunci dan menjadi acuan utama sebelum eksekusi pengerjaan.*
