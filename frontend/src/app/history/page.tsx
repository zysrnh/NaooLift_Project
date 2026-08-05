'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, Dumbbell, Award, Flame, Clock, TrendingUp } from 'lucide-react';
import { getWorkoutLogs, DEFAULT_EXERCISES, WorkoutLog, WorkoutSet } from '@/lib/api';

export default function HistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    setLogs(getWorkoutLogs());
  }, []);

  // Compute PRs per exercise across all historical logs
  const prMap: Record<string, { maxWeight: number; maxReps: number; date: string }> = {};

  logs.forEach(log => {
    log.sets.forEach(setObj => {
      const exId = setObj.exercise_id;
      if (!prMap[exId] || setObj.weight_kg > prMap[exId].maxWeight) {
        prMap[exId] = {
          maxWeight: setObj.weight_kg,
          maxReps: setObj.reps,
          date: log.date,
        };
      }
    });
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          Trophy Room & Riwayat Gym
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Lacak rekor angkatan pribadi (PR) terberat dan riwayat sesi latihan dari waktu ke waktu.
        </p>
      </div>

      {/* Trophy Room: Top PR Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Rekor Angkatan Terberat (Personal Records)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(prMap).length > 0 ? (
            Object.keys(prMap).map(exId => {
              const pr = prMap[exId];
              const ex = DEFAULT_EXERCISES.find(e => e.id === exId);
              return (
                <div
                  key={exId}
                  className="glass-card glass-card-hover rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Trophy className="w-4 h-4 fill-amber-400" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    {ex?.muscle_group || 'PR'}
                  </span>
                  <h3 className="font-bold text-base text-white pr-8">{ex?.name || exId}</h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{pr.maxWeight} kg</span>
                    <span className="text-xs text-slate-400">× {pr.maxReps} reps</span>
                  </div>

                  <span className="text-[11px] text-slate-400 mt-2 block font-mono">
                    Dipecahkan pada {pr.date}
                  </span>
                </div>
              );
            })
          ) : (
            // Default sample PR cards if no logs yet
            [
              { name: 'Barbell Bench Press', weight: 85, reps: 5, group: 'Chest' },
              { name: 'Barbell Back Squat', weight: 105, reps: 6, group: 'Legs' },
              { name: 'Conventional Deadlift', weight: 130, reps: 3, group: 'Back' },
            ].map((sample, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-amber-500/20 bg-slate-900/40 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Trophy className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  {sample.group}
                </span>
                <h3 className="font-bold text-base text-white pr-8">{sample.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">{sample.weight} kg</span>
                  <span className="text-xs text-slate-400">× {sample.reps} reps</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block font-mono">Sampel PR</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chronological Workout History Logs */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          Riwayat Latihan Gym
        </h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/40 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">{log.date}</span>
                  <h3 className="text-lg font-bold text-white">{log.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {log.duration_minutes} menit
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" /> {log.total_volume_kg} kg
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold">
                    {log.feeling_rating}★
                  </span>
                </div>
              </div>

              {/* Set details breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Ringkasan Angkatan ({log.sets.length} Set Selesai)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {log.sets.map((setObj, sIdx) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === setObj.exercise_id);
                    return (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-950 border border-slate-800/80"
                      >
                        <span className="font-medium text-slate-200 truncate max-w-[160px]">
                          {ex?.name || setObj.exercise_id}
                        </span>
                        <span className="font-mono text-cyan-300 font-bold">
                          {setObj.weight_kg}kg × {setObj.reps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center text-slate-400 space-y-2">
              <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">Belum ada riwayat latihan. Mulai latihan pertama kamu di menu <strong>Start Workout</strong>!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
