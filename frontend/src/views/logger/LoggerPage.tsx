'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayCircle, CheckCircle2, Dumbbell, Trophy, Award, Plus, Trash2, MessageSquare } from 'lucide-react';
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
  const [sessionNotes, setSessionNotes] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
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

    const initialSetsMap: Record<string, WorkoutSet[]> = {};
    routine.exercises.forEach(item => {
      const sets: WorkoutSet[] = [];
      for (let i = 1; i <= item.target_sets; i++) {
        sets.push({
          exercise_id: item.exercise_id,
          set_number: i,
          weight_kg: item.target_weight_kg,
          reps: 10,
          notes: '',
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
      const lastSet = exSets.length > 0 ? exSets[exSets.length - 1] : { weight_kg: 50, reps: 10, notes: '' };
      const newSet: WorkoutSet = {
        exercise_id: exerciseId,
        set_number: exSets.length + 1,
        weight_kg: lastSet.weight_kg,
        reps: lastSet.reps,
        notes: '',
      };
      return { ...prev, [exerciseId]: [...exSets, newSet] };
    });
  };

  const toggleSetComplete = (exerciseId: string, setIdx: number) => {
    const key = `${exerciseId}-${setIdx}`;
    const isNowDone = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: isNowDone }));

    if (isNowDone) {
      const setObj = activeSets[exerciseId]?.[setIdx];
      if (setObj && setObj.weight_kg >= 80) {
        setObj.is_pr = true;
        setPrTriggered(`${DEFAULT_EXERCISES.find(e => e.id === exerciseId)?.name || 'Gerakan'} (${setObj.weight_kg}${weightUnit})`);
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
      time_logged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration_minutes: durationMins,
      total_volume_kg: calculateTotalVolume(),
      notes: sessionNotes,
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#D3D1CE] text-[#090F15] px-6 py-3 rounded-sm font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Trophy className="w-4 h-4 fill-current text-[#090F15]" />
          REKOR PR BARU TERPECAHKAN: {prTriggered}!
        </div>
      )}

      {/* Header & Routine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
            NAOOLIFT / LIVE WORKOUT LOGGER
          </span>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            CATAT SESI GYM LIVE
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Weight Unit Switcher */}
          <div className="flex bg-[#090F15] p-0.5 rounded-sm text-xs font-mono">
            <button
              onClick={() => setWeightUnit('kg')}
              className={`px-3 py-1 rounded-sm transition-colors ${weightUnit === 'kg' ? 'bg-[#D3D1CE] text-[#090F15] font-bold' : 'text-[#B3B7BA]'}`}
            >
              KG
            </button>
            <button
              onClick={() => setWeightUnit('lbs')}
              className={`px-3 py-1 rounded-sm transition-colors ${weightUnit === 'lbs' ? 'bg-[#D3D1CE] text-[#090F15] font-bold' : 'text-[#B3B7BA]'}`}
            >
              LBS
            </button>
          </div>

          <select
            value={selectedRoutine?.id || ''}
            onChange={(e) => {
              const r = routines.find(item => item.id === e.target.value);
              if (r) selectRoutine(r);
            }}
            className="solid-input px-3 py-2 text-xs font-mono"
          >
            {routines.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>

          <button
            onClick={handleFinishWorkout}
            className="solid-btn-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
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
              <div key={item.exercise_id} className="solid-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-wider block">
                      {ex?.muscle_group} • {ex?.category_type} • {ex?.equipment}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-[#D3D1CE]">{ex?.name || item.exercise_id}</h3>
                  </div>

                  <span className="text-xs text-[#B3B7BA] font-mono">
                    Target: {item.target_sets}s × {item.target_reps} ({item.target_weight_kg}{weightUnit})
                  </span>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono uppercase text-[#B3B7BA] px-2">
                    <span className="col-span-2">SET</span>
                    <span className="col-span-3">BEBAN ({weightUnit.toUpperCase()})</span>
                    <span className="col-span-3">REPS</span>
                    <span className="col-span-3">CATATAN SET</span>
                    <span className="col-span-1 text-right">LOG</span>
                  </div>

                  {sets.map((setObj, setIdx) => {
                    const isDone = completedSets[`${item.exercise_id}-${setIdx}`];
                    return (
                      <div
                        key={setIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-sm transition-all ${
                          isDone
                            ? 'bg-[#090F15] text-[#D3D1CE]'
                            : 'bg-[#090F15]'
                        }`}
                      >
                        <span className="col-span-2 text-xs font-mono font-bold text-[#D3D1CE]">
                          #{setIdx + 1}
                        </span>

                        <div className="col-span-3">
                          <input
                            type="number"
                            value={setObj.weight_kg}
                            onChange={(e) => updateSetParam(item.exercise_id, setIdx, 'weight_kg', Number(e.target.value))}
                            className="solid-input w-full px-2 py-1 text-xs font-mono font-bold"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="number"
                            value={setObj.reps}
                            onChange={(e) => updateSetParam(item.exercise_id, setIdx, 'reps', Number(e.target.value))}
                            className="solid-input w-full px-2 py-1 text-xs font-mono font-bold"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="RPE 8"
                            value={setObj.notes || ''}
                            onChange={(e) => updateSetParam(item.exercise_id, setIdx, 'notes', e.target.value)}
                            className="solid-input w-full px-2 py-1 text-[11px]"
                          />
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => toggleSetComplete(item.exercise_id, setIdx)}
                            className={`p-1.5 rounded-sm transition-all ${
                              isDone
                                ? 'bg-[#D3D1CE] text-[#090F15] font-bold'
                                : 'bg-[#262E36] text-[#B3B7BA] hover:text-[#D3D1CE]'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => addSetToExercise(item.exercise_id)}
                  className="w-full py-2 rounded-sm bg-[#090F15] text-[#B3B7BA] hover:text-[#D3D1CE] text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Set
                </button>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Rest Timer & Session Notes */}
        <div className="space-y-6">
          <RestTimer initialSeconds={90} />

          {/* Session Summary & Notes */}
          <div className="solid-card p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#D3D1CE] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D3D1CE]" /> Catatan Sesi Latihan
            </h3>

            <div>
              <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block mb-1">
                Catatan Sesi (Notes)
              </label>
              <textarea
                placeholder="Catatan progres, evaluasi form angkatan..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="solid-input w-full px-3 py-2 text-xs min-h-[90px]"
              />
            </div>

            <div className="space-y-2 py-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#B3B7BA]">Total Volume Live:</span>
                <span className="font-black text-[#D3D1CE]">{calculateTotalVolume()} {weightUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B3B7BA]">Set Selesai:</span>
                <span className="font-bold text-[#D3D1CE]">
                  {Object.values(completedSets).filter(Boolean).length} Sets
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block mb-1">Perasaan / Mood Latihan</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeelingRating(star)}
                    className={`flex-1 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors ${
                      feelingRating === star
                        ? 'bg-[#D3D1CE] text-[#090F15]'
                        : 'bg-[#090F15] text-[#B3B7BA]'
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="w-full solid-btn-primary py-3 text-xs uppercase tracking-wider"
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
    <Suspense fallback={<div className="text-center py-20 text-[#B3B7BA] font-mono">Memuat Active Logger...</div>}>
      <LoggerContent />
    </Suspense>
  );
}
