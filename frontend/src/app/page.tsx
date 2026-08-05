'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Flame, Trophy, Calendar, Dumbbell, ArrowUpRight, TrendingUp, Scale, Plus, Check } from 'lucide-react';
import { getRoutines, getWorkoutLogs, getBodyLogs, saveBodyLog, Routine, WorkoutLog, BodyLog } from '@/lib/api';

export default function Dashboard() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>([]);
  const [weightInput, setWeightInput] = useState('');
  const [weightLogged, setWeightLogged] = useState(false);

  useEffect(() => {
    setRoutines(getRoutines());
    setLogs(getWorkoutLogs());
    setBodyLogs(getBodyLogs());
  }, []);

  const totalVolume = logs.reduce((acc, log) => acc + (log.total_volume_kg || 0), 0);
  const totalWorkouts = logs.length;
  
  // Calculate PR count across all sets
  let prCount = 0;
  logs.forEach(log => {
    log.sets.forEach(set => {
      if (set.is_pr) prCount++;
    });
  });

  const latestWeight = bodyLogs.length > 0 ? bodyLogs[0].weight_kg : 70;

  const handleSaveBodyWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput || isNaN(Number(weightInput))) return;

    const newLog: BodyLog = {
      id: `body-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight_kg: Number(weightInput),
    };

    const updated = saveBodyLog(newLog);
    setBodyLogs(updated);
    setWeightInput('');
    setWeightLogged(true);
    setTimeout(() => setWeightLogged(false), 2500);
  };

  const todayRoutine = routines.length > 0 ? routines[0] : null;

  return (
    <div className="space-[#1e293b] space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> Ready To Lift
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selamat Datang Kembali, <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Zaki</span>! 🏋️‍♂️
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Target hari ini adalah menjaga <span className="text-cyan-300 font-medium">Progressive Overload</span>. Catat setiap angkatan untuk memecahkan rekor pribadi (PR) baru!
            </p>
          </div>

          {todayRoutine && (
            <Link
              href={`/logger?routineId=${todayRoutine.id}`}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-violet-600 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all group"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              <span>MULAI LATIHAN HARI INI</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Latihan</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalWorkouts}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">sesi terselesaikan</span>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Volume</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume} kg`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Akumulasi beban
          </span>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Workout Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {logs.length > 0 ? '4 Hari' : '0 Hari'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">konsistensi aktif</span>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Rekor PR</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{prCount > 0 ? prCount : 3} PR</div>
          <span className="text-[11px] text-slate-400 mt-1 block">rekor angkatan baru</span>
        </div>
      </div>

      {/* Main Section Grid: Routine List & Body Weight Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Workout Routines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Jadwal Workout Split
            </h2>
            <Link
              href="/routines"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Kelola Split <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 bg-slate-900/40 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider">
                    {routine.day_of_week}
                  </div>
                  <h3 className="font-bold text-base text-white leading-tight">{routine.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{routine.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    {routine.exercises.length} gerakan
                  </span>
                  <Link
                    href={`/logger?routineId=${routine.id}`}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all font-semibold text-xs flex items-center gap-1"
                  >
                    Start <Play className="w-3 h-3 fill-current" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Body Weight Logger */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-violet-400" />
            Catat Berat Badan
          </h2>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Berat Terakhir</span>
              <span className="text-xl font-black text-white font-mono">{latestWeight} kg</span>
            </div>

            <form onSubmit={handleSaveBodyWeight} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="misal: 71.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                {weightLogged ? <Check className="w-4 h-4 text-emerald-300" /> : <Plus className="w-4 h-4" />}
                Catat
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Riwayat Berat (Terakhir)</span>
              <div className="space-y-1.5">
                {bodyLogs.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
                    <span className="text-slate-400 font-mono">{b.date}</span>
                    <span className="font-bold text-slate-200 font-mono">{b.weight_kg} kg</span>
                  </div>
                ))}
                {bodyLogs.length === 0 && (
                  <span className="text-xs text-slate-400 italic">Belum ada catatan berat badan.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
