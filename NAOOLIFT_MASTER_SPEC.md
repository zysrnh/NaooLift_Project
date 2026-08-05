# 🏋️⚡ NAOOLIFT - MASTER SPECIFICATION BLUEPRINT

Dokumen ini adalah **Master Reference Blueprint** untuk seluruh modul, fitur, arsitektur teknis, integrasi notifikasi, Google Calendar, **Sistem Autentikasi (Login & Register)**, serta **MySQL Database & Solid Anti-Slop Design System** sub-aplikasi **NaooLift** (Next.js + Golang API Stack).

---

## 📐 1. Stack & Arsitektur Teknis

- **Frontend Project**: `z:\Portofolio\NaooLift\frontend`
  - Framework: **Next.js 14+ (App Router)** + TypeScript + Tailwind CSS.
  - UI Design System: **Solid Borderless Anti-Slop Design System**.
  - Color Palette:
    - **Midnight** (`#090F15`): Solid Canvas Background
    - **Mountainside** (`#262E36`): Solid Card Surfaces
    - **Apres Ski** (`#6C6D74`): Muted Text & Accents
    - **Slopes** (`#B3B7BA`): Secondary Subtext
    - **Artic** (`#D3D1CE` / `#FFFFFF`): Primary Typography & CTA Buttons
  - Fonts: **`Space Grotesk`** (Headings, Stats, Buttons) & **`Manrope`** (Body Text).
- **Backend API Project**: `z:\Portofolio\NaooLift\backend`
  - Language: **Go (Golang)** REST API Server (`main.go`, `go.mod`).
  - Database: **MySQL** (`127.0.0.1:3306`, Database: `naoolift_db`, ORM: GORM).
- **GitHub Repository**:
  - URL: **`https://github.com/zysrnh/NaooLift_Project.git`**

---

## 📋 2. Modul Fitur Utama

### 🔑 Modul 0 (NEW): Autentikasi User (Login & Register System)
1. **Fitur Registrasi (`/register`)**:
   - Form input Nama Lengkap, Email, Password, dan Konfirmasi Password.
   - Enkripsi password menggunakan `bcrypt` di Go API backend.
2. **Fitur Login (`/login`)**:
   - Form input Email & Password.
   - Verifikasi credential user & penerbitan Token Autentikasi (JWT / Session).
   - Penyimpanan session di Frontend (LocalStorage / Cookie) & User Profile state.
3. **Menu Profil & Navbar State**:
   - Navbar secara otomatis menyesuaikan tampilan:
     - Jika belum login: Menampilkan tombol **`MASUK / DAFTAR`**.
     - Jika sudah login: Menampilkan **Nama User**, badge rank gym, dan tombol **`LOGOUT`**.

---

### 📅 Modul A: Manajemen Jadwal & Rutinitas Latihan
1. **Jadwal Mingguan (Weekly Schedule Matrix)**:
   - Pengelompokan latihan berdasarkan **Hari** & **Waktu/Sesi**:
     - *Arm Day (Senin Pagi)*
     - *Back Day (Rabu Pagi)*
     - *Chest Routine (Jumat Sore)*
2. **Integrasi Google Calendar (Sync Schedule)** 📅:
   - Tombol **"Sync to Google Calendar"** / Expor event `.ics`.

---

### 📝 Modul B: Catatan Latihan Harian (Workout Tracker / Log)
1. **Input Sesi Latihan Live**:
   - Tanggal & waktu latihan, per-set logger (beban `kg`/`lbs`, repetisi `Reps`, checkbox completed `[✓]`, notes).
2. **Fitur Rest Timer & Notifikasi Push** 🔔:
   - Timer hitung mundur otomatis dengan suara alarm chime & Push Notification HP.

---

### 📊 Modul C: Pemantauan Progres & Analytics
1. **Personal Record (PR) Tracker**:
   - Deteksi otomatis rekor angkatan terberat (*Max Weight*) & repetisi terbanyak (*Max Reps*).
2. **Catatan Fisik (Body Metrics)**:
   - Log berat badan & upload **Foto Progres Fisik**.

---

### 🏆 Modul D: Fitur Rank & Gamifikasi Gym (Tier System)

| Level Rank | Nama Rank | Syarat Accumulative Volume (kg) |
| :--- | :--- | :--- |
| **Tier 1** | **Iron Novice** | 0 - 5.000 kg |
| **Tier 2** | **Bronze Lifter** | 5.001 - 25.000 kg |
| **Tier 3** | **Silver Beast** | 25.001 - 75.000 kg |
| **Tier 4** | **Gold Athlete** | 75.001 - 200.000 kg |
| **Tier 5** | **Platinum Titan** | 200.001 - 500.000 kg |
| **Tier 6** | **Gym God / Naoo Legend** | 500.000+ kg |

---

### 🗄️ Modul E: Database Schema MySQL (`naoolift_db`)

```sql
CREATE DATABASE IF NOT EXISTS naoolift_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tabel GORM:
1. `users` (`id`, `name`, `email`, `password_hash`, `created_at`)
2. `exercises` (`id`, `name`, `muscle_group`, `category_type`, `equipment`)
3. `routines` (`id`, `user_id`, `title`, `day_of_week`, `time_of_day`, `description`)
4. `routine_exercises` (`id`, `routine_id`, `exercise_id`, `target_sets`, `target_reps`, `target_weight_kg`, `rest_seconds`)
5. `workout_logs` (`id`, `user_id`, `routine_id`, `title`, `date`, `time_logged`, `duration_minutes`, `total_volume_kg`, `notes`, `feeling_rating`)
6. `workout_sets` (`id`, `workout_log_id`, `exercise_id`, `set_number`, `weight_kg`, `reps`, `is_completed`, `is_pr`, `notes`)
7. `body_logs` (`id`, `user_id`, `date`, `weight_kg`, `photo_url`, `notes`)
