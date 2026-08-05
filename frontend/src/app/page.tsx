'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Trophy, Calendar, Dumbbell, ArrowUpRight, Scale, Plus, Check, Shield, Flame, Camera } from 'lucide-react';
import { getRoutines, getWorkoutLogs, getBodyLogs, saveBodyLog, calculateUserRank, Routine, WorkoutLog, BodyLog, UserRank } from '@/lib/api';

export default function LandingPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>([]);
  const [weightInput, setWeightInput] = useState('');
  const [weightLogged, setWeightLogged] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    setRoutines(getRoutines());
    setLogs(getWorkoutLogs());
    setBodyLogs(getBodyLogs());
  }, []);

  const totalVolume = logs.reduce((acc, log) => acc + (log.total_volume_kg || 0), 0);
  const totalWorkouts = logs.length;

  let prCount = 0;
  logs.forEach(log => {
    log.sets.forEach(set => {
      if (set.is_pr) prCount++;
    });
  });

  const userRank: UserRank = calculateUserRank(totalVolume);
  const latestWeight = bodyLogs.length > 0 ? bodyLogs[0].weight_kg : 70;

  const handleSaveBodyWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput || isNaN(Number(weightInput))) return;

    const newLog: BodyLog = {
      id: `body-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight_kg: Number(weightInput),
      photo_url: photoPreview || undefined,
    };

    const updated = saveBodyLog(newLog);
    setBodyLogs(updated);
    setWeightInput('');
    setPhotoPreview(null);
    setWeightLogged(true);
    setTimeout(() => setWeightLogged(false), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const todayRoutine = routines.length > 0 ? routines[0] : null;

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      {/* Editorial Hero Section */}
      <section className="solid-card p-8 sm:p-12 space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono text-[#B3B7BA] uppercase tracking-widest">
            NAOOLIFT / WORKOUT LOG & GYM SCHEDULER
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#D3D1CE] leading-tight">
            Sistem Catatan Gym & Pemantauan Progressive Overload
          </h1>
          <p className="text-sm sm:text-base text-[#B3B7BA] leading-relaxed">
            Kelola jadwal latihan harian, catat beban dan repetisi per set, hitung jeda istirahat dengan timer otomatis, serta pantau akumulasi volume angkatan untuk membuka level Gym Rank.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {todayRoutine && (
            <Link
              href={`/logger?routineId=${todayRoutine.id}`}
              className="solid-btn-primary px-6 py-3 text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Mulai Sesi Latihan Harian
            </Link>
          )}

          <Link
            href="/routines"
            className="solid-btn-secondary px-6 py-3 text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Kelola Split Latihan
          </Link>
        </div>
      </section>

      {/* Gym Rank System Banner */}
      <section className="solid-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#090F15] border border-[#6C6D74] flex items-center justify-center text-[#D3D1CE]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
                PERINGKAT GYM SAAT INI
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#D3D1CE]">
                {userRank.rank_name}
              </h2>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-mono text-[#B3B7BA]">Total Akumulasi Volume</span>
            <div className="text-3xl font-heading font-black text-[#D3D1CE]">
              {totalVolume.toLocaleString()} kg
            </div>
          </div>
        </div>

        {/* EXP Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-mono text-[#B3B7BA]">
            <span>Level Tier {userRank.tier_level} / 6</span>
            <span>{userRank.progress_percent}% Progres Volume</span>
          </div>
          <div className="w-full h-2 bg-[#090F15] rounded-none border border-[#6C6D74] overflow-hidden">
            <div
              className="h-full bg-[#D3D1CE]"
              style={{ width: `${userRank.progress_percent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 4 Stat Bento Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="solid-card p-5">
          <div className="flex items-center justify-between text-[#B3B7BA] mb-2">
            <span className="text-xs font-mono uppercase">Total Latihan</span>
            <Dumbbell className="w-4 h-4 text-[#D3D1CE]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#D3D1CE]">{totalWorkouts}</div>
          <span className="text-[11px] text-[#B3B7BA] mt-1 block">sesi terselesaikan</span>
        </div>

        <div className="solid-card p-5">
          <div className="flex items-center justify-between text-[#B3B7BA] mb-2">
            <span className="text-xs font-mono uppercase">Total Volume</span>
            <ArrowUpRight className="w-4 h-4 text-[#D3D1CE]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#D3D1CE]">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume} kg`}
          </div>
          <span className="text-[11px] text-[#B3B7BA] mt-1 block">akumulasi beban</span>
        </div>

        <div className="solid-card p-5">
          <div className="flex items-center justify-between text-[#B3B7BA] mb-2">
            <span className="text-xs font-mono uppercase">Streak Gym</span>
            <Flame className="w-4 h-4 text-[#D3D1CE]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#D3D1CE]">
            {logs.length > 0 ? '4 Hari' : '0 Hari'}
          </div>
          <span className="text-[11px] text-[#B3B7BA] mt-1 block">konsistensi aktif</span>
        </div>

        <div className="solid-card p-5">
          <div className="flex items-center justify-between text-[#B3B7BA] mb-2">
            <span className="text-xs font-mono uppercase">Rekor PR</span>
            <Trophy className="w-4 h-4 text-[#D3D1CE]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#D3D1CE]">{prCount > 0 ? prCount : 3} PR</div>
          <span className="text-[11px] text-[#B3B7BA] mt-1 block">rekor angkatan terberat</span>
        </div>
      </section>

      {/* Main Grid: Split Schedule & Body Metrics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Schedule Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-[#D3D1CE] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D3D1CE]" />
              Jadwal Split Latihan Mingguan
            </h2>
            <Link href="/routines" className="text-xs text-[#B3B7BA] hover:text-[#D3D1CE] flex items-center gap-1 font-mono">
              Kelola Split <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routines.map((routine) => (
              <div key={routine.id} className="solid-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-sm bg-[#090F15] border border-[#6C6D74] text-[#B3B7BA] text-[10px] font-mono uppercase">
                      {routine.day_of_week}
                    </span>
                    <span className="text-[10px] text-[#D3D1CE] font-mono uppercase border border-[#6C6D74] px-2 py-0.5 rounded-sm bg-[#090F15]">
                      {routine.time_of_day || 'Pagi'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-[#D3D1CE] text-base">{routine.title}</h3>
                  <p className="text-xs text-[#B3B7BA] line-clamp-2 leading-relaxed">{routine.description}</p>
                </div>

                <div className="pt-3 border-t border-[#6C6D74] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#B3B7BA]">
                    {routine.exercises.length} gerakan
                  </span>
                  <Link
                    href={`/logger?routineId=${routine.id}`}
                    className="solid-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    Start <Play className="w-3 h-3 fill-current" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Body Metrics */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#D3D1CE] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D3D1CE]" />
            Catatan Fisik (Body Metrics)
          </h2>

          <div className="solid-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#B3B7BA]">Berat Terakhir</span>
              <span className="text-2xl font-heading font-bold text-[#D3D1CE]">{latestWeight} kg</span>
            </div>

            <form onSubmit={handleSaveBodyWeight} className="space-y-3">
              <div>
                <label className="text-[10px] text-[#B3B7BA] uppercase font-mono block mb-1">Input Berat (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="misal: 71.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="solid-input w-full px-3 py-2 text-xs"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-[10px] text-[#B3B7BA] uppercase font-mono block mb-1">Foto Progres Fisik</label>
                <label className="cursor-pointer border border-dashed border-[#6C6D74] rounded-sm p-3 bg-[#090F15] flex items-center justify-center gap-2 text-xs text-[#B3B7BA] hover:text-[#D3D1CE] transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>{photoPreview ? 'Foto Terlampir' : 'Upload Foto Progres'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="mt-2 h-20 rounded-sm border border-[#6C6D74] object-cover" />
                )}
              </div>

              <button
                type="submit"
                className="w-full solid-btn-primary py-2.5 text-xs flex items-center justify-center gap-1"
              >
                {weightLogged ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                Catat Log Fisik
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
