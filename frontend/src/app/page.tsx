'use client';

import Link from 'next/link';
import { Play, Calendar, Dumbbell, Trophy, Shield, Clock, ArrowRight, CheckCircle2, Flame, Award, Bell } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Manajemen Split & Jadwal Mingguan',
      description: 'Pengelompokan rutinitas latihan berdasarkan Hari dan Sesi Waktu (Senin Pagi Arm Day, Rabu Pagi Back Day, Jumat Sore Chest Routine). Terintegrasi langsung dengan Google Calendar.',
      meta: 'Google Calendar Sync Supported',
    },
    {
      icon: Play,
      title: 'Live Workout Tracker & Rest Timer',
      description: 'Input sesi gym live per set: catat beban (kg/lbs), repetisi, tombol centang finished, dan catatan khusus set. Dilengkapi Rest Timer otomatis dengan suara alarm chime dan Notifikasi Push HP (iOS & Android).',
      meta: 'Audio Chime & Native Push Notification',
    },
    {
      icon: Trophy,
      title: 'Analytics & Rekor PR (Personal Record)',
      description: 'Sistem otomatis mendeteksi rekor angkatan terberat (Max Weight) dan repetisi terbanyak per gerakan. Dilengkapi Trophy Room dan grafik peningkatan volume angkatan dari waktu ke waktu.',
      meta: 'Automated PR Detector',
    },
    {
      icon: Shield,
      title: 'Gamifikasi Gym Rank System',
      description: 'Tingkatkan peringkat level gym kamu berdasarkan akumulasi total volume angkatan (kg). Dimulai dari Tier 1 Iron Novice (0-5 ton) hingga Tier 6 Gym God / Naoo Legend (500+ ton).',
      meta: '6 Tier Level Gamification',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* 1. Hero Section: Judul & Deskripsi */}
      <section className="solid-card p-8 sm:p-14 space-y-8">
        <div className="space-y-4 max-w-4xl">
          <div className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest border-b border-[#6C6D74] pb-2 inline-block">
            NAOOLIFT / WORKOUT SCHEDULER & GYM LOG SYSTEM
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-[#D3D1CE] leading-tight">
            Sistem Catatan Gym & Pemantauan Progressive Overload
          </h1>

          <p className="text-base sm:text-lg text-[#B3B7BA] leading-relaxed max-w-3xl">
            Aplikasi pengatur jadwal latihan harian, pencatatan beban dan repetisi per set, timer jeda istirahat otomatis, serta pemantau akumulasi volume angkatan gym secara terstruktur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/logger"
            className="solid-btn-primary px-8 py-4 text-xs uppercase tracking-wider flex items-center gap-3"
          >
            <Play className="w-4 h-4 fill-current" />
            Mulai Catat Sesi Gym
          </Link>

          <Link
            href="/routines"
            className="solid-btn-secondary px-8 py-4 text-xs uppercase tracking-wider flex items-center gap-3"
          >
            <Calendar className="w-4 h-4" />
            Kelola Split Latihan
          </Link>
        </div>
      </section>

      {/* 2. Fitur-Fitur Utama NaooLift */}
      <section className="space-y-6">
        <div className="border-b border-[#6C6D74] pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-[#D3D1CE]">
              FITUR UTAMA NAOOLIFT
            </h2>
            <p className="text-xs text-[#B3B7BA] mt-1 font-mono">
              Modul lengkap untuk kebutuhan latihan gym harian kamu.
            </p>
          </div>
          <span className="text-xs font-mono text-[#B3B7BA] uppercase hidden sm:block">
            4 Core Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="solid-card p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm bg-[#090F15] border border-[#6C6D74] flex items-center justify-center text-[#D3D1CE]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#B3B7BA] uppercase border border-[#6C6D74] px-2 py-0.5 rounded-sm bg-[#090F15]">
                      {feat.meta}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-[#D3D1CE]">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#B3B7BA] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#6C6D74] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#B3B7BA]">
                    Modul 0{idx + 1}
                  </span>
                  <Link
                    href={idx === 0 ? '/routines' : idx === 1 ? '/logger' : '/history'}
                    className="text-xs font-heading font-bold text-[#D3D1CE] hover:text-[#FFFFFF] flex items-center gap-1"
                  >
                    Buka Fitur <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
