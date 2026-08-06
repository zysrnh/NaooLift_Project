'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Calendar, Dumbbell, Award, Clock, TrendingUp, Camera, Shield } from 'lucide-react';
import { getWorkoutLogs, getBodyLogs, DEFAULT_EXERCISES, WorkoutLog, BodyLog } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export default function HistoryPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>([]);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push('/login');
      return;
    }
    setLogs(getWorkoutLogs());
    setBodyLogs(getBodyLogs());
  }, [router]);

  // Compute PRs per exercise
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

  const totalVolumeKg = logs.reduce((acc, log) => acc + log.total_volume_kg, 0);

  // Compute Gym Rank
  let currentRank = { tier: 'Tier 1: Iron Novice', label: 'IRON', icon: '🥉', color: 'text-amber-600', nextGoal: '5,000 kg Volume' };
  if (totalVolumeKg >= 50000) {
    currentRank = { tier: 'Tier 6: Gym God / Legend', label: 'LEGEND', icon: '👑', color: 'text-purple-400', nextGoal: 'MAX LEVEL REACHED!' };
  } else if (totalVolumeKg >= 25000) {
    currentRank = { tier: 'Tier 5: Platinum Lifter', label: 'PLATINUM', icon: '💎', color: 'text-cyan-400', nextGoal: '50,000 kg for Legend' };
  } else if (totalVolumeKg >= 10000) {
    currentRank = { tier: 'Tier 4: Gold Titan', label: 'GOLD', icon: '🥇', color: 'text-yellow-400', nextGoal: '25,000 kg for Platinum' };
  } else if (totalVolumeKg >= 5000) {
    currentRank = { tier: 'Tier 3: Silver Striker', label: 'SILVER', icon: '🥈', color: 'text-slate-300', nextGoal: '10,000 kg for Gold' };
  } else if (totalVolumeKg >= 1000) {
    currentRank = { tier: 'Tier 2: Bronze Athlete', label: 'BRONZE', icon: '🥉', color: 'text-amber-700', nextGoal: '5,000 kg for Silver' };
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="solid-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest">
            PROGRESSIVE OVERLOAD & PERSONAL RECORDS
          </div>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            ANALYTICS & REKOR PR
          </h1>
          <p className="text-xs text-[#B3B7BA]">
            Pantau akumulasi volume angkatan, rekor terberat (PR), dan kenaikan level Gym Rank.
          </p>
        </div>

        {/* Gym Rank Badge */}
        <div className="bg-[#090F15] p-4 rounded-sm border border-[#262E36] flex items-center gap-3">
          <span className="text-3xl">{currentRank.icon}</span>
          <div>
            <span className="text-[9px] font-mono text-[#B3B7BA] uppercase block">CURRENT TIER</span>
            <span className={`text-sm font-heading font-black uppercase ${currentRank.color}`}>
              {currentRank.label}
            </span>
            <span className="text-[10px] font-mono text-[#B3B7BA] block">{currentRank.tier}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="solid-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-[#B3B7BA] text-xs font-mono">
            <Dumbbell className="w-4 h-4 text-[#D3D1CE]" />
            <span>TOTAL VOLUME LIFTED</span>
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#D3D1CE]">
            {totalVolumeKg.toLocaleString()} <span className="text-sm font-mono text-[#B3B7BA]">KG</span>
          </div>
          <div className="text-[11px] font-mono text-[#B3B7BA]">
            Akumulasi beban total seluruh sesi
          </div>
        </div>

        <div className="solid-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-[#B3B7BA] text-xs font-mono">
            <Trophy className="w-4 h-4 text-[#D3D1CE]" />
            <span>TOTAL REKOR PR (PERSONAL RECORD)</span>
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#D3D1CE]">
            {Object.keys(prMap).length} <span className="text-sm font-mono text-[#B3B7BA]">REKOR</span>
          </div>
          <div className="text-[11px] font-mono text-[#B3B7BA]">
            Gerakan dengan angkatan terberat
          </div>
        </div>

        <div className="solid-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-[#B3B7BA] text-xs font-mono">
            <Clock className="w-4 h-4 text-[#D3D1CE]" />
            <span>TOTAL SESI GYM LOGGED</span>
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#D3D1CE]">
            {logs.length} <span className="text-sm font-mono text-[#B3B7BA]">SESI</span>
          </div>
          <div className="text-[11px] font-mono text-[#B3B7BA]">
            Jadwal rutinitas latihan diselesaikan
          </div>
        </div>
      </div>

      {/* PR Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#262E36]">
          <div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">BEST PERFORMANCES</span>
            <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">REKOR ANGKATAN TERBERAT (PR)</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(prMap).map(([exId, pr]) => {
            const exInfo = DEFAULT_EXERCISES.find(e => e.id === exId);
            return (
              <div key={exId} className="solid-card p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#B3B7BA] uppercase">{exInfo?.muscle_group} • {exInfo?.equipment}</span>
                  <Award className="w-4 h-4 text-[#D3D1CE]" />
                </div>

                <div>
                  <h3 className="text-base font-heading font-bold text-[#D3D1CE] truncate">{exInfo?.name || exId}</h3>
                  <div className="text-2xl font-heading font-black text-[#D3D1CE] mt-1">
                    {pr.maxWeight} KG <span className="text-xs font-mono text-[#B3B7BA]">({pr.maxReps} Reps)</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#B3B7BA] pt-2 border-t border-[#262E36]">
                  Tercatat pada: {new Date(pr.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Table */}
      <div className="space-y-4 pt-4">
        <div className="pb-2 border-b border-[#262E36]">
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">WORKOUT HISTORY</span>
          <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">RIWAYAT SESI GYM LOGGED</h2>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="solid-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#262E36]">
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#D3D1CE]">{log.routine_title}</h3>
                  <div className="text-xs font-mono text-[#B3B7BA]">
                    {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {log.duration_minutes} Menit Sesi
                  </div>
                </div>

                <div className="bg-[#090F15] px-3 py-1.5 rounded-sm text-right font-mono">
                  <span className="text-[9px] text-[#B3B7BA] block uppercase">VOLUME SESI</span>
                  <span className="text-sm font-bold text-[#D3D1CE]">{log.total_volume_kg.toLocaleString()} KG</span>
                </div>
              </div>

              {/* Set details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {log.sets.map((s, idx) => {
                  const exObj = DEFAULT_EXERCISES.find(e => e.id === s.exercise_id);
                  return (
                    <div key={idx} className="bg-[#090F15] p-3 rounded-sm text-xs font-mono space-y-1">
                      <div className="text-[#D3D1CE] font-bold truncate">{exObj?.name || s.exercise_id}</div>
                      <div className="text-[#B3B7BA] flex items-center justify-between">
                        <span>Set {s.set_number}: {s.weight_kg} kg × {s.reps} reps</span>
                        {s.notes && <span className="text-[10px] text-amber-400">"{s.notes}"</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {log.notes && (
                <div className="text-xs font-mono text-[#B3B7BA] italic bg-[#090F15] p-2.5 rounded-sm">
                  Catatan Sesi: "{log.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
