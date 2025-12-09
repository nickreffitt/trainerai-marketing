/**
 * Workout Types
 *
 * These types define the structure for workout data in the application.
 * They are used for:
 * - Runtime workout state management
 * - LLM-powered workout import/formatting
 * - Workout display and interaction
 */

export interface SetData {
  reps: number;
  weight: number;
}

export interface Segment {
  name: string;
  durationMinutes: number;
  zone?: string;
  videoId: string;
  actualDurationMinutes?: number;
}

export interface EmomInterval {
  name: string;
  reps?: string;
  weight?: string;
  notes?: string;
  videoId: string;
  actualRounds?: number;
}

export interface AmrapExercise {
  name: string;
  reps: string;
  weight?: string;
  notes?: string;
  videoId: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'for-time' | 'emom' | 'amrap';
  sets: number;
  reps: string;
  weight?: string;
  notes?: string;
  restSeconds: number;
  equipment: string[];
  muscleGroups: string[];
  completed?: boolean;
  videoId: string;
  setData?: SetData[];
  segments?: Segment[];
  // EMOM specific fields
  emomIntervalSeconds?: number; // Default 60 for every minute, 120 for E2MOM, etc.
  emomTotalMinutes?: number; // Total duration of EMOM
  emomIntervals?: EmomInterval[]; // For alternating exercises
  // AMRAP specific fields
  amrapDurationMinutes?: number; // Total time for AMRAP
  amrapExercises?: AmrapExercise[]; // List of exercises in the round
  amrapRoundsCompleted?: number; // How many full rounds completed
}

export interface Workout {
  name: string;
  goal: string;
  coachNotes: string;
  date: string;
  estimatedTime: string;
  exercises: Exercise[];
}
