'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, Dumbbell, Award, Clock, TrendingUp, Camera } from 'lucide-react';
import { getWorkoutLogs, getBodyLogs, DEFAULT_EXERCISES, WorkoutLog, BodyLog } from '@/lib/api';

export default function HistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>([]);

  useEffect(() => {
    setLogs(getWorkoutLogs());
    setBodyLogs(getBodyLogs());
  }, []);

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4">
        <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
          NAOOLIFT / ANALYTICS & HISTORY
        </span>
        <h1 className="text-3xl font-heading font-black text-[#D3D1CE] flex items-center gap-3">
          <Trophy className="w-7 h-7 text-[#D3D1CE]" />
          ANALYTICS & PR TROPHY ROOM
        </h1>
      </div>

      {/* Trophy Room: Top PR Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-[#D3D1CE] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#D3D1CE]" />
          Rekor Angkatan Terberat (Personal Records)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(prMap).length > 0 ? (
            Object.keys(prMap).map(exId => {
              const pr = prMap[exId];
              const ex = DEFAULT_EXERCISES.find(e => e.id === exId);
              return (
                <div key={exId} className="solid-card p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-wider">
                      {ex?.muscle_group || 'PR'}
                    </span>
                    <Trophy className="w-4 h-4 text-[#D3D1CE]" />
                  </div>

                  <h3 className="font-heading font-bold text-sm text-[#D3D1CE]">{ex?.name || exId}</h3>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-heading font-black text-[#D3D1CE]">{pr.maxWeight} kg</span>
                    <span className="text-xs text-[#B3B7BA]">× {pr.maxReps} reps</span>
                  </div>

                  <span className="text-[10px] text-[#B3B7BA] font-mono mt-2 block">
                    Dipecahkan pada {pr.date}
                  </span>
                </div>
              );
            })
          ) : (
            // Default sample PR cards
            [
              { name: 'Barbell Bench Press', weight: 85, reps: 5, group: 'Chest' },
              { name: 'Barbell Back Squat', weight: 105, reps: 6, group: 'Legs' },
              { name: 'Conventional Deadlift', weight: 130, reps: 3, group: 'Back' },
            ].map((sample, idx) => (
              <div key={idx} className="solid-card p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-wider">{sample.group}</span>
                  <Trophy className="w-4 h-4 text-[#D3D1CE]" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#D3D1CE]">{sample.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-black text-[#D3D1CE]">{sample.weight} kg</span>
                  <span className="text-xs text-[#B3B7BA]">× {sample.reps} reps</span>
                </div>
                <span className="text-[10px] text-[#B3B7BA] font-mono mt-2 block">Sampel PR</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Progress Photos & Body Metrics Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-heading font-bold text-[#D3D1CE] flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#D3D1CE]" />
          Galeri Foto Progres Fisik & Catatan Berat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bodyLogs.filter(b => b.photo_url).map(b => (
            <div key={b.id} className="solid-card p-3 space-y-2">
              <img src={b.photo_url} alt="Body Progress" className="w-full h-48 rounded-sm object-cover bg-[#090F15]" />
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#B3B7BA]">{b.date}</span>
                <span className="font-bold text-[#D3D1CE]">{b.weight_kg} kg</span>
              </div>
            </div>
          ))}

          {bodyLogs.filter(b => b.photo_url).length === 0 && (
            <div className="col-span-full solid-card p-8 text-center text-[#B3B7BA] font-mono text-xs">
              Belum ada foto progres fisik terlampir. Upload foto pertama kamu di menu Dashboard!
            </div>
          )}
        </div>
      </div>

      {/* Chronological Workout History Logs */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-heading font-bold text-[#D3D1CE] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D3D1CE]" />
          Riwayat Latihan Gym Kronologis
        </h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="solid-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <span className="text-xs text-[#B3B7BA] font-mono block">{log.date} {log.time_logged ? `• ${log.time_logged}` : ''}</span>
                  <h3 className="text-base font-heading font-bold text-[#D3D1CE]">{log.title}</h3>
                  {log.notes && <p className="text-xs text-[#B3B7BA] italic mt-1">"{log.notes}"</p>}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#B3B7BA]">
                    <Clock className="w-3.5 h-3.5" /> {log.duration_minutes}m
                  </span>
                  <span className="flex items-center gap-1 text-[#D3D1CE] font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D3D1CE]" /> {log.total_volume_kg} kg
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#090F15] text-[#D3D1CE] font-bold">
                    {log.feeling_rating}★
                  </span>
                </div>
              </div>

              {/* Set details breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#B3B7BA] block">
                  Ringkasan Angkatan ({log.sets.length} Set Completed)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {log.sets.map((setObj, sIdx) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === setObj.exercise_id);
                    return (
                      <div key={sIdx} className="flex items-center justify-between text-xs py-2 px-3 rounded-sm bg-[#090F15]">
                        <div>
                          <span className="font-bold text-[#D3D1CE] block truncate max-w-[140px]">
                            {ex?.name || setObj.exercise_id}
                          </span>
                          {setObj.notes && <span className="text-[10px] text-[#B3B7BA] block">{setObj.notes}</span>}
                        </div>
                        <span className="font-mono text-[#D3D1CE] font-bold">
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
            <div className="solid-card p-8 text-center text-[#B3B7BA] font-mono text-xs space-y-2">
              <Dumbbell className="w-6 h-6 text-[#6C6D74] mx-auto" />
              <p>Belum ada riwayat latihan. Mulai latihan pertama kamu di menu <strong>Catat Sesi</strong>!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
