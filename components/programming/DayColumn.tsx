"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseGroup, DayOfWeek } from "@/hooks/use-programming";
import { Button } from "@/components/ui/button";
import { Plus, Library } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DayColumnProps {
  day: DayOfWeek;
  exercises: ExerciseGroup[];
  onAddExercise: (type: 'strength' | 'for-time') => void;
  onBrowseLibrary: () => void;
  onEditExercise: (exercise: ExerciseGroup) => void;
  onDuplicateExercise: (exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function DayColumn({
  day,
  exercises,
  onAddExercise,
  onBrowseLibrary,
  onEditExercise,
  onDuplicateExercise,
  onDeleteExercise,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
  });

  const exerciseIds = exercises.map(ex => ex.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex-none w-80 bg-slate-50 rounded-lg p-4 flex flex-col transition-all ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">{dayLabels[day]}</h3>
        <span className="text-xs text-slate-500">
          {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
        </span>
      </div>

      {/* Exercise List */}
      <SortableContext items={exerciseIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 min-h-[200px]">
          {exercises.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-sm text-slate-400">No exercises</p>
            </div>
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onEdit={() => onEditExercise(exercise)}
                onDuplicate={() => onDuplicateExercise(exercise.id)}
                onDelete={() => onDeleteExercise(exercise.id)}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add Exercise Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
            <Plus className="w-4 h-4" />
            Add Exercise
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onBrowseLibrary}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center">
                <Library className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium">Browse Library</div>
                <div className="text-xs text-slate-500">1000+ exercises</div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAddExercise('strength')}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                💪
              </div>
              <div>
                <div className="font-medium">Strength Exercise</div>
                <div className="text-xs text-slate-500">Sets, reps, weight</div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddExercise('for-time')}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                ⏱️
              </div>
              <div>
                <div className="font-medium">Cardio Block</div>
                <div className="text-xs text-slate-500">Timed segments</div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
