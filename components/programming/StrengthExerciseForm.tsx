"use client";

import { useState, useEffect } from "react";
import { ExerciseGroup } from "@/hooks/use-programming";
import { LibraryExercise } from "@/hooks/use-exercise-library";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StrengthExerciseFormProps {
  exercise?: ExerciseGroup;
  libraryExercise?: LibraryExercise;
  onSave: (exercise: Omit<ExerciseGroup, 'id'>) => void;
  onCancel: () => void;
}

const COMMON_EQUIPMENT = [
  'Barbell',
  'Dumbbells',
  'Kettlebell',
  'Cable Machine',
  'Resistance Bands',
  'Bench',
  'Rack',
  'Pull-up Bar',
  'Bodyweight',
  'Smith Machine',
  'Leg Press',
  'Rowing Machine',
];

const COMMON_MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Abs',
  'Obliques',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Hip Flexors',
  'Lower Back',
  'Upper Back',
];

export function StrengthExerciseForm({ exercise, libraryExercise, onSave, onCancel }: StrengthExerciseFormProps) {
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Extract YouTube video ID from URL if present
  const extractVideoId = (videoUrl?: string): string => {
    if (!videoUrl) return '';
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : '';
  };

  const [name, setName] = useState(exercise?.name || (libraryExercise?.name ? capitalizeWords(libraryExercise.name) : ''));
  const [sets, setSets] = useState(exercise?.sets?.toString() || '');
  const [reps, setReps] = useState(exercise?.reps || '');
  const [weight, setWeight] = useState(exercise?.weight || '');
  const [restSeconds, setRestSeconds] = useState(exercise?.restSeconds?.toString() || '');
  const [equipment, setEquipment] = useState<string[]>(
    exercise?.equipment ||
    (libraryExercise?.equipment?.filter(e => e.toLowerCase() !== 'none').map(capitalizeWords) || [])
  );
  const [muscleGroups, setMuscleGroups] = useState<string[]>(
    exercise?.muscleGroups ||
    ([
      ...(libraryExercise?.primary_muscles?.map(capitalizeWords) || []),
      ...(libraryExercise?.secondary_muscles?.map(capitalizeWords) || [])
    ])
  );
  const [notes, setNotes] = useState(
    exercise?.notes ||
    (libraryExercise?.instructions ? libraryExercise.instructions.slice(0, 2).join(' ') : '') ||
    ''
  );
  const [videoId, setVideoId] = useState(exercise?.videoId || extractVideoId(libraryExercise?.video) || '');
  const [customEquipment, setCustomEquipment] = useState('');
  const [customMuscleGroup, setCustomMuscleGroup] = useState('');

  // Update form when libraryExercise changes
  useEffect(() => {
    if (libraryExercise && !exercise) {
      setName(capitalizeWords(libraryExercise.name));
      setEquipment(libraryExercise.equipment?.filter(e => e.toLowerCase() !== 'none').map(capitalizeWords) || []);
      setMuscleGroups([
        ...(libraryExercise.primary_muscles?.map(capitalizeWords) || []),
        ...(libraryExercise.secondary_muscles?.map(capitalizeWords) || [])
      ]);
      setNotes(libraryExercise.instructions ? libraryExercise.instructions.slice(0, 2).join(' ') : '');
      setVideoId(extractVideoId(libraryExercise.video));
    }
  }, [libraryExercise, exercise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exerciseData: Omit<ExerciseGroup, 'id'> = {
      name,
      type: 'strength',
      sets: parseInt(sets) || 0,
      reps,
      weight,
      restSeconds: parseInt(restSeconds) || 0,
      equipment,
      muscleGroups,
      notes,
      videoId,
      completed: false,
    };

    onSave(exerciseData);
  };

  const toggleEquipment = (item: string) => {
    setEquipment(prev =>
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const toggleMuscleGroup = (group: string) => {
    setMuscleGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const addCustomEquipment = () => {
    if (customEquipment.trim() && !equipment.includes(customEquipment.trim())) {
      setEquipment([...equipment, customEquipment.trim()]);
      setCustomEquipment('');
    }
  };

  const addCustomMuscleGroup = () => {
    if (customMuscleGroup.trim() && !muscleGroups.includes(customMuscleGroup.trim())) {
      setMuscleGroups([...muscleGroups, customMuscleGroup.trim()]);
      setCustomMuscleGroup('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Exercise Name */}
      <div>
        <Label htmlFor="name">Exercise Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Barbell Bench Press"
          required
          className="mt-1"
        />
      </div>

      {/* Sets, Reps, Weight Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sets">Sets *</Label>
          <Input
            id="sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="4"
            required
            min="1"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reps">Reps *</Label>
          <Input
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="6-8"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="80kg"
            className="mt-1"
          />
        </div>
      </div>

      {/* Rest Time */}
      <div>
        <Label htmlFor="rest">Rest (seconds) *</Label>
        <Input
          id="rest"
          type="number"
          value={restSeconds}
          onChange={(e) => setRestSeconds(e.target.value)}
          placeholder="180"
          required
          min="0"
          className="mt-1"
        />
      </div>

      {/* Equipment */}
      <div>
        <Label>Equipment Needed</Label>
        <div className="flex gap-2 flex-wrap mt-2 mb-3">
          {equipment.map((item) => (
            <Badge
              key={item}
              variant="default"
              className="cursor-pointer gap-1"
              onClick={() => toggleEquipment(item)}
            >
              {item}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {COMMON_EQUIPMENT.filter(e => !equipment.includes(e)).map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
              onClick={() => toggleEquipment(item)}
            >
              + {item}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={customEquipment}
            onChange={(e) => setCustomEquipment(e.target.value)}
            placeholder="Custom equipment..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomEquipment();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addCustomEquipment}>
            Add
          </Button>
        </div>
      </div>

      {/* Muscle Groups */}
      <div>
        <Label>Muscle Groups Targeted</Label>
        <div className="flex gap-2 flex-wrap mt-2 mb-3">
          {muscleGroups.map((group) => (
            <Badge
              key={group}
              variant="default"
              className="cursor-pointer gap-1"
              onClick={() => toggleMuscleGroup(group)}
            >
              {group}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {COMMON_MUSCLE_GROUPS.filter(g => !muscleGroups.includes(g)).map((group) => (
            <Badge
              key={group}
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
              onClick={() => toggleMuscleGroup(group)}
            >
              + {group}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={customMuscleGroup}
            onChange={(e) => setCustomMuscleGroup(e.target.value)}
            placeholder="Custom muscle group..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomMuscleGroup();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addCustomMuscleGroup}>
            Add
          </Button>
        </div>
      </div>

      {/* Video ID */}
      <div>
        <Label htmlFor="videoId">YouTube Video ID (optional)</Label>
        <Input
          id="videoId"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="e.g., SCVCLChPQFY"
          className="mt-1"
        />
        <p className="text-xs text-slate-500 mt-1">
          For form demonstration (the ID from youtube.com/watch?v=ID)
        </p>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Coach Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Focus on controlled eccentric (3 sec down)"
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {exercise ? 'Update Exercise' : 'Add Exercise'}
        </Button>
      </div>
    </form>
  );
}
