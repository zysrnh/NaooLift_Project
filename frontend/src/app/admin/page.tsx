'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Dumbbell, 
  Trophy, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  BarChart3, 
  Search, 
  ArrowUpRight, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = [
    { title: 'TOTAL GYM LIFTERS', value: '1,248', change: '+14% minggu ini', icon: Users, sub: 'Pengguna Aktif' },
    { title: 'TOTAL VOLUME ANGKATAN', value: '428.5 TON', change: '+22% bulan ini', icon: TrendingUp, sub: 'Akumulasi Beban (kg)' },
    { title: 'LOG WORKOUT SESI', value: '3,892', change: '+184 hari ini', icon: Activity, sub: 'Sesi Latihan Logged' },
    { title: 'PERSONAL RECORDS (PR)', value: '642', change: '+32 PR baru', icon: Trophy, sub: 'Rekor Terbuka' },
  ];

  const gymRankDistribution = [
    { rank: 'Tier 1 - Iron Novice', count: 480, percentage: 38, color: '#B3B7BA' },
    { rank: 'Tier 2 - Bronze Lifter', count: 320, percentage: 26, color: '#CD7F32' },
    { rank: 'Tier 3 - Silver Beast', count: 240, percentage: 19, color: '#C0C0C0' },
    { rank: 'Tier 4 - Gold Athlete', count: 120, percentage: 10, color: '#FFD700' },
    { rank: 'Tier 5 - Platinum Titan', count: 68, percentage: 5, color: '#E5E4E2' },
    { rank: 'Tier 6 - Gym God / Naoo Legend', count: 20, percentage: 2, color: '#D3D1CE' },
  ];

  const topExercises = [
    { rank: '#01', name: 'Barbell Bench Press', group: 'Chest', totalLogs: '1,420 logs', avgWeight: '82.5 kg' },
    { rank: '#02', name: 'Barbell Back Squat', group: 'Legs', totalLogs: '1,180 logs', avgWeight: '110.0 kg' },
    { rank: '#03', name: 'Conventional Deadlift', group: 'Back', totalLogs: '980 logs', avgWeight: '140.0 kg' },
    { rank: '#04', name: 'Incline Dumbbell Press', group: 'Chest', totalLogs: '850 logs', avgWeight: '32.0 kg' },
    { rank: '#05', name: 'Pull-Up (Weighted)', group: 'Back', totalLogs: '720 logs', avgWeight: '+15.0 kg' },
  ];

  const recentUsers = [
    { name: 'Zaki Naoo', email: 'zaki@naoo.app', rank: 'Tier 5 - Platinum Titan', volume: '342,500 kg', lastActive: '2 menit lalu' },
    { name: 'Budi Santoso', email: 'budi@gmail.com', rank: 'Tier 3 - Silver Beast', volume: '48,200 kg', lastActive: '15 menit lalu' },
    { name: 'Rian Pratama', email: 'rian@gmail.com', rank: 'Tier 4 - Gold Athlete', volume: '112,000 kg', lastActive: '1 jam lalu' },
    { name: 'Deni Kurniawan', email: 'deni@gmail.com', rank: 'Tier 1 - Iron Novice', volume: '4,200 kg', lastActive: '3 jam lalu' },
    { name: 'Andi Wijaya', email: 'andi@gmail.com', rank: 'Tier 2 - Bronze Lifter', volume: '18,500 kg', lastActive: '5 jam lalu' },
  ];

  const filteredUsers = recentUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262E36] pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
            NAOOLIFT / MANAGEMENT CONSOLE
          </span>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            ADMIN DASHBOARD & SYSTEM MONITOR
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#262E36] px-3 py-1.5 rounded-sm text-xs font-mono text-[#D3D1CE] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            SYSTEM ONLINE (MySQL 3306)
          </span>
          <Link href="/" className="solid-btn-secondary px-4 py-1.5 text-xs flex items-center gap-1">
            Lihat Web <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="solid-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-wider">{m.title}</span>
                <div className="w-8 h-8 rounded-sm bg-[#090F15] flex items-center justify-center text-[#D3D1CE]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-heading font-black text-[#D3D1CE]">{m.value}</div>
                <span className="text-[11px] font-mono text-emerald-400">{m.change}</span>
              </div>

              <div className="pt-2 border-t border-[#090F15] text-[10px] font-mono text-[#B3B7BA]">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MAIN WIDGETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Exercises & Rank Distribution */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Top Exercises Widget */}
          <div className="solid-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#090F15] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">POPULARITY MATRIX</span>
                <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">
                  GERAKAN GYM PALING POPULER
                </h2>
              </div>
              <span className="text-xs font-mono text-[#B3B7BA]">TOP 5 EXERCISES</span>
            </div>

            <div className="space-y-3">
              {topExercises.map((ex, idx) => (
                <div key={idx} className="bg-[#090F15] p-4 rounded-sm flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold text-[#6C6D74] w-6">{ex.rank}</span>
                    <div>
                      <span className="font-heading font-bold text-[#D3D1CE] block">{ex.name}</span>
                      <span className="text-[10px] font-mono text-[#B3B7BA] uppercase">{ex.group}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[#D3D1CE] font-bold block">{ex.totalLogs}</span>
                    <span className="text-[10px] text-[#B3B7BA]">Rata-rata: {ex.avgWeight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity & Peak Gym Days */}
          <div className="solid-card p-8 space-y-6">
            <div className="border-b border-[#090F15] pb-4">
              <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">TRAFFIC INSIGHTS</span>
              <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">
                HARI TERRAMAI SESI LATIHAN GYM
              </h2>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {[
                { day: 'SEN', count: '482', active: true },
                { day: 'SEL', count: '310', active: false },
                { day: 'RAB', count: '460', active: true },
                { day: 'KAM', count: '290', active: false },
                { day: 'JUM', count: '512', active: true },
                { day: 'SAB', count: '380', active: false },
                { day: 'MIN', count: '140', active: false },
              ].map((d, i) => (
                <div key={i} className={`p-3 rounded-sm space-y-1 ${d.active ? 'bg-[#D3D1CE] text-[#090F15]' : 'bg-[#090F15] text-[#B3B7BA]'}`}>
                  <span className="text-[10px] font-mono font-bold block">{d.day}</span>
                  <span className="text-sm font-heading font-black block">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Gym Rank Distribution */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="solid-card p-8 space-y-6">
            <div className="border-b border-[#090F15] pb-4">
              <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">USER PROGRESSION</span>
              <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">
                DISTRIBUSI GYM RANK LEVEL
              </h2>
            </div>

            <div className="space-y-4">
              {gymRankDistribution.map((rnk, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D3D1CE]">{rnk.rank}</span>
                    <span className="text-[#B3B7BA]">{rnk.count} lifters ({rnk.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#090F15] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D3D1CE]" 
                      style={{ width: `${rnk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#090F15] text-xs font-mono text-[#B3B7BA] space-y-2">
              <div className="flex items-center justify-between">
                <span>Rata-rata Volume User:</span>
                <span className="text-[#D3D1CE] font-bold">48,500 kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Top Lifter Volume:</span>
                <span className="text-[#D3D1CE] font-bold">642,800 kg (Gym God)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. RECENT USERS & LIFTER MANAGEMENT TABLE */}
      <div className="solid-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#090F15] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">USER DIRECTORY</span>
            <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">
              MANAJEMEN PENGGUNA TERKINI
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="solid-input w-full pl-9 pr-4 py-2 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#090F15] text-[#B3B7BA] text-[10px] uppercase">
                <th className="pb-3 pr-4">NAMA PENGGUNA</th>
                <th className="pb-3 px-4">EMAIL ADDRESS</th>
                <th className="pb-3 px-4">GYM RANK</th>
                <th className="pb-3 px-4">TOTAL VOLUME (KG)</th>
                <th className="pb-3 pl-4 text-right">TERAKHIR AKTIF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#090F15]">
              {filteredUsers.map((usr, i) => (
                <tr key={i} className="hover:bg-[#090F15]/50 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[#D3D1CE]">{usr.name}</td>
                  <td className="py-3.5 px-4 text-[#B3B7BA]">{usr.email}</td>
                  <td className="py-3.5 px-4 text-[#D3D1CE]">{usr.rank}</td>
                  <td className="py-3.5 px-4 font-bold text-[#D3D1CE]">{usr.volume}</td>
                  <td className="py-3.5 pl-4 text-right text-[#B3B7BA]">{usr.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
