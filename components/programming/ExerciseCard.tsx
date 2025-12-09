"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseGroup } from "@/hooks/use-programming";
import { GripVertical, MoreVertical, Dumbbell, Timer, CheckCircle2, Copy, Trash2 } from "lucide-react";

interface ExerciseCardProps {
  exercise: ExerciseGroup;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ExerciseCard({ exercise, onEdit, onDuplicate, onDelete }: ExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isConfigured = exercise.type === 'strength'
    ? !!(exercise.name && exercise.sets && exercise.reps)
    : !!(exercise.name && exercise.segments && exercise.segments.length > 0);

  const estimatedTime = exercise.type === 'strength'
    ? Math.ceil((exercise.sets * 45 + exercise.restSeconds * (exercise.sets - 1)) / 60)
    : exercise.segments?.reduce((sum, seg) => sum + seg.durationMinutes, 0) || 0;

  const exerciseCount = exercise.type === 'strength' ? 1 : exercise.segments?.length || 0;

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="p-3 cursor-pointer hover:shadow-md transition-all group bg-white border-slate-200">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            className="flex-none mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={onEdit}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div className={`flex-none w-8 h-8 rounded-lg flex items-center justify-center ${
                  exercise.type === 'strength'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {exercise.type === 'strength' ? (
                    <Dumbbell className="w-4 h-4" />
                  ) : (
                    <Timer className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-slate-900 truncate">
                    {exercise.name || 'Untitled Exercise'}
                  </h4>
                </div>
              </div>
              {isConfigured && (
                <CheckCircle2 className="flex-none w-4 h-4 text-green-600 ml-2" />
              )}
            </div>

            {/* Summary */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 mb-2">
              {exercise.type === 'strength' ? (
                <>
                  {exercise.sets && exercise.reps && (
                    <span>{exercise.sets} sets × {exercise.reps}</span>
                  )}
                  {exercise.weight && (
                    <span className="text-slate-400">•</span>
                  )}
                  {exercise.weight && (
                    <span>{exercise.weight}</span>
                  )}
                </>
              ) : (
                <>
                  <span>{exerciseCount} {exerciseCount === 1 ? 'movement' : 'movements'}</span>
                  <span className="text-slate-400">•</span>
                  <span>{estimatedTime}' total</span>
                </>
              )}
              {estimatedTime > 0 && exercise.type === 'strength' && (
                <>
                  <span className="text-slate-400">•</span>
                  <span>~{estimatedTime} min</span>
                </>
              )}
            </div>

            {/* Muscle Groups / Badges */}
            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {exercise.muscleGroups.slice(0, 3).map((group) => (
                  <Badge key={group} variant="secondary" className="text-xs">
                    {group}
                  </Badge>
                ))}
                {exercise.muscleGroups.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{exercise.muscleGroups.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-none h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  );
}
