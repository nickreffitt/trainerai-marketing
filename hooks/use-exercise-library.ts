import { useState, useEffect } from "react";

export interface LibraryExercise {
  name: string;
  category: string;
  equipment: string[];
  primary_muscles: string[];
  secondary_muscles?: string[];
  instructions?: string[];
  description?: string;
  video?: string;
  aliases?: string[];
  tips?: string[];
  tempo?: string;
}

const LIBRARY_URL = "https://raw.githubusercontent.com/exercemus/exercises/minified/minified-exercises.json";

export function useExerciseLibrary() {
  const [exercises, setExercises] = useState<LibraryExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch(LIBRARY_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch exercise library");
        }
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const searchExercises = (
    query: string,
    filters?: {
      equipment?: string[];
      muscleGroups?: string[];
      category?: string;
    }
  ): LibraryExercise[] => {
    let filtered = exercises;

    // Text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(lowerQuery) ||
          ex.aliases?.some((alias) => alias.toLowerCase().includes(lowerQuery))
      );
    }

    // Equipment filter
    if (filters?.equipment && filters.equipment.length > 0) {
      filtered = filtered.filter((ex) =>
        filters.equipment!.some((eq) =>
          ex.equipment.some((exEq) => exEq.toLowerCase() === eq.toLowerCase())
        )
      );
    }

    // Muscle groups filter
    if (filters?.muscleGroups && filters.muscleGroups.length > 0) {
      filtered = filtered.filter((ex) =>
        filters.muscleGroups!.some(
          (mg) =>
            ex.primary_muscles.some((pm) => pm.toLowerCase() === mg.toLowerCase()) ||
            ex.secondary_muscles?.some((sm) => sm.toLowerCase() === mg.toLowerCase())
        )
      );
    }

    // Category filter
    if (filters?.category) {
      filtered = filtered.filter(
        (ex) => ex.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    return filtered;
  };

  const getEquipmentOptions = (): string[] => {
    const equipmentSet = new Set<string>();
    exercises.forEach((ex) => {
      ex.equipment.forEach((eq) => {
        if (eq && eq.toLowerCase() !== 'none') {
          equipmentSet.add(eq);
        }
      });
    });
    return Array.from(equipmentSet).sort();
  };

  const getMuscleGroupOptions = (): string[] => {
    const muscleSet = new Set<string>();
    exercises.forEach((ex) => {
      ex.primary_muscles.forEach((m) => muscleSet.add(m));
      ex.secondary_muscles?.forEach((m) => muscleSet.add(m));
    });
    return Array.from(muscleSet).sort();
  };

  return {
    exercises,
    loading,
    error,
    searchExercises,
    getEquipmentOptions,
    getMuscleGroupOptions,
  };
}
