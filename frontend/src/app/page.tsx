'use client';

import Link from 'next/link';
import { Play, Calendar, Dumbbell, Trophy, Shield, ArrowUpRight, ArrowRight, Clock, Award, CheckCircle2, Zap, Sparkles, Layers, Cpu, Search, Database, Smartphone, Bell, Flame } from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { icon: Shield, number: '6+', label: 'TIER GYM RANKS', sub: 'Iron Novice → Gym God' },
    { icon: Dumbbell, number: '40+', label: 'EXERCISES LOGGED', sub: 'Chest, Back, Arms, Legs' },
    { icon: Trophy, number: '18+', label: 'PERSONAL RECORDS', sub: 'Max Weight & Reps' },
    { icon: Smartphone, number: '100%', label: 'PWA MULTIPLATFORM', sub: 'iOS & Android Ready' },
  ];

  const featuredModules = [
    {
      title: 'Jadwal Split Matrix',
      category: 'WEEKLY SCHEDULER',
      type: 'MODUL 01',
      desc: 'Pengelompokan rutinitas harian (Senin Pagi Arm Day, Rabu Pagi Back Day, Jumat Sore Chest Routine) dengan Google Calendar Sync.',
      link: '/routines',
      image: '/hero-gym.jpg',
    },
    {
      title: 'Live Set & Rest Timer',
      category: 'REALTIME TRACKER',
      type: 'MODUL 02',
      desc: 'Input beban (kg/lbs), repetisi, tombol completed per set, dan catatan khusus. Rest Timer otomatis dengan suara alarm chime.',
      link: '/logger',
      image: '/hero-gym.jpg',
    },
    {
      title: 'Analytics & Gym Rank',
      category: 'PROGRESSIVE OVERLOAD',
      type: 'MODUL 03',
      desc: 'Deteksi otomatis rekor angkatan terberat (PR) dan akumulasi volume (kg) untuk menaikkan peringkat level Gym Rank kamu.',
      link: '/history',
      image: '/hero-gym.jpg',
    },
  ];

  const coreCapabilities = [
    { title: 'MANAJEMEN SPLIT MINGGUAN', desc: 'Pengelompokan rutinitas latihan berdasarkan Hari dan Sesi Waktu (Pagi/Siang/Sore).' },
    { title: 'CATATAN SET & BEBAN (KG/LBS)', desc: 'Input per set lengkap dengan unit switcher kg/lbs, repetisi, dan tombol centang finished.' },
    { title: 'REST TIMER & PUSH NOTIFICATION', desc: 'Timer jeda istirahat otomatis dengan suara alarm chime & push notification HP.' },
    { title: 'AUTOMATED PR DETECTOR', desc: 'Mendeteksi otomatis rekor angkatan terberat (Max Weight) dan repetisi terbanyak.' },
    { title: 'GYM RANK TIER GAMIFICATION', desc: 'System level rank dari Tier 1 Iron Novice hingga Tier 6 Gym God / Naoo Legend.' },
    { title: 'GOOGLE CALENDAR & PWA SYNC', desc: 'Dapat di-install di Home Screen iOS/Android dan di-sync ke Google Calendar.' },
  ];

  const techStack = [
    { name: 'Next.js 14+', type: 'Frontend Framework' },
    { name: 'Go (Golang)', type: 'Backend REST API' },
    { name: 'MySQL 8.0', type: 'Database Server' },
    { name: 'TypeScript', type: 'Type Safety' },
    { name: 'Tailwind CSS', type: 'Styling Architecture' },
    { name: 'PWA Service Worker', type: 'Native Mobile Offline' },
  ];

  const workoutProcess = [
    { step: '01', title: 'PILIH SPLIT', desc: 'Pilih rutinitas latihan harian kamu.' },
    { step: '02', title: 'INPUT SESI', desc: 'Pilih gerakan dari katalog 40+ latihan.' },
    { step: '03', title: 'CATAT SET', desc: 'Masukkan beban kg/lbs & repetisi per set.' },
    { step: '04', title: 'REST TIMER', desc: 'Hitung jeda istirahat dengan alarm chime.' },
    { step: '05', title: 'RANK UP', desc: 'Akumulasi volume & naikkan Gym Rank.' },
  ];

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* 1. HERO SECTION - Replicating AV / DIGITAL DESIGNER Exact Hero */}
      <section className="solid-card p-8 sm:p-14 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Massive Headline & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest border-b border-[#6C6D74] pb-2 inline-block">
              WORKOUT SCHEDULER & GYM LOG SYSTEM
            </div>

            {/* MASSIVE CONDENSED HEADLINE LIKE "DIGITAL DESIGNER" */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black text-[#D3D1CE] leading-none tracking-tight">
              WORKOUT<br />
              TRACKER
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
                Mulai Catat Sesi <ArrowUpRight className="w-4 h-4" />
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

          {/* Right Column: Hero Gym Asset in Dark Frame */}
          <div className="lg:col-span-5 relative">
            <div className="solid-card p-2 bg-[#090F15] border border-[#6C6D74] relative overflow-hidden group">
              <img
                src="/hero-gym.jpg"
                alt="NaooLift Dark Gym Photography"
                className="w-full h-[380px] sm:h-[460px] object-cover rounded-sm grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating Badge like "AVAILABLE FOR FREELANCE" in Image 4 */}
              <div className="absolute top-4 right-4 bg-[#090F15]/90 border border-[#6C6D74] px-3 py-1.5 rounded-sm text-right">
                <span className="text-[9px] font-mono text-[#B3B7BA] uppercase block">SYSTEM READY</span>
                <span className="text-[11px] font-heading font-bold text-[#D3D1CE] uppercase">FOR WORKOUT LOGGING</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-[#090F15]/90 border border-[#6C6D74] p-3 text-xs font-mono flex items-center justify-between">
                <span className="text-[#D3D1CE] font-bold">EST. 2026 / NAOOLIFT</span>
                <span className="text-[#B3B7BA] uppercase text-[10px]">SOLID EDITORIAL SYSTEM</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HORIZONTAL STATS CARD - Replicating Image 4 Full-Width Stat Card */}
      <section className="solid-card p-8 bg-[#262E36] border border-[#6C6D74]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#6C6D74]">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="p-4 sm:p-6 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#B3B7BA] mb-1">
                  <Icon className="w-4 h-4 text-[#D3D1CE]" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#D3D1CE]">
                  {st.number}
                </div>
                <div className="text-xs font-heading font-bold text-[#D3D1CE] tracking-wider uppercase">
                  {st.label}
                </div>
                <div className="text-[11px] font-mono text-[#B3B7BA]">
                  {st.sub}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED WORK / CORE MODULES (3 Bento Cards in a Row) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#6C6D74] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">CORE SYSTEM</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#D3D1CE]">
              MODUL UTAMA NAOOLIFT
            </h2>
          </div>
          <Link href="/routines" className="text-xs font-heading font-bold text-[#D3D1CE] hover:text-[#FFFFFF] flex items-center gap-1">
            EXPLORE ALL FITUR <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModules.map((item, idx) => (
            <div key={idx} className="solid-card p-6 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="solid-card p-1.5 bg-[#090F15] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-44 object-cover rounded-sm grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
                    {item.category} • {item.type}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-[#D3D1CE] mt-1">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[#B3B7BA] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6C6D74] flex items-center justify-between">
                <span className="text-xs font-mono text-[#B3B7BA]">NAOOLIFT MODULE</span>
                <Link
                  href={item.link}
                  className="w-8 h-8 rounded-full border border-[#6C6D74] flex items-center justify-center text-[#D3D1CE] group-hover:bg-[#D3D1CE] group-hover:text-[#090F15] transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CORE CAPABILITIES & TOOLS/TECHNOLOGIES GRID (2 Columns - Replicating Image 4) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Capabilities (6 Grid Items) */}
        <div className="lg:col-span-7 solid-card p-8 space-y-6">
          <div className="border-b border-[#6C6D74] pb-4">
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">SYSTEM ARCHITECTURE</span>
            <h2 className="text-2xl font-heading font-black text-[#D3D1CE]">
              KAPABILITAS & FITUR UTAMA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreCapabilities.map((cap, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D3D1CE]" />
                  <h3 className="font-heading font-bold text-xs text-[#D3D1CE] uppercase tracking-wider">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-xs text-[#B3B7BA] leading-relaxed pl-6">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tools & Technologies Stack */}
        <div className="lg:col-span-5 solid-card p-8 space-y-6">
          <div className="border-b border-[#6C6D74] pb-4">
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">BACKEND & FRONTEND STACK</span>
            <h2 className="text-2xl font-heading font-black text-[#D3D1CE]">
              TEKNOLOGI INTEGRATED
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {techStack.map((tech, idx) => (
              <div key={idx} className="bg-[#090F15] border border-[#6C6D74] p-3 rounded-sm">
                <span className="text-xs font-heading font-bold text-[#D3D1CE] block">{tech.name}</span>
                <span className="text-[10px] font-mono text-[#B3B7BA]">{tech.type}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#6C6D74] space-y-2">
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">SYSTEM CERTIFICATION & STORAGE</span>
            <div className="bg-[#090F15] border border-[#6C6D74] p-3 rounded-sm flex items-center justify-between text-xs font-mono">
              <span className="text-[#D3D1CE]">MySQL 8.0 Local DB</span>
              <span className="text-[#B3B7BA]">CONNECTED (3306)</span>
            </div>
          </div>
        </div>

      </section>

      {/* 5. WORKOUT PROCESS (5 Horizontal Cards - Replicating Image 4 MY DESIGN PROCESS) */}
      <section className="space-y-6">
        <div className="border-b border-[#6C6D74] pb-4">
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">WORKFLOW STEP</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#D3D1CE]">
            ALUR PENGGUNAAN NAOOLIFT
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {workoutProcess.map((proc) => (
            <div key={proc.step} className="solid-card p-5 space-y-3">
              <span className="text-xl font-heading font-black text-[#6C6D74] block">
                {proc.step}
              </span>
              <h3 className="font-heading font-bold text-xs text-[#D3D1CE] uppercase tracking-wider">
                {proc.title}
              </h3>
              <p className="text-[11px] text-[#B3B7BA] leading-normal">
                {proc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BIG BOTTOM FOOTER BANNER CTA (Replicating Image 4 Bottom Banner) */}
      <section className="solid-card p-8 sm:p-14 bg-[#262E36] border border-[#6C6D74] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest">READY TO LIFT?</span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-[#D3D1CE] leading-tight">
              LET'S BUILD YOUR GYM PROGRESSION.
            </h2>
            <p className="text-xs sm:text-sm text-[#B3B7BA]">
              Lacak setiap set, beban, repetisi, dan jeda istirahat dengan sistem presisi NaooLift.
            </p>
          </div>

          <Link
            href="/logger"
            className="solid-btn-primary px-10 py-5 text-sm uppercase tracking-wider flex items-center justify-center gap-3 whitespace-nowrap"
          >
            Mulai Catat Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer Contact & Copyright Bar */}
        <div className="pt-8 border-t border-[#6C6D74] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#B3B7BA]">
          <span>© 2026 NAOOLIFT. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#D3D1CE]">BERANDA</Link>
            <Link href="/routines" className="hover:text-[#D3D1CE]">JADWAL SPLIT</Link>
            <Link href="/history" className="hover:text-[#D3D1CE]">ANALYTICS</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
