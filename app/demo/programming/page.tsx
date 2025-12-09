"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useProgramming, ExerciseGroup, DayOfWeek } from "@/hooks/use-programming";
import { LibraryExercise } from "@/hooks/use-exercise-library";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { DayColumn } from "@/components/programming/DayColumn";
import { ExerciseCard } from "@/components/programming/ExerciseCard";
import { ExerciseEditorDialog } from "@/components/programming/ExerciseEditorDialog";
import { ExerciseLibrary } from "@/components/programming/ExerciseLibrary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, Eye, Trash2, Upload } from "lucide-react";
import { WorkoutImportDialog } from "@/components/workout-import-dialog";
import { Workout } from "@/types/workout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProgrammingPage() {
  useDemoNavigation('plan');

  const {
    program,
    addExercise,
    updateExercise,
    deleteExercise,
    duplicateExercise,
    moveExercise,
    reorderExercise,
    clearWeek,
    DAYS
  } = useProgramming();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseGroup | undefined>();
  const [selectedLibraryExercise, setSelectedLibraryExercise] = useState<LibraryExercise | undefined>();
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [exerciseType, setExerciseType] = useState<'strength' | 'for-time' | 'emom' | 'amrap'>('strength');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which day the active item is in
    let activeDay: DayOfWeek | null = null;
    for (const day of DAYS) {
      if (program.days[day].some(ex => ex.id === activeId)) {
        activeDay = day;
        break;
      }
    }

    if (!activeDay) return;

    // Check if we're dragging over a day column (not another exercise)
    if (DAYS.includes(overId as DayOfWeek)) {
      const overDay = overId as DayOfWeek;

      if (activeDay !== overDay) {
        // Moving to a different day - add to end of that day's list
        moveExercise(activeDay, overDay, activeId, program.days[overDay].length);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which day the active item is in
    let activeDay: DayOfWeek | null = null;
    for (const day of DAYS) {
      if (program.days[day].some(ex => ex.id === activeId)) {
        activeDay = day;
        break;
      }
    }

    if (!activeDay) return;

    // If we dropped on an exercise card (reordering within same day)
    const activeExercises = program.days[activeDay];
    const oldIndex = activeExercises.findIndex(ex => ex.id === activeId);
    const newIndex = activeExercises.findIndex(ex => ex.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      reorderExercise(activeDay, activeId, newIndex);
    }
  };

  const handleAddExercise = (day: DayOfWeek, type: 'strength' | 'for-time') => {
    setEditingDay(day);
    setExerciseType(type);
    setEditingExercise(undefined);
    setSelectedLibraryExercise(undefined);
    setEditorOpen(true);
  };

  const handleBrowseLibrary = (day: DayOfWeek) => {
    setEditingDay(day);
    setLibraryOpen(true);
  };

  const handleSelectLibraryExercise = (exercise: LibraryExercise) => {
    setSelectedLibraryExercise(exercise);
    setExerciseType('strength');
    setEditingExercise(undefined);
    setLibraryOpen(false);
    setEditorOpen(true);
  };

  const handleEditExercise = (day: DayOfWeek, exercise: ExerciseGroup) => {
    setEditingDay(day);
    setExerciseType(exercise.type);
    setEditingExercise(exercise);
    setSelectedLibraryExercise(undefined);
    setEditorOpen(true);
  };

  const handleSaveExercise = (exerciseData: Omit<ExerciseGroup, 'id'>) => {
    if (!editingDay) return;

    if (editingExercise) {
      // Update existing
      updateExercise(editingDay, editingExercise.id, exerciseData);
    } else {
      // Add new
      const newExercise: ExerciseGroup = {
        ...exerciseData,
        id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      addExercise(editingDay, newExercise);
    }
  };

  const handleDeleteExercise = (day: DayOfWeek, exerciseId: string) => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      deleteExercise(day, exerciseId);
    }
  };

  const handleDuplicateExercise = (day: DayOfWeek, exerciseId: string) => {
    duplicateExercise(day, exerciseId);
  };

  const handleSaveProgram = () => {
    // In a real app, this would save to backend
    console.log('Saving program:', program);
    alert('Program saved! (This is a demo - data is not persisted)');
  };

  const handleImportWorkout = (importedWorkout: Workout) => {
    // Convert imported workout to programming exercises
    // Add all exercises to Monday by default
    const targetDay: DayOfWeek = 'monday';

    importedWorkout.exercises.forEach((exercise) => {
      const newExercise: ExerciseGroup = {
        id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: exercise.type,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        restSeconds: exercise.restSeconds,
        notes: exercise.notes,
        equipment: exercise.equipment,
        muscleGroups: exercise.muscleGroups,
        videoId: exercise.videoId,
        segments: exercise.segments,
        emomIntervalSeconds: exercise.emomIntervalSeconds,
        emomTotalMinutes: exercise.emomTotalMinutes,
        emomIntervals: exercise.emomIntervals,
        amrapDurationMinutes: exercise.amrapDurationMinutes,
        amrapExercises: exercise.amrapExercises,
        amrapRoundsCompleted: exercise.amrapRoundsCompleted,
      };

      addExercise(targetDay, newExercise);
    });
  };

  const activeExercise = activeId
    ? DAYS.flatMap(day => program.days[day]).find(ex => ex.id === activeId)
    : null;

  const totalExercises = DAYS.reduce((sum, day) => sum + program.days[day].length, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/demo/summary">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Workout Programming</h1>
                <p className="text-sm text-slate-600">Build your weekly training plan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                {totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'} this week
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportDialog(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                disabled={totalExercises === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Week
              </Button>
              <Link href="/demo/workout">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Button onClick={handleSaveProgram} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Program
              </Button>
            </div>
          </div>

          {/* Week Navigator */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium">
              Week of {program.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Horizontal Scrollable Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="max-w-[1800px] mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 pb-4">
              {DAYS.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  exercises={program.days[day]}
                  onAddExercise={(type) => handleAddExercise(day, type)}
                  onBrowseLibrary={() => handleBrowseLibrary(day)}
                  onEditExercise={(exercise) => handleEditExercise(day, exercise)}
                  onDuplicateExercise={(exerciseId) => handleDuplicateExercise(day, exerciseId)}
                  onDeleteExercise={(exerciseId) => handleDeleteExercise(day, exerciseId)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeExercise && (
                <div className="w-80">
                  <ExerciseCard
                    exercise={activeExercise}
                    onEdit={() => {}}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Exercise Library Dialog */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-6">
          <DialogHeader>
            <DialogTitle>Exercise Library</DialogTitle>
          </DialogHeader>
          <ExerciseLibrary
            onSelectExercise={handleSelectLibraryExercise}
            onClose={() => setLibraryOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Exercise Editor Dialog */}
      <ExerciseEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        exercise={editingExercise}
        libraryExercise={selectedLibraryExercise}
        exerciseType={exerciseType}
        onSave={handleSaveExercise}
      />

      {/* Workout Import Dialog */}
      <WorkoutImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportWorkout}
      />

      {/* Clear Week Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear entire week?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all {totalExercises} exercises from this week. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearWeek();
                setShowClearDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Week
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
