'use client';

import Link from 'next/link';
import { Play, Calendar, Dumbbell, Trophy, Shield, ArrowUpRight, ArrowRight, Clock, Award, CheckCircle2, Zap } from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { number: '6+', label: 'LEVEL GYM RANKS', sub: 'Iron Novice → Gym God' },
    { number: '40+', label: 'EXERCISE LIBRARY', sub: 'Chest, Back, Arms, Legs, Core' },
    { number: '100%', label: 'PWA MULTIPLATORM', sub: 'iOS & Android Ready' },
    { number: '500T+', label: 'MAX VOLUME LEVEL', sub: 'Progressive Overload Tracker' },
  ];

  const features = [
    {
      code: '01',
      title: 'MANAJEMEN SPLIT LATIHAN',
      subtitle: 'WEEKLY SCHEDULE MATRIX',
      desc: 'Pengelompokan latihan berdasarkan Hari dan Sesi Waktu (Senin Pagi Arm Day, Rabu Pagi Back Day, Jumat Sore Chest Routine). Terintegrasi dengan Google Calendar.',
      link: '/routines',
      tag: 'CALENDAR SYNC',
    },
    {
      code: '02',
      title: 'LIVE WORKOUT TRACKER',
      subtitle: 'PER-SET WEIGHT & REST TIMER',
      desc: 'Catat beban (kg/lbs), repetisi, tombol centang completed per set, dan catatan khusus. Rest Timer otomatis dengan suara alarm chime dan Notifikasi Push HP.',
      link: '/logger',
      tag: 'PUSH NOTIFICATION',
    },
    {
      code: '03',
      title: 'ANALYTICS & PR TRACKER',
      subtitle: 'AUTOMATED PERSONAL RECORD',
      desc: 'Otomatis mendeteksi rekor angkatan terberat (Max Weight) dan repetisi terbanyak per gerakan. Dilengkapi Trophy Room dan grafik tren volume angkatan.',
      link: '/history',
      tag: 'PR DETECTOR',
    },
    {
      code: '04',
      title: 'GYM RANK TIER SYSTEM',
      subtitle: 'GAMIFIKASI LEVEL GYM',
      desc: 'Tingkatkan peringkat level gym kamu berdasarkan akumulasi total volume angkatan (kg). Dimulai dari Tier 1 Iron Novice hingga Tier 6 Gym God / Naoo Legend.',
      link: '/history',
      tag: 'GAMIFICATION',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* HERO SECTION - Inspired by GAZU & DIGITAL DESIGNER Reference */}
      <section className="solid-card p-8 sm:p-14 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Huge Editorial Typography & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest border-b border-[#6C6D74] pb-2 inline-block">
              NAOOLIFT / HIGH-PERFORMANCE WORKOUT SCHEDULER
            </div>

            {/* MASSIVE GIANT HEADLINE */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black text-[#D3D1CE] leading-none tracking-tight">
              NAOO<br />LIFT
            </h1>

            <p className="text-sm sm:text-base text-[#B3B7BA] max-w-xl leading-relaxed">
              Sistem pencatatan gym presisi tinggi untuk mengelola jadwal latihan split, memantau progressive overload per set, dan menghitung jeda istirahat otomatis.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/logger"
                className="solid-btn-primary px-8 py-4 text-xs uppercase tracking-wider flex items-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" />
                Mulai Sesi Latihan
              </Link>

              <Link
                href="/routines"
                className="solid-btn-secondary px-8 py-4 text-xs uppercase tracking-wider flex items-center gap-3"
              >
                <Calendar className="w-4 h-4" />
                Kelola Split Latihan
              </Link>
            </div>
          </div>

          {/* Right Column: Hero High-Contrast Gym Asset Image */}
          <div className="lg:col-span-5">
            <div className="solid-card p-2 bg-[#090F15] border border-[#6C6D74] relative overflow-hidden group">
              <img
                src="/hero-gym.jpg"
                alt="NaooLift Dark Gym Photography"
                className="w-full h-[380px] sm:h-[450px] object-cover rounded-sm grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#090F15]/90 border border-[#6C6D74] p-3 text-xs font-mono flex items-center justify-between">
                <span className="text-[#D3D1CE] font-bold">EST. 2026 / NAOOLIFT</span>
                <span className="text-[#B3B7BA] uppercase text-[10px]">SOLID EDITORIAL</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HORIZONTAL STATS BAR - Inspired by WEB DESIGNER & DIGITAL DESIGNER Reference */}
      <section className="solid-card p-0 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#6C6D74]">
          {stats.map((st, idx) => (
            <div key={idx} className="p-6 sm:p-8 space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#D3D1CE]">
                {st.number}
              </div>
              <div className="text-xs font-heading font-bold text-[#D3D1CE] tracking-wider">
                {st.label}
              </div>
              <div className="text-[11px] font-mono text-[#B3B7BA]">
                {st.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK / CORE MODULES BENTO GRID - Inspired by GAZU & NORD Reference */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#6C6D74] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">SYSTEM CAPABILITIES</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#D3D1CE]">
              MODUL & FITUR UTAMA
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B3B7BA] uppercase">04 CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item) => (
            <div key={item.code} className="solid-card p-8 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-black text-[#6C6D74] group-hover:text-[#D3D1CE] transition-colors">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-mono text-[#B3B7BA] uppercase border border-[#6C6D74] px-2 py-0.5 rounded-sm bg-[#090F15]">
                    {item.tag}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block tracking-wider">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#D3D1CE] mt-0.5">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#B3B7BA] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6C6D74] flex items-center justify-between">
                <span className="text-xs font-mono text-[#B3B7BA]">
                  NAOOLIFT FEATURE
                </span>
                <Link
                  href={item.link}
                  className="solid-btn-secondary px-4 py-2 text-xs flex items-center gap-1 group-hover:bg-[#D3D1CE] group-hover:text-[#090F15] transition-colors"
                >
                  Buka Fitur <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG BOTTOM FOOTER BANNER CTA - Inspired by WEB DESIGNER & DIGITAL DESIGNER Reference */}
      <section className="solid-card p-8 sm:p-14 bg-[#262E36] border border-[#6C6D74] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest">READY TO LIFT?</span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-[#D3D1CE] leading-tight">
              MULAI CATAT ANGKATAN GYM KAMU HARI INI.
            </h2>
            <p className="text-xs sm:text-sm text-[#B3B7BA]">
              Lacak setiap set, beban, repetisi, dan jeda istirahat dengan sistem presisi NaooLift.
            </p>
          </div>

          <Link
            href="/logger"
            className="solid-btn-primary px-10 py-5 text-sm uppercase tracking-wider flex items-center justify-center gap-3 whitespace-nowrap"
          >
            Mulai Latihan Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
