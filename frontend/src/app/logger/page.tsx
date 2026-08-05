'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayCircle, CheckCircle2, Dumbbell, Trophy, ArrowRight, Award, Plus, Trash2 } from 'lucide-react';
import RestTimer from '@/components/RestTimer';
import { getRoutines, saveWorkoutLog, DEFAULT_EXERCISES, Routine, WorkoutLog, WorkoutSet } from '@/lib/api';
import confetti from 'canvas-confetti';

function LoggerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routineId = searchParams.get('routineId');

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  // Active workout session state
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [activeSets, setActiveSets] = useState<Record<string, WorkoutSet[]>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [prTriggered, setPrTriggered] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [feelingRating, setFeelingRating] = useState<number>(5);

  useEffect(() => {
    const list = getRoutines();
    setRoutines(list);

    if (routineId) {
      const found = list.find(r => r.id === routineId);
      if (found) selectRoutine(found);
    } else if (list.length > 0) {
      selectRoutine(list[0]);
    }
  }, [routineId]);

  const selectRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setWorkoutTitle(routine.title);

    // Initialize sets per exercise based on routine targets
    const initialSetsMap: Record<string, WorkoutSet[]> = {};
    routine.exercises.forEach(item => {
      const sets: WorkoutSet[] = [];
      for (let i = 1; i <= item.target_sets; i++) {
        sets.push({
          exercise_id: item.exercise_id,
          set_number: i,
          weight_kg: item.target_weight_kg,
          reps: 10,
        });
      }
      initialSetsMap[item.exercise_id] = sets;
    });

    setActiveSets(initialSetsMap);
    setCompletedSets({});
  };

  const updateSetParam = (exerciseId: string, setIdx: number, field: keyof WorkoutSet, value: any) => {
    setActiveSets(prev => {
      const exSets = [...(prev[exerciseId] || [])];
      exSets[setIdx] = { ...exSets[setIdx], [field]: value };
      return { ...prev, [exerciseId]: exSets };
    });
  };

  const addSetToExercise = (exerciseId: string) => {
    setActiveSets(prev => {
      const exSets = prev[exerciseId] || [];
      const lastSet = exSets.length > 0 ? exSets[exSets.length - 1] : { weight_kg: 50, reps: 10 };
      const newSet: WorkoutSet = {
        exercise_id: exerciseId,
        set_number: exSets.length + 1,
        weight_kg: lastSet.weight_kg,
        reps: lastSet.reps,
      };
      return { ...prev, [exerciseId]: [...exSets, newSet] };
    });
  };

  const toggleSetComplete = (exerciseId: string, setIdx: number) => {
    const key = `${exerciseId}-${setIdx}`;
    const isNowDone = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: isNowDone }));

    // Check for PR trigger (e.g. if weight >= 80kg)
    if (isNowDone) {
      const setObj = activeSets[exerciseId]?.[setIdx];
      if (setObj && setObj.weight_kg >= 80) {
        setObj.is_pr = true;
        setPrTriggered(`${DEFAULT_EXERCISES.find(e => e.id === exerciseId)?.name || 'Gerakan'} (${setObj.weight_kg}kg)`);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setPrTriggered(null), 3500);
      }
    }
  };

  const calculateTotalVolume = () => {
    let total = 0;
    Object.keys(activeSets).forEach(exId => {
      activeSets[exId].forEach((setObj, setIdx) => {
        if (completedSets[`${exId}-${setIdx}`]) {
          total += (setObj.weight_kg || 0) * (setObj.reps || 0);
        }
      });
    });
    return total;
  };

  const handleFinishWorkout = () => {
    if (!selectedRoutine) return;

    const durationMins = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    const allSets: WorkoutSet[] = [];
    Object.keys(activeSets).forEach(exId => {
      activeSets[exId].forEach((setObj, setIdx) => {
        if (completedSets[`${exId}-${setIdx}`]) {
          allSets.push(setObj);
        }
      });
    });

    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      routine_id: selectedRoutine.id,
      title: workoutTitle,
      date: new Date().toISOString().split('T')[0],
      duration_minutes: durationMins,
      total_volume_kg: calculateTotalVolume(),
      feeling_rating: feelingRating,
      sets: allSets,
    };

    saveWorkoutLog(newLog);
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    router.push('/history');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* PR Celebration Alert */}
      {prTriggered && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-card bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Trophy className="w-5 h-5 fill-slate-950" />
          REKOR PR BARU TERPECAHKAN: {prTriggered}!
        </div>
      )}

      {/* Header & Routine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <PlayCircle className="w-3.5 h-3.5" /> Live Gym Session
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Catat Sesi Gym Live 🏋️‍♂️
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRoutine?.id || ''}
            onChange={(e) => {
              const r = routines.find(item => item.id === e.target.value);
              if (r) selectRoutine(r);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-500"
          >
            {routines.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>

          <button
            onClick={handleFinishWorkout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" /> Selesai Latihan
          </button>
        </div>
      </div>

      {/* Main Grid: Exercises & Rest Timer Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Exercises & Set Logger */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRoutine?.exercises.map((item) => {
            const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
            const sets = activeSets[item.exercise_id] || [];

            return (
              <div
                key={item.exercise_id}
                className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/40 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                      {ex?.muscle_group} • {ex?.equipment}
                    </span>
                    <h3 className="text-xl font-bold text-white">{ex?.name || item.exercise_id}</h3>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Target: {item.target_sets} sets × {item.target_reps} ({item.target_weight_kg}kg)
                  </span>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
                    <span className="col-span-2">SET</span>
                    <span className="col-span-4">BEBAN (KG)</span>
                    <span className="col-span-4">REPS</span>
                    <span className="col-span-2 text-right">LOG</span>
                  </div>

                  {sets.map((setObj, setIdx) => {
                    const isDone = completedSets[`${item.exercise_id}-${setIdx}`];
                    return (
                      <div
                        key={setIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-slate-950 border-slate-800/80'
                        }`}
                      >
                        <span className="col-span-2 text-xs font-mono font-bold text-slate-300">
                          #{setIdx + 1}
                        </span>

                        <div className="col-span-4">
                          <input
                            type="number"
                            value={setObj.weight_kg}
                            onChange={(e) => updateSetParam(item.exercise_id, setIdx, 'weight_kg', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="number"
                            value={setObj.reps}
                            onChange={(e) => updateSetParam(item.exercise_id, setIdx, 'reps', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={() => toggleSetComplete(item.exercise_id, setIdx)}
                            className={`p-2 rounded-xl transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => addSetToExercise(item.exercise_id)}
                  className="w-full py-2 rounded-xl bg-slate-950 border border-dashed border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Set Baru
                </button>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Rest Timer & Session Summary */}
        <div className="space-y-6">
          <RestTimer initialSeconds={90} />

          {/* Session Real-time Summary Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Ringkasan Sesi Live
            </h3>

            <div className="space-y-2 border-t border-b border-slate-800/80 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Volume Terangkat:</span>
                <span className="font-mono font-black text-cyan-300 text-sm">{calculateTotalVolume()} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Set Selesai:</span>
                <span className="font-mono font-bold text-white">
                  {Object.values(completedSets).filter(Boolean).length} Sets
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Kondisi / Mood Latihan Hari Ini:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeelingRating(star)}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      feelingRating === star
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
            >
              SIMPAN & SELESAIKAN LATIHAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoggerPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Memuat Logger Gym...</div>}>
      <LoggerContent />
    </Suspense>
  );
}
