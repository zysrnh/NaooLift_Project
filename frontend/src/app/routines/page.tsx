'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Dumbbell, Trash2, Edit3, Play, Save, X, Search, Check } from 'lucide-react';
import { getRoutines, saveRoutine, DEFAULT_EXERCISES, Routine, RoutineExercise, Exercise } from '@/lib/api';
import Link from 'next/link';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  
  // Exercise Picker Search & Filter
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDayOfWeek('Senin / Kamis');
    setDescription('');
    setSelectedExercises([]);
    setEditingRoutine(null);
    setIsCreating(true);
  };

  const openEditModal = (routine: Routine) => {
    setTitle(routine.title);
    setDayOfWeek(routine.day_of_week);
    setDescription(routine.description);
    setSelectedExercises(routine.exercises || []);
    setEditingRoutine(routine);
    setIsCreating(true);
  };

  const addExerciseToRoutine = (ex: Exercise) => {
    if (selectedExercises.some(item => item.exercise_id === ex.id)) return;
    const newEx: RoutineExercise = {
      exercise_id: ex.id,
      target_sets: 4,
      target_reps: '10-12',
      target_weight_kg: 50,
      rest_seconds: 90,
    };
    setSelectedExercises([...selectedExercises, newEx]);
    setShowExercisePicker(false);
  };

  const removeExerciseFromRoutine = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(item => item.exercise_id !== exerciseId));
  };

  const updateExerciseParam = (exerciseId: string, field: keyof RoutineExercise, value: any) => {
    setSelectedExercises(selectedExercises.map(item => {
      if (item.exercise_id === exerciseId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRoutine: Routine = {
      id: editingRoutine ? editingRoutine.id : `rot-${Date.now()}`,
      title,
      day_of_week: dayOfWeek,
      description,
      exercises: selectedExercises,
    };

    const updated = saveRoutine(newRoutine);
    setRoutines(updated);
    setIsCreating(false);
  };

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const filteredExercises = DEFAULT_EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.muscle_group === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyan-400" />
            Jadwal Workout Split
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Atur dan kustomisasi program latihan gym kamu (Push/Pull/Legs, Upper/Lower, dll).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Buat Split Latihan Baru
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 bg-slate-900/40 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  {routine.day_of_week}
                </span>
                <button
                  onClick={() => openEditModal(routine)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{routine.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{routine.description}</p>
              </div>

              {/* Exercise List Preview */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Gerakan ({routine.exercises.length})
                </span>
                <div className="space-y-1.5">
                  {routine.exercises.map((item) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
                    return (
                      <div
                        key={item.exercise_id}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
                      >
                        <span className="font-medium text-slate-200 truncate max-w-[180px]">
                          {ex ? ex.name : item.exercise_id}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {item.target_sets} sets × {item.target_reps} ({item.target_weight_kg}kg)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Siap Latihan</span>
              <Link
                href={`/logger?routineId=${routine.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Workout
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Routine Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {editingRoutine ? 'Edit Split Latihan' : 'Buat Split Latihan Baru'}
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Nama Split / Routine
                </label>
                <input
                  type="text"
                  placeholder="misal: Push Day (Dada & Bahu)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Hari / Jadwal
                  </label>
                  <input
                    type="text"
                    placeholder="misal: Senin & Kamis"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    placeholder="Catatan fokus latihan"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Selected Exercises List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Daftar Gerakan ({selectedExercises.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExercisePicker(true)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Gerakan
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedExercises.map((item, idx) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
                    return (
                      <div
                        key={item.exercise_id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-cyan-300">
                            {idx + 1}. {ex?.name || item.exercise_id}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeExerciseFromRoutine(item.exercise_id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Sets</span>
                            <input
                              type="number"
                              value={item.target_sets}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_sets', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Reps Target</span>
                            <input
                              type="text"
                              value={item.target_reps}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_reps', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Beban (kg)</span>
                            <input
                              type="number"
                              value={item.target_weight_kg}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_weight_kg', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Istirahat (detik)</span>
                            <input
                              type="number"
                              value={item.rest_seconds}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'rest_seconds', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20"
                >
                  Simpan Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900 w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                Pilih Gerakan Latihan
              </h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari gerakan (Bench Press, Squat...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Exercises */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {filteredExercises.map((ex) => {
                const isSelected = selectedExercises.some(item => item.exercise_id === ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => !isSelected && addExerciseToRoutine(ex)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm text-white block">{ex.name}</span>
                      <span className="text-[11px] text-slate-400">{ex.muscle_group} • {ex.equipment}</span>
                    </div>

                    {isSelected ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Terpilih
                      </span>
                    ) : (
                      <button className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                        + Tambah
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
