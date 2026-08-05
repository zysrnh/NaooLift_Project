'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Trophy, Calendar, Dumbbell, ArrowUpRight, Scale, Plus, Check, Shield, Flame, Camera } from 'lucide-react';
import { getRoutines, getWorkoutLogs, getBodyLogs, saveBodyLog, calculateUserRank, Routine, WorkoutLog, BodyLog, UserRank } from '@/lib/api';

export default function Dashboard() {
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
  
  // Calculate PR count
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
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Hero Section */}
      <div className="taste-card p-6 sm:p-8 bg-gradient-to-r from-[#181717] via-[#1A1919] to-[#121212] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F0E0E] border border-[#3E3A3A] text-xs font-mono text-[#7D7D7D] uppercase tracking-wider">
              <span>●</span> System Active • NaooLift
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#F9F9F9] tracking-tight">
              Selamat Datang Kembali, Zaki
            </h1>
            <p className="text-[#7D7D7D] text-xs sm:text-sm max-w-xl">
              Target hari ini adalah melampaui <span className="text-[#F9F9F9] font-semibold">Progressive Overload</span>. Catat setiap angkatan untuk membuka peringkat rank gym selanjutnya.
            </p>
          </div>

          {todayRoutine && (
            <Link
              href={`/logger?routineId=${todayRoutine.id}`}
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#F9F9F9] text-[#010101] font-black text-sm hover:bg-white transition-transform active:scale-95 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              MULAI LATIHAN HARI INI
            </Link>
          )}
        </div>
      </div>

      {/* Gym Rank Tier System Card */}
      <div className="taste-card p-6 border-l-4 border-l-[#F59E0B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0F0E0E] border border-[#3E3A3A] flex items-center justify-center text-[#F59E0B]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#7D7D7D] uppercase tracking-widest block">PERINGKAT GYM KAMU</span>
              <h2 className="text-xl font-extrabold text-[#F9F9F9]">{userRank.rank_name}</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-[#7D7D7D]">Total Akumulasi Volume</span>
            <div className="text-2xl font-black text-[#F9F9F9] font-mono">{totalVolume.toLocaleString()} kg</div>
          </div>
        </div>

        {/* EXP Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-mono text-[#7D7D7D]">
            <span>Level Progress (Tier {userRank.tier_level}/6)</span>
            <span>{userRank.progress_percent}% ke Rank Berikutnya</span>
          </div>
          <div className="w-full h-2.5 bg-[#0F0E0E] rounded-full overflow-hidden border border-[#3E3A3A]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000"
              style={{ width: `${userRank.progress_percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Stat Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="taste-card p-5">
          <div className="flex items-center justify-between text-[#7D7D7D] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Latihan</span>
            <Dumbbell className="w-4 h-4 text-[#F9F9F9]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F9F9F9] font-mono">{totalWorkouts}</div>
          <span className="text-[11px] text-[#7D7D7D] mt-1 block">sesi terselesaikan</span>
        </div>

        <div className="taste-card p-5">
          <div className="flex items-center justify-between text-[#7D7D7D] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Volume</span>
            <ArrowUpRight className="w-4 h-4 text-[#F9F9F9]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F9F9F9] font-mono">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume} kg`}
          </div>
          <span className="text-[11px] text-[#7D7D7D] mt-1 block">akumulasi angkatan</span>
        </div>

        <div className="taste-card p-5">
          <div className="flex items-center justify-between text-[#7D7D7D] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Streak Latihan</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F9F9F9] font-mono">
            {logs.length > 0 ? '4 Hari' : '0 Hari'}
          </div>
          <span className="text-[11px] text-[#7D7D7D] mt-1 block">konsistensi aktif</span>
        </div>

        <div className="taste-card p-5">
          <div className="flex items-center justify-between text-[#7D7D7D] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Rekor PR</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F9F9F9] font-mono">{prCount > 0 ? prCount : 3} PR</div>
          <span className="text-[11px] text-[#7D7D7D] mt-1 block">rekor angkatan baru</span>
        </div>
      </div>

      {/* Main Grid: Weekly Schedule Matrix & Body Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Weekly Schedule Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F9F9F9] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F9F9F9]" />
              Jadwal Mingguan Latihan (Split Schedule)
            </h2>
            <Link href="/routines" className="text-xs text-[#7D7D7D] hover:text-[#F9F9F9] flex items-center gap-1 font-mono">
              Kelola Split <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routines.map((routine) => (
              <div key={routine.id} className="taste-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0F0E0E] border border-[#3E3A3A] text-[#7D7D7D] text-[10px] font-mono uppercase">
                      {routine.day_of_week}
                    </span>
                    <span className="text-[10px] text-[#7D7D7D] font-mono">
                      {routine.time_of_day || 'Pagi'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#F9F9F9]">{routine.title}</h3>
                  <p className="text-xs text-[#7D7D7D] line-clamp-2">{routine.description}</p>
                </div>

                <div className="pt-3 border-t border-[#3E3A3A] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#7D7D7D]">
                    {routine.exercises.length} gerakan
                  </span>
                  <Link
                    href={`/logger?routineId=${routine.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#F9F9F9] text-[#010101] text-xs font-bold hover:bg-white transition-transform active:scale-95 flex items-center gap-1"
                  >
                    Start <Play className="w-3 h-3 fill-current" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Body Weight & Progress Photo Log */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#F9F9F9] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#F9F9F9]" />
            Catatan Fisik (Body Metrics)
          </h2>

          <div className="taste-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7D7D7D]">Berat Terakhir</span>
              <span className="text-2xl font-black text-[#F9F9F9] font-mono">{latestWeight} kg</span>
            </div>

            <form onSubmit={handleSaveBodyWeight} className="space-y-3">
              <div>
                <label className="text-[10px] text-[#7D7D7D] uppercase font-mono block mb-1">Input Berat (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="misal: 71.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="taste-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* Photo Progress Upload */}
              <div>
                <label className="text-[10px] text-[#7D7D7D] uppercase font-mono block mb-1">Foto Progres Fisik (Opsional)</label>
                <label className="cursor-pointer border border-dashed border-[#3E3A3A] rounded-xl p-3 bg-[#0F0E0E] flex items-center justify-center gap-2 text-xs text-[#7D7D7D] hover:text-[#F9F9F9]">
                  <Camera className="w-4 h-4" />
                  <span>{photoPreview ? 'Foto Terlampir' : 'Upload Foto Body Spec'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="mt-2 h-20 rounded-lg border border-[#3E3A3A] object-cover" />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#F9F9F9] text-[#010101] font-bold text-xs hover:bg-white transition-colors flex items-center justify-center gap-1"
              >
                {weightLogged ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                Catat Log Fisik
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
