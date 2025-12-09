"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExerciseGroup } from "@/hooks/use-programming";
import { LibraryExercise } from "@/hooks/use-exercise-library";
import { StrengthExerciseForm } from "./StrengthExerciseForm";
import { CardioBlockForm } from "./CardioBlockForm";

interface ExerciseEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: ExerciseGroup;
  libraryExercise?: LibraryExercise;
  exerciseType: 'strength' | 'for-time' | 'emom' | 'amrap';
  onSave: (exercise: Omit<ExerciseGroup, 'id'>) => void;
}

export function ExerciseEditorDialog({
  open,
  onOpenChange,
  exercise,
  libraryExercise,
  exerciseType,
  onSave,
}: ExerciseEditorDialogProps) {
  const handleSave = (exerciseData: Omit<ExerciseGroup, 'id'>) => {
    onSave(exerciseData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const type = exercise?.type || exerciseType;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {exercise
              ? `Edit ${type === 'strength' ? 'Exercise' : 'Cardio Block'}`
              : `Add ${type === 'strength' ? 'Strength Exercise' : 'Cardio Block'}`
            }
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {type === 'strength' ? (
            <StrengthExerciseForm
              exercise={exercise}
              libraryExercise={libraryExercise}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <CardioBlockForm
              exercise={exercise}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
