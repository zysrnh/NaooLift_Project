'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayCircle, CheckCircle2, Dumbbell, Trophy, Award, Plus, Trash2, MessageSquare } from 'lucide-react';
import RestTimer from '@/components/RestTimer';
import { getRoutines, saveWorkoutLog, DEFAULT_EXERCISES, Routine, WorkoutLog, WorkoutSet } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import confetti from 'canvas-confetti';

function LoggerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routineId = searchParams.get('routineId');

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  // Active workout session state
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [activeSets, setActiveSets] = useState<Record<string, WorkoutSet[]>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [prTriggered, setPrTriggered] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [feelingRating, setFeelingRating] = useState<number>(5);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push('/login');
      return;
    }
    const list = getRoutines();
    setRoutines(list);

    if (routineId) {
      const found = list.find(r => r.id === routineId);
      if (found) {
        setSelectedRoutine(found);
        setWorkoutTitle(found.title);
        // Initialize sets
        const initSets: Record<string, WorkoutSet[]> = {};
        found.exercises.forEach(ex => {
          const setsArr: WorkoutSet[] = [];
          for (let i = 1; i <= ex.target_sets; i++) {
            setsArr.push({
              set_number: i,
              weight_kg: 20,
              reps: ex.target_reps,
              completed: false,
              exercise_id: ex.exercise_id,
            });
          }
          initSets[ex.exercise_id] = setsArr;
        });
        setActiveSets(initSets);
      }
    }
  }, [routineId, router]);

  const toggleSetComplete = (exId: string, setIndex: number) => {
    const key = `${exId}-${setIndex}`;
    const newStatus = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: newStatus }));

    if (newStatus) {
      // Trigger confetti celebration on PR or set completed
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const updateSetData = (exId: string, setIndex: number, field: 'weight_kg' | 'reps' | 'notes', val: any) => {
    setActiveSets(prev => {
      const current = prev[exId] ? [...prev[exId]] : [];
      if (current[setIndex]) {
        current[setIndex] = { ...current[setIndex], [field]: val };
      }
      return { ...prev, [exId]: current };
    });
  };

  const addSetToExercise = (exId: string) => {
    setActiveSets(prev => {
      const current = prev[exId] ? [...prev[exId]] : [];
      const newSetNum = current.length + 1;
      return {
        ...prev,
        [exId]: [
          ...current,
          {
            set_number: newSetNum,
            weight_kg: current.length > 0 ? current[current.length - 1].weight_kg : 20,
            reps: current.length > 0 ? current[current.length - 1].reps : 10,
            completed: false,
            exercise_id: exId,
          }
        ]
      };
    });
  };

  const finishWorkoutSession = () => {
    // Calculate total volume
    let totalVol = 0;
    const allLoggedSets: WorkoutSet[] = [];

    Object.entries(activeSets).forEach(([exId, setsArr]) => {
      setsArr.forEach((s, idx) => {
        const key = `${exId}-${idx}`;
        if (completedSets[key]) {
          const weightInKg = weightUnit === 'lbs' ? Math.round(s.weight_kg * 0.453592) : s.weight_kg;
          totalVol += weightInKg * s.reps;
          allLoggedSets.push({
            ...s,
            weight_kg: weightInKg,
            completed: true,
          });
        }
      });
    });

    const durationMins = Math.max(1, Math.round((Date.now() - startTime) / 60000));

    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      routine_id: selectedRoutine ? selectedRoutine.id : 'custom',
      routine_title: workoutTitle || 'Sesi Latihan Custom',
      date: new Date().toISOString(),
      duration_minutes: durationMins,
      total_volume_kg: totalVol,
      sets: allLoggedSets,
      notes: sessionNotes,
    };

    saveWorkoutLog(newLog);

    // Big celebration confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    router.push('/history');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="solid-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest">
            REALTIME WORKOUT TRACKER & TIMER
          </div>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            CATAT SESI GYM LIVE
          </h1>
          <p className="text-xs text-[#B3B7BA]">
            Input beban, repetisi, tombol completed per set & hitung jeda istirahat dengan Rest Timer chime.
          </p>
        </div>

        {/* Unit Switcher kg/lbs */}
        <div className="bg-[#090F15] p-1.5 rounded-sm border border-[#262E36] flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setWeightUnit('kg')}
            className={`px-3 py-1.5 rounded-sm font-bold transition-colors ${weightUnit === 'kg' ? 'bg-[#D3D1CE] text-[#090F15]' : 'text-[#B3B7BA]'}`}
          >
            KG
          </button>
          <button
            onClick={() => setWeightUnit('lbs')}
            className={`px-3 py-1.5 rounded-sm font-bold transition-colors ${weightUnit === 'lbs' ? 'bg-[#D3D1CE] text-[#090F15]' : 'text-[#B3B7BA]'}`}
          >
            LBS
          </button>
        </div>
      </div>

      {/* Rest Timer Widget */}
      <RestTimer defaultDuration={90} />

      {/* Routine Selector if not selected */}
      {!selectedRoutine && (
        <div className="solid-card p-6 space-y-4">
          <h3 className="text-sm font-heading font-bold text-[#D3D1CE] uppercase tracking-wider">
            PILIH ROUTINE UNTUK MULAI SESI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {routines.map(r => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRoutine(r);
                  setWorkoutTitle(r.title);
                  const initSets: Record<string, WorkoutSet[]> = {};
                  r.exercises.forEach(ex => {
                    initSets[ex.exercise_id] = [
                      { set_number: 1, weight_kg: 20, reps: ex.target_reps, completed: false, exercise_id: ex.exercise_id },
                      { set_number: 2, weight_kg: 20, reps: ex.target_reps, completed: false, exercise_id: ex.exercise_id },
                      { set_number: 3, weight_kg: 20, reps: ex.target_reps, completed: false, exercise_id: ex.exercise_id },
                    ];
                  });
                  setActiveSets(initSets);
                }}
                className="bg-[#090F15] p-4 rounded-sm border border-[#262E36] hover:border-[#D3D1CE] cursor-pointer transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#D3D1CE]">{r.title}</div>
                <div className="text-[10px] font-mono text-[#B3B7BA]">{r.day_of_week} • {r.exercises.length} Gerakan</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Workout Session Logs */}
      {selectedRoutine && (
        <div className="space-y-6">
          <div className="solid-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#B3B7BA] uppercase">SESI AKTIF</span>
              <input
                type="text"
                value={workoutTitle}
                onChange={e => setWorkoutTitle(e.target.value)}
                className="solid-input px-3 py-1.5 text-sm font-heading font-bold text-[#D3D1CE] w-72"
              />
            </div>
          </div>

          {/* Exercises Set Inputs */}
          {selectedRoutine.exercises.map(ex => {
            const setsList = activeSets[ex.exercise_id] || [];
            return (
              <div key={ex.exercise_id} className="solid-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#262E36]">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#D3D1CE]">{ex.name}</h3>
                    <span className="text-[10px] font-mono text-[#B3B7BA]">Target: {ex.target_sets} Set × {ex.target_reps} Reps</span>
                  </div>
                  <button
                    onClick={() => addSetToExercise(ex.exercise_id)}
                    className="text-xs font-mono text-[#D3D1CE] border border-[#262E36] px-2.5 py-1 rounded-sm hover:bg-[#262E36] flex items-center gap-1"
                  >
                    + Tambah Set
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-[#B3B7BA] uppercase px-2">
                    <span className="col-span-2">SET</span>
                    <span className="col-span-4">BEBAN ({weightUnit.toUpperCase()})</span>
                    <span className="col-span-4">REPETISI</span>
                    <span className="col-span-2 text-center">DONE</span>
                  </div>

                  {setsList.map((s, idx) => {
                    const isDone = completedSets[`${ex.exercise_id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-sm transition-colors ${isDone ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-[#090F15]'}`}
                      >
                        <span className="col-span-2 text-xs font-mono font-bold text-[#D3D1CE] pl-2">
                          #{s.set_number}
                        </span>

                        <div className="col-span-4">
                          <input
                            type="number"
                            value={s.weight_kg}
                            onChange={e => updateSetData(ex.exercise_id, idx, 'weight_kg', parseFloat(e.target.value) || 0)}
                            className="solid-input w-full px-3 py-1.5 text-xs font-mono"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="number"
                            value={s.reps}
                            onChange={e => updateSetData(ex.exercise_id, idx, 'reps', parseInt(e.target.value) || 0)}
                            className="solid-input w-full px-3 py-1.5 text-xs font-mono"
                          />
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleSetComplete(ex.exercise_id, idx)}
                            className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 text-white' : 'bg-[#262E36] text-[#B3B7BA] hover:text-[#D3D1CE]'}`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Session Notes & Finish Button */}
          <div className="solid-card p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">CATATAN KHUSUS SESI LATIHAN</label>
              <textarea
                placeholder="Pompa bicep maksimal, form squat bersih, tidak ada nyeri sendi..."
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                className="solid-input w-full px-4 py-2.5 text-xs h-20"
              />
            </div>

            <button
              onClick={finishWorkoutSession}
              className="w-full solid-btn-primary py-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              <Trophy className="w-5 h-5" /> Selesaikan & Simpan Sesi Gym
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoggerPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs font-mono text-[#B3B7BA]">MEMUAT TRACKER LOG LIVE...</div>}>
      <LoggerContent />
    </Suspense>
  );
}
