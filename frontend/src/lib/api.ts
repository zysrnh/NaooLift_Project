export interface Exercise {
  id: string;
  name: string;
  muscle_group: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';
  category_type: 'Strength' | 'Bodyweight' | 'Cardio';
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight';
  instructions?: string;
}

export interface RoutineExercise {
  exercise_id: string;
  target_sets: number;
  target_reps: string;
  target_weight_kg: number;
  rest_seconds: number;
}

export interface Routine {
  id: string;
  title: string;
  day_of_week: string; // e.g. 'Senin', 'Rabu', 'Jumat'
  time_of_day?: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  description: string;
  exercises: RoutineExercise[];
}

export interface WorkoutSet {
  exercise_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe?: number;
  is_completed?: boolean;
  is_pr?: boolean;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  routine_id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time_logged?: string; // HH:MM
  duration_minutes: number;
  total_volume_kg: number;
  notes?: string;
  feeling_rating: number; // 1-5
  sets: WorkoutSet[];
}

export interface BodyLog {
  id: string;
  date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  photo_url?: string;
  notes?: string;
}

export interface UserRank {
  rank_name: string;
  tier_level: number;
  badge_color: string;
  bg_gradient: string;
  current_volume: number;
  min_volume: number;
  max_volume: number;
  progress_percent: number;
}

// ── Gym Rank Calculation ──────────────────────────────────────────────────────
export function calculateUserRank(totalVolumeKg: number): UserRank {
  if (totalVolumeKg >= 500000) {
    return {
      rank_name: 'Gym God / Naoo Legend',
      tier_level: 6,
      badge_color: '#8B5CF6',
      bg_gradient: 'from-purple-600 to-indigo-600',
      current_volume: totalVolumeKg,
      min_volume: 500000,
      max_volume: 1000000,
      progress_percent: 100,
    };
  } else if (totalVolumeKg >= 200000) {
    const min = 200000;
    const max = 500000;
    const pct = Math.min(100, Math.round(((totalVolumeKg - min) / (max - min)) * 100));
    return {
      rank_name: 'Platinum Titan',
      tier_level: 5,
      badge_color: '#06B6D4',
      bg_gradient: 'from-cyan-500 to-blue-600',
      current_volume: totalVolumeKg,
      min_volume: min,
      max_volume: max,
      progress_percent: pct,
    };
  } else if (totalVolumeKg >= 75000) {
    const min = 75000;
    const max = 200000;
    const pct = Math.min(100, Math.round(((totalVolumeKg - min) / (max - min)) * 100));
    return {
      rank_name: 'Gold Athlete',
      tier_level: 4,
      badge_color: '#F59E0B',
      bg_gradient: 'from-amber-500 to-yellow-600',
      current_volume: totalVolumeKg,
      min_volume: min,
      max_volume: max,
      progress_percent: pct,
    };
  } else if (totalVolumeKg >= 25000) {
    const min = 25000;
    const max = 75000;
    const pct = Math.min(100, Math.round(((totalVolumeKg - min) / (max - min)) * 100));
    return {
      rank_name: 'Silver Beast',
      tier_level: 3,
      badge_color: '#94A3B8',
      bg_gradient: 'from-slate-400 to-slate-600',
      current_volume: totalVolumeKg,
      min_volume: min,
      max_volume: max,
      progress_percent: pct,
    };
  } else if (totalVolumeKg >= 5000) {
    const min = 5000;
    const max = 25000;
    const pct = Math.min(100, Math.round(((totalVolumeKg - min) / (max - min)) * 100));
    return {
      rank_name: 'Bronze Lifter',
      tier_level: 2,
      badge_color: '#D97706',
      bg_gradient: 'from-amber-700 to-amber-900',
      current_volume: totalVolumeKg,
      min_volume: min,
      max_volume: max,
      progress_percent: pct,
    };
  } else {
    const min = 0;
    const max = 5000;
    const pct = Math.min(100, Math.round((totalVolumeKg / max) * 100));
    return {
      rank_name: 'Iron Novice',
      tier_level: 1,
      badge_color: '#64748B',
      bg_gradient: 'from-slate-600 to-slate-800',
      current_volume: totalVolumeKg,
      min_volume: min,
      max_volume: max,
      progress_percent: pct,
    };
  }
}

// ── Default Exercise Catalog (EXACTLY 40 EXERCISES) ──────────────────────────
export const DEFAULT_EXERCISES: Exercise[] = [
  // Chest (7)
  { id: 'ex-1', name: 'Barbell Bench Press', muscle_group: 'Chest', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-2', name: 'Incline Dumbbell Press', muscle_group: 'Chest', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-3', name: 'Chest Fly (Cable)', muscle_group: 'Chest', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-4', name: 'Dips (Chest Focus)', muscle_group: 'Chest', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-5', name: 'Push-Ups', muscle_group: 'Chest', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-6', name: 'Incline Barbell Press', muscle_group: 'Chest', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-7', name: 'Decline Chest Press', muscle_group: 'Chest', category_type: 'Strength', equipment: 'Machine' },

  // Back (7)
  { id: 'ex-8', name: 'Lat Pulldown', muscle_group: 'Back', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-9', name: 'Barbell Bent-Over Row', muscle_group: 'Back', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-10', name: 'Seated Cable Row', muscle_group: 'Back', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-11', name: 'Conventional Deadlift', muscle_group: 'Back', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-12', name: 'Pull-Ups', muscle_group: 'Back', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-13', name: 'Single-Arm Dumbbell Row', muscle_group: 'Back', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-14', name: 'T-Bar Row', muscle_group: 'Back', category_type: 'Strength', equipment: 'Barbell' },

  // Legs (8)
  { id: 'ex-15', name: 'Barbell Back Squat', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-16', name: 'Leg Press', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Machine' },
  { id: 'ex-17', name: 'Romanian Deadlift (RDL)', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-18', name: 'Leg Extension', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Machine' },
  { id: 'ex-19', name: 'Lying Hamstring Curl', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Machine' },
  { id: 'ex-20', name: 'Bulgarian Split Squat', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-21', name: 'Standing Calf Raise', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Machine' },
  { id: 'ex-22', name: 'Sumo Deadlift', muscle_group: 'Legs', category_type: 'Strength', equipment: 'Barbell' },

  // Shoulders (6)
  { id: 'ex-23', name: 'Overhead Barbell Press (OHP)', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-24', name: 'Dumbbell Lateral Raise', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-25', name: 'Seated Dumbbell Press', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-26', name: 'Face Pulls', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-27', name: 'Arnold Press', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-28', name: 'Machine Rear Delt Fly', muscle_group: 'Shoulders', category_type: 'Strength', equipment: 'Machine' },

  // Arms (6)
  { id: 'ex-29', name: 'Barbell Bicep Curl', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-30', name: 'Incline Dumbbell Curl', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-31', name: 'Hammer Curls', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Dumbbell' },
  { id: 'ex-32', name: 'Triceps Rope Pushdown', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-33', name: 'EZ-Bar Skullcrushers', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Barbell' },
  { id: 'ex-34', name: 'Preacher Curl', muscle_group: 'Arms', category_type: 'Strength', equipment: 'Machine' },

  // Core & Cardio (6)
  { id: 'ex-35', name: 'Hanging Leg Raise', muscle_group: 'Core', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-36', name: 'Cable Rope Crunch', muscle_group: 'Core', category_type: 'Strength', equipment: 'Cable' },
  { id: 'ex-37', name: 'Plank', muscle_group: 'Core', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-38', name: 'Ab Wheel Rollout', muscle_group: 'Core', category_type: 'Bodyweight', equipment: 'Bodyweight' },
  { id: 'ex-39', name: 'Treadmill Running', muscle_group: 'Legs', category_type: 'Cardio', equipment: 'Machine' },
  { id: 'ex-40', name: 'Stationary Rowing Machine', muscle_group: 'Back', category_type: 'Cardio', equipment: 'Machine' },
];

// ── Default Preset Routines ───────────────────────────────────────────────────
export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: 'rot-1',
    title: 'Arm & Shoulder Focus',
    day_of_week: 'Senin',
    time_of_day: 'Pagi',
    description: 'Fokus pada bicep, tricep, dan lateral delts.',
    exercises: [
      { exercise_id: 'ex-24', target_sets: 4, target_reps: '12-15', target_weight_kg: 10, rest_seconds: 60 },
      { exercise_id: 'ex-29', target_sets: 4, target_reps: '10-12', target_weight_kg: 30, rest_seconds: 60 },
      { exercise_id: 'ex-32', target_sets: 4, target_reps: '12', target_weight_kg: 25, rest_seconds: 60 },
    ],
  },
  {
    id: 'rot-2',
    title: 'Back & Core Strength',
    day_of_week: 'Rabu',
    time_of_day: 'Pagi',
    description: 'Fokus pada ketebalan latissimus dan kekuatan core.',
    exercises: [
      { exercise_id: 'ex-11', target_sets: 3, target_reps: '5', target_weight_kg: 100, rest_seconds: 120 },
      { exercise_id: 'ex-8', target_sets: 4, target_reps: '10-12', target_weight_kg: 55, rest_seconds: 90 },
      { exercise_id: 'ex-9', target_sets: 3, target_reps: '10', target_weight_kg: 50, rest_seconds: 60 },
    ],
  },
  {
    id: 'rot-3',
    title: 'Chest & Upper Body Blast',
    day_of_week: 'Jumat',
    time_of_day: 'Sore',
    description: 'Fokus pada serat dada atas dan middle chest.',
    exercises: [
      { exercise_id: 'ex-1', target_sets: 4, target_reps: '8-10', target_weight_kg: 70, rest_seconds: 90 },
      { exercise_id: 'ex-2', target_sets: 3, target_reps: '10-12', target_weight_kg: 24, rest_seconds: 60 },
      { exercise_id: 'ex-3', target_sets: 3, target_reps: '12-15', target_weight_kg: 15, rest_seconds: 60 },
    ],
  },
];

// Helper Storage Keys
const STORAGE_KEYS = {
  ROUTINES: 'naoolift_routines_v2',
  LOGS: 'naoolift_logs_v2',
  BODY: 'naoolift_body_v2',
};

export function getRoutines(): Routine[] {
  if (typeof window === 'undefined') return DEFAULT_ROUTINES;
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
    return DEFAULT_ROUTINES;
  }
  try { return JSON.parse(data); } catch { return DEFAULT_ROUTINES; }
}

export function saveRoutine(routine: Routine): Routine[] {
  const current = getRoutines();
  const index = current.findIndex(r => r.id === routine.id);
  let updated: Routine[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = routine;
  } else {
    updated = [routine, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
  return updated;
}

export function getWorkoutLogs(): WorkoutLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

export function saveWorkoutLog(log: WorkoutLog): WorkoutLog[] {
  const current = getWorkoutLogs();
  const updated = [log, ...current];
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

export function getBodyLogs(): BodyLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.BODY);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

export function saveBodyLog(log: BodyLog): BodyLog[] {
  const current = getBodyLogs();
  const updated = [log, ...current];
  localStorage.setItem(STORAGE_KEYS.BODY, JSON.stringify(updated));
  return updated;
}
