import { useState } from "react";

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

export interface ExerciseGroup {
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
  emomIntervalSeconds?: number;
  emomTotalMinutes?: number;
  emomIntervals?: EmomInterval[];
  // AMRAP specific fields
  amrapDurationMinutes?: number;
  amrapExercises?: AmrapExercise[];
  amrapRoundsCompleted?: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeekProgram {
  id: string;
  weekStart: Date;
  days: Record<DayOfWeek, ExerciseGroup[]>;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const initialProgram: WeekProgram = {
  id: '1',
  weekStart: new Date(),
  days: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }
};

export function useProgramming() {
  const [program, setProgram] = useState<WeekProgram>(initialProgram);

  const addExercise = (day: DayOfWeek, exercise: ExerciseGroup) => {
    setProgram(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], exercise]
      }
    }));
  };

  const updateExercise = (day: DayOfWeek, exerciseId: string, updates: Partial<ExerciseGroup>) => {
    setProgram(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].map(ex =>
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      }
    }));
  };

  const deleteExercise = (day: DayOfWeek, exerciseId: string) => {
    setProgram(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter(ex => ex.id !== exerciseId)
      }
    }));
  };

  const duplicateExercise = (day: DayOfWeek, exerciseId: string) => {
    setProgram(prev => {
      const exercise = prev.days[day].find(ex => ex.id === exerciseId);
      if (!exercise) return prev;

      const duplicate = {
        ...exercise,
        id: `${exercise.id}-copy-${Date.now()}`,
        name: `${exercise.name} (Copy)`
      };

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: [...prev.days[day], duplicate]
        }
      };
    });
  };

  const moveExercise = (fromDay: DayOfWeek, toDay: DayOfWeek, exerciseId: string, toIndex: number) => {
    setProgram(prev => {
      const exercise = prev.days[fromDay].find(ex => ex.id === exerciseId);
      if (!exercise) return prev;

      // Remove from source day
      const newFromDay = prev.days[fromDay].filter(ex => ex.id !== exerciseId);

      // Add to destination day at specific index
      const newToDay = [...prev.days[toDay]];
      newToDay.splice(toIndex, 0, exercise);

      return {
        ...prev,
        days: {
          ...prev.days,
          [fromDay]: newFromDay,
          [toDay]: newToDay
        }
      };
    });
  };

  const reorderExercise = (day: DayOfWeek, exerciseId: string, newIndex: number) => {
    setProgram(prev => {
      const exercises = [...prev.days[day]];
      const oldIndex = exercises.findIndex(ex => ex.id === exerciseId);
      if (oldIndex === -1) return prev;

      const [removed] = exercises.splice(oldIndex, 1);
      exercises.splice(newIndex, 0, removed);

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: exercises
        }
      };
    });
  };

  const clearDay = (day: DayOfWeek) => {
    setProgram(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: []
      }
    }));
  };

  const clearWeek = () => {
    setProgram(prev => ({
      ...prev,
      days: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      }
    }));
  };

  return {
    program,
    addExercise,
    updateExercise,
    deleteExercise,
    duplicateExercise,
    moveExercise,
    reorderExercise,
    clearDay,
    clearWeek,
    DAYS
  };
}
