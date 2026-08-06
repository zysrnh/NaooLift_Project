'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Dumbbell, Trash2, Edit3, Play, X, Search, Check, ExternalLink } from 'lucide-react';
import { getRoutines, saveRoutine, DEFAULT_EXERCISES, Routine, RoutineExercise, Exercise } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export default function RoutinesPage() {
  const router = useRouter();
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
    if (!getCurrentUser()) {
      router.push('/login');
      return;
    }
    setRoutines(getRoutines());
  }, [router]);

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
    setEditingRoutine(routine);
    setTitle(routine.title);
    setDayOfWeek(routine.day_of_week);
    setTimeOfDay(routine.time_of_day || 'Pagi');
    setDescription(routine.description || '');
    setSelectedExercises(routine.exercises || []);
    setIsCreating(true);
  };

  const addExerciseToRoutine = (ex: Exercise) => {
    if (!selectedExercises.find(e => e.exercise_id === ex.id)) {
      setSelectedExercises(prev => [
        ...prev,
        {
          exercise_id: ex.id,
          name: ex.name,
          target_sets: 3,
          target_reps: 10,
        }
      ]);
    }
  };

  const removeExerciseFromRoutine = (exId: string) => {
    setSelectedExercises(prev => prev.filter(e => e.exercise_id !== exId));
  };

  const updateExerciseSetsReps = (exId: string, sets: number, reps: number) => {
    setSelectedExercises(prev =>
      prev.map(e => (e.exercise_id === exId ? { ...e, target_sets: sets, target_reps: reps } : e))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRoutine: Routine = {
      id: editingRoutine ? editingRoutine.id : `routine-${Date.now()}`,
      title,
      day_of_week: dayOfWeek,
      time_of_day: timeOfDay,
      description,
      exercises: selectedExercises,
    };

    saveRoutine(newRoutine);
    setRoutines(getRoutines());
    setIsCreating(false);
  };

  const filteredExercises = DEFAULT_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ex.muscle_group === selectedCategory;
    const matchesType = selectedType === 'All' || ex.equipment === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 solid-card p-8">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest">
            WEEKLY SCHEDULER MATRIX
          </div>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            JADWAL SPLIT LATIHAN
          </h1>
          <p className="text-xs text-[#B3B7BA]">
            Kelola rutinitas latihan harian kamu (Pagi, Siang, Sore) & sync ke Google Calendar.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="solid-btn-primary px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Split Baru
        </button>
      </div>

      {/* Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <div key={routine.id} className="solid-card p-6 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-sm bg-[#090F15] text-[10px] font-mono font-bold text-[#D3D1CE] border border-[#262E36]">
                  {routine.day_of_week.toUpperCase()} • {routine.time_of_day?.toUpperCase() || 'PAGI'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(routine)}
                    className="text-[#B3B7BA] hover:text-[#D3D1CE] text-xs p-1"
                    title="Edit Split"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-heading font-bold text-[#D3D1CE]">
                  {routine.title}
                </h3>
                {routine.description && (
                  <p className="text-xs text-[#B3B7BA] mt-1 line-clamp-2 leading-relaxed">
                    {routine.description}
                  </p>
                )}
              </div>

              {/* Exercises List */}
              <div className="space-y-2 pt-2 border-t border-[#262E36]/40">
                <div className="text-[10px] font-mono text-[#B3B7BA] uppercase">
                  GERAKAN TERJADWAL ({routine.exercises?.length || 0})
                </div>
                
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {routine.exercises?.map((ex, idx) => (
                    <div key={idx} className="bg-[#090F15] p-2 rounded-sm flex items-center justify-between text-xs font-mono">
                      <span className="text-[#D3D1CE] font-bold truncate max-w-[180px]">{ex.name}</span>
                      <span className="text-[#B3B7BA] text-[10px]">{ex.target_sets} Set × {ex.target_reps} Reps</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#262E36]/40 flex items-center gap-2">
              <Link
                href={`/logger?routineId=${routine.id}`}
                className="flex-1 solid-btn-primary py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Mulai Sesi
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Split Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-[#090F15]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="solid-card w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262E36]">
              <h2 className="text-xl font-heading font-bold text-[#D3D1CE]">
                {editingRoutine ? 'EDIT SPLIT LATIHAN' : 'BUAT SPLIT LATIHAN BARU'}
              </h2>
              <button onClick={() => setIsCreating(false)} className="text-[#B3B7BA] hover:text-[#D3D1CE]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">NAMA SPLIT LATIHAN</label>
                <input
                  type="text"
                  placeholder="Contoh: Senin Pagi - Chest & Triceps"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="solid-input w-full px-4 py-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">HARI LATIHAN</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value)}
                    className="solid-input w-full px-4 py-2.5 text-xs"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                      <option key={day} value={day} className="bg-[#090F15] text-[#D3D1CE]">{day}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">WAKTU SESI</label>
                  <select
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value as any)}
                    className="solid-input w-full px-4 py-2.5 text-xs"
                  >
                    {['Pagi', 'Siang', 'Sore', 'Malam'].map(time => (
                      <option key={time} value={time} className="bg-[#090F15] text-[#D3D1CE]">{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">DESKRIPSI / CATATAN (OPSIONAL)</label>
                <textarea
                  placeholder="Fokus progressive overload, jeda istirahat 90 detik..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="solid-input w-full px-4 py-2.5 text-xs h-20"
                />
              </div>

              {/* Selected Exercises Section */}
              <div className="space-y-3 pt-4 border-t border-[#262E36]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-[#D3D1CE] uppercase">GERAKAN DILATIH</span>
                  <button
                    type="button"
                    onClick={() => setShowExercisePicker(true)}
                    className="text-xs font-mono text-[#D3D1CE] border border-[#262E36] px-3 py-1 rounded-sm hover:bg-[#262E36] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Pilih Gerakan
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedExercises.map(ex => (
                    <div key={ex.exercise_id} className="bg-[#090F15] p-3 rounded-sm flex items-center justify-between gap-4">
                      <span className="text-xs font-mono font-bold text-[#D3D1CE] flex-1">{ex.name}</span>
                      
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <input
                          type="number"
                          value={ex.target_sets}
                          onChange={e => updateExerciseSetsReps(ex.exercise_id, parseInt(e.target.value) || 1, ex.target_reps)}
                          className="w-12 bg-[#262E36] text-[#D3D1CE] px-2 py-1 rounded-sm text-center"
                          min="1"
                        />
                        <span className="text-[#B3B7BA]">Set ×</span>
                        <input
                          type="number"
                          value={ex.target_reps}
                          onChange={e => updateExerciseSetsReps(ex.exercise_id, ex.target_sets, parseInt(e.target.value) || 1)}
                          className="w-12 bg-[#262E36] text-[#D3D1CE] px-2 py-1 rounded-sm text-center"
                          min="1"
                        />
                        <span className="text-[#B3B7BA]">Reps</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExerciseFromRoutine(ex.exercise_id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262E36]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="solid-btn-secondary px-6 py-2.5 text-xs uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="solid-btn-primary px-8 py-2.5 text-xs uppercase"
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
        <div className="fixed inset-0 z-50 bg-[#090F15]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="solid-card w-full max-w-xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#262E36]">
              <h3 className="text-lg font-heading font-bold text-[#D3D1CE]">KATALOG GERAKAN GYM</h3>
              <button onClick={() => setShowExercisePicker(false)} className="text-[#B3B7BA] hover:text-[#D3D1CE]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari gerakan, otot, atau peralatan..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="solid-input w-full pl-9 pr-4 py-2 text-xs"
              />
            </div>

            {/* Filter Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-mono">
              {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-sm border ${selectedCategory === cat ? 'bg-[#D3D1CE] text-[#090F15] font-bold border-[#D3D1CE]' : 'border-[#262E36] text-[#B3B7BA]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map(ex => {
                const isSelected = selectedExercises.some(e => e.exercise_id === ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => addExerciseToRoutine(ex)}
                    className={`p-3 rounded-sm border cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-[#262E36] border-[#D3D1CE]' : 'bg-[#090F15] border-[#262E36] hover:border-[#B3B7BA]'}`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-[#D3D1CE]">{ex.name}</div>
                      <div className="text-[10px] font-mono text-[#B3B7BA]">{ex.muscle_group} • {ex.equipment}</div>
                    </div>

                    {isSelected ? (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Terpilih</span>
                    ) : (
                      <span className="text-xs font-mono text-[#B3B7BA]">+ Tambah</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#262E36] text-right">
              <button
                onClick={() => setShowExercisePicker(false)}
                className="solid-btn-primary px-6 py-2 text-xs uppercase"
              >
                Selesai Memilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
