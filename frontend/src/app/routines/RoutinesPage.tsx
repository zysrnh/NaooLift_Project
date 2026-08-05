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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
            NAOOLIFT / WEEKLY SCHEDULER
          </span>
          <h1 className="text-3xl font-heading font-black text-[#D3D1CE]">
            JADWAL SPLIT LATIHAN MINGGUAN
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="solid-btn-primary px-6 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Split Latihan Baru
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="solid-card p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-sm bg-[#090F15] text-[#B3B7BA] text-[10px] font-mono uppercase">
                    {routine.day_of_week}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-sm bg-[#090F15] text-[#D3D1CE] text-[10px] font-mono uppercase font-bold">
                    {routine.time_of_day || 'Pagi'}
                  </span>
                </div>

                <button
                  onClick={() => openEditModal(routine)}
                  className="p-1.5 rounded-sm text-[#B3B7BA] hover:text-[#D3D1CE] hover:bg-[#090F15]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-[#D3D1CE]">{routine.title}</h3>
                <p className="text-xs text-[#B3B7BA] mt-1 line-clamp-2">{routine.description}</p>
              </div>

              {/* Exercise List Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-[#B3B7BA] block">
                  Daftar Gerakan ({routine.exercises.length})
                </span>
                <div className="space-y-1">
                  {routine.exercises.map((item) => {
                    const ex = DEFAULT_EXERCISES.find(e => e.id === item.exercise_id);
                    return (
                      <div
                        key={item.exercise_id}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-sm bg-[#090F15]"
                      >
                        <span className="font-medium text-[#D3D1CE] truncate max-w-[160px]">
                          {ex ? ex.name : item.exercise_id}
                        </span>
                        <span className="text-[#B3B7BA] font-mono text-[11px]">
                          {item.target_sets}s × {item.target_reps} ({item.target_weight_kg}kg)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSyncToGoogleCalendar(routine)}
                className="text-[11px] font-mono text-[#B3B7BA] hover:text-[#D3D1CE] flex items-center gap-1"
                title="Sync Schedule to Google Calendar"
              >
                <ExternalLink className="w-3 h-3" /> Sync GCal
              </button>

              <Link
                href={`/logger?routineId=${routine.id}`}
                className="solid-btn-primary px-4 py-2 text-xs flex items-center gap-1"
              >
                Start <Play className="w-3 h-3 fill-current" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
