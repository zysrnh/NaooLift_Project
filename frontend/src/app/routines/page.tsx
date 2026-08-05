'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Dumbbell, Trash2, Edit3, Play, X, Search, Check, ExternalLink } from 'lucide-react';
import { getRoutines, saveRoutine, DEFAULT_EXERCISES, Routine, RoutineExercise, Exercise } from '@/lib/api';
import Link from 'next/link';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Senin');
  const [timeOfDay, setTimeOfDay] = useState<'Pagi' | 'Siang' | 'Sore' | 'Malam'>('Pagi');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  
  // Exercise Picker Search & Filter
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDayOfWeek('Senin');
    setTimeOfDay('Pagi');
    setDescription('');
    setSelectedExercises([]);
    setEditingRoutine(null);
    setIsCreating(true);
  };

  const openEditModal = (routine: Routine) => {
    setTitle(routine.title);
    setDayOfWeek(routine.day_of_week);
    setTimeOfDay(routine.time_of_day || 'Pagi');
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
      time_of_day: timeOfDay,
      description,
      exercises: selectedExercises,
    };

    const updated = saveRoutine(newRoutine);
    setRoutines(updated);
    setIsCreating(false);
  };

  const handleSyncToGoogleCalendar = (routine: Routine) => {
    const text = encodeURIComponent(`NaooLift: ${routine.title}`);
    const details = encodeURIComponent(`Workout Routine: ${routine.description}\nTotal ${routine.exercises.length} gerakan.`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
    window.open(url, '_blank');
  };

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const types = ['All', 'Strength', 'Bodyweight', 'Cardio'];

  const filteredExercises = DEFAULT_EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.muscle_group === selectedCategory;
    const matchesType = selectedType === 'All' || ex.category_type === selectedType;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3A3A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F9F9F9] tracking-tight flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#F9F9F9]" />
            Jadwal Split Latihan Mingguan
          </h1>
          <p className="text-[#7D7D7D] text-xs sm:text-sm mt-1">
            Kelola pengelompokan latihan per hari & sesi waktu (Senin Pagi, Rabu Pagi, Jumat Sore).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F9F9F9] text-[#010101] font-extrabold text-xs hover:bg-white transition-transform active:scale-95 shadow-md"
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
            className="taste-card p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F0E0E] border border-[#3E3A3A] text-[#7D7D7D] text-[10px] font-mono uppercase">
                    {routine.day_of_week}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F0E0E] border border-[#3E3A3A] text-amber-500 text-[10px] font-mono uppercase font-bold">
                    {routine.time_of_day || 'Pagi'}
                  </span>
                </div>

                <button
                  onClick={() => openEditModal(routine)}
                  className="p-1.5 rounded-lg text-[#7D7D7D] hover:text-[#F9F9F9] hover:bg-[#0F0E0E]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F9F9F9]">{routine.title}</h3>
                <p className="text-xs text-[#7D7D7D] mt-1 line-clamp-2">{routine.description}</p>
              </div>

              {/* Exercise List Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-[#7D7D7D] block">
                  Daftar Gerakan ({routine.exercises.length})
                </span>
                <div className="space-y-1">
                  {routine.exercises.map((item) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
                    return (
                      <div
                        key={item.exercise_id}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#0F0E0E] border border-[#3E3A3A]"
                      >
                        <span className="font-medium text-[#F9F9F9] truncate max-w-[160px]">
                          {ex ? ex.name : item.exercise_id}
                        </span>
                        <span className="text-[#7D7D7D] font-mono text-[11px]">
                          {item.target_sets}s × {item.target_reps} ({item.target_weight_kg}kg)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3E3A3A] flex items-center justify-between gap-2">
              <button
                onClick={() => handleSyncToGoogleCalendar(routine)}
                className="text-[11px] font-mono text-[#7D7D7D] hover:text-[#F9F9F9] flex items-center gap-1"
                title="Sync Schedule to Google Calendar"
              >
                <ExternalLink className="w-3 h-3" /> Sync GCal
              </button>

              <Link
                href={`/logger?routineId=${routine.id}`}
                className="px-4 py-2 rounded-lg bg-[#F9F9F9] text-[#010101] font-bold text-xs hover:bg-white transition-transform active:scale-95 flex items-center gap-1"
              >
                Start <Play className="w-3 h-3 fill-current" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Routine Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010101]/90 backdrop-blur-md animate-fadeIn">
          <div className="taste-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#3E3A3A] pb-3">
              <h2 className="text-lg font-bold text-[#F9F9F9]">
                {editingRoutine ? 'Edit Split Latihan' : 'Buat Split Latihan Baru'}
              </h2>
              <button onClick={() => setIsCreating(false)} className="p-1.5 text-[#7D7D7D] hover:text-[#F9F9F9]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#7D7D7D] block mb-1">
                  Nama Split / Routine
                </label>
                <input
                  type="text"
                  placeholder="misal: Arm Day (Bicep & Tricep)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="taste-input w-full px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#7D7D7D] block mb-1">
                    Hari
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="taste-input w-full px-3 py-2 text-xs"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#7D7D7D] block mb-1">
                    Waktu / Sesi
                  </label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as any)}
                    className="taste-input w-full px-3 py-2 text-xs"
                  >
                    {['Pagi', 'Siang', 'Sore', 'Malam'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#7D7D7D] block mb-1">Keterangan Focus</label>
                <input
                  type="text"
                  placeholder="Catatan fokus gerakan"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="taste-input w-full px-3 py-2 text-xs"
                />
              </div>

              {/* Selected Exercises List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-[#7D7D7D]">
                    Gerakan Terpilih ({selectedExercises.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExercisePicker(true)}
                    className="text-xs font-bold text-[#F9F9F9] bg-[#0F0E0E] border border-[#3E3A3A] px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Gerakan
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedExercises.map((item, idx) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
                    return (
                      <div key={item.exercise_id} className="bg-[#0F0E0E] border border-[#3E3A3A] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#F9F9F9]">
                            {idx + 1}. {ex?.name || item.exercise_id}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeExerciseFromRoutine(item.exercise_id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
                          <div>
                            <span className="text-[#7D7D7D] block mb-1">Target Sets</span>
                            <input
                              type="number"
                              value={item.target_sets}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_sets', Number(e.target.value))}
                              className="taste-input w-full px-2 py-1"
                            />
                          </div>
                          <div>
                            <span className="text-[#7D7D7D] block mb-1">Target Reps</span>
                            <input
                              type="text"
                              value={item.target_reps}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_reps', e.target.value)}
                              className="taste-input w-full px-2 py-1"
                            />
                          </div>
                          <div>
                            <span className="text-[#7D7D7D] block mb-1">Beban (kg)</span>
                            <input
                              type="number"
                              value={item.target_weight_kg}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'target_weight_kg', Number(e.target.value))}
                              className="taste-input w-full px-2 py-1"
                            />
                          </div>
                          <div>
                            <span className="text-[#7D7D7D] block mb-1">Rest (detik)</span>
                            <input
                              type="number"
                              value={item.rest_seconds}
                              onChange={(e) => updateExerciseParam(item.exercise_id, 'rest_seconds', Number(e.target.value))}
                              className="taste-input w-full px-2 py-1"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#3E3A3A]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F0E0E] text-[#7D7D7D] border border-[#3E3A3A] text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#F9F9F9] text-[#010101] font-bold text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010101]/90 backdrop-blur-md animate-fadeIn">
          <div className="taste-card w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E3A3A] pb-3">
              <h3 className="text-base font-bold text-[#F9F9F9] flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#F9F9F9]" />
                Katalog Gerakan Latihan
              </h3>
              <button onClick={() => setShowExercisePicker(false)} className="p-1 text-[#7D7D7D] hover:text-[#F9F9F9]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7D7D7D] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari gerakan (Bench Press, Squat...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="taste-input w-full pl-9 pr-4 py-2 text-xs"
                />
              </div>

              {/* Muscle Group Filter */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#F9F9F9] text-[#010101] font-bold'
                        : 'bg-[#0F0E0E] text-[#7D7D7D] border border-[#3E3A3A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Category Type Filter (Strength, Bodyweight, Cardio) */}
              <div className="flex gap-1 border-t border-[#3E3A3A] pt-2">
                <span className="text-[10px] font-mono text-[#7D7D7D] self-center mr-1">Tipe:</span>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono ${
                      selectedType === type
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-[#0F0E0E] text-[#7D7D7D] border border-[#3E3A3A]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* List Exercises */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {filteredExercises.map((ex) => {
                const isSelected = selectedExercises.some(item => item.exercise_id === ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => !isSelected && addExerciseToRoutine(ex)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F0E0E] border-[#3E3A3A] opacity-40 cursor-not-allowed'
                        : 'bg-[#0F0E0E] border-[#3E3A3A] hover:border-[#7D7D7D]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#F9F9F9] block">{ex.name}</span>
                      <span className="text-[10px] text-[#7D7D7D] font-mono">
                        {ex.muscle_group} • {ex.category_type} • {ex.equipment}
                      </span>
                    </div>

                    {isSelected ? (
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terpilih
                      </span>
                    ) : (
                      <button className="px-2.5 py-1 rounded-md bg-[#1A1919] text-[#F9F9F9] border border-[#3E3A3A] text-xs font-semibold">
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
