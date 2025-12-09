"use client";

import { useState } from "react";
import { Workout } from "@/types/workout";
import { useExerciseLibrary } from "@/hooks/use-exercise-library";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

interface WorkoutImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (workout: Workout) => void;
}

export function WorkoutImportDialog({
  open,
  onOpenChange,
  onImport,
}: WorkoutImportDialogProps) {
  const [rawText, setRawText] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattedWorkout, setFormattedWorkout] = useState<Omit<Workout, 'date'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { exercises: exerciseLibrary, loading: libraryLoading } = useExerciseLibrary();

  const handleFormat = async () => {
    if (!rawText.trim()) {
      setError("Please paste your workout text");
      return;
    }

    setIsFormatting(true);
    setError(null);

    try {
      // Ensure exerciseLibrary is a plain array before sending
      const libraryArray = Array.isArray(exerciseLibrary)
        ? exerciseLibrary
        : [];

      console.log("Sending to API:", {
        rawTextLength: rawText.length,
        exerciseLibraryType: typeof exerciseLibrary,
        isArray: Array.isArray(exerciseLibrary),
        libraryLength: libraryArray.length,
      });

      const response = await fetch("/api/format-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawText,
          exerciseLibrary: libraryArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to format workout");
      }

      const formatted = await response.json();
      setFormattedWorkout(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to format workout");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleImport = () => {
    if (!formattedWorkout) return;

    const workout: Workout = {
      ...formattedWorkout,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    };

    onImport(workout);
    handleClose();
  };

  const handleClose = () => {
    setRawText("");
    setFormattedWorkout(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Import Workout with AI
          </DialogTitle>
          <DialogDescription>
            Paste your workout from Notes or any text format. AI will structure it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Raw Text Input */}
          {!formattedWorkout && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Paste Your Workout</label>
              <Textarea
                placeholder={`Example:\n\nUpper Body Day\nBench Press 4x6-8 @ 80kg, rest 3min\nIncline DB Press 3x10 @ 30kg each\nCable Flyes 3x12-15`}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                disabled={isFormatting}
              />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isFormatting && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                <p className="text-sm text-slate-600">
                  AI is formatting your workout...
                </p>
              </div>
            </div>
          )}

          {/* Formatted Workout Preview */}
          {formattedWorkout && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Workout Formatted Successfully!</span>
              </div>

              {/* Workout Header */}
              <Card className="p-4">
                <h3 className="font-bold text-lg mb-2">{formattedWorkout.name}</h3>
                {formattedWorkout.goal && (
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Goal:</strong> {formattedWorkout.goal}
                  </p>
                )}
                {formattedWorkout.coachNotes && (
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Notes:</strong> {formattedWorkout.coachNotes}
                  </p>
                )}
                <p className="text-sm text-slate-600">
                  <strong>Estimated Time:</strong> {formattedWorkout.estimatedTime}
                </p>
              </Card>

              {/* Exercises List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Exercises ({formattedWorkout.exercises.length})</h4>
                {formattedWorkout.exercises.map((exercise, idx) => (
                  <Card key={exercise.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <h5 className="font-semibold">{exercise.name}</h5>
                        </div>
                        <div className="flex gap-2 flex-wrap mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {exercise.type}
                          </Badge>
                          {exercise.muscleGroups.map((mg) => (
                            <Badge key={mg} variant="outline" className="text-xs">
                              {mg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {exercise.type === 'strength' && (
                      <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        <div className="bg-slate-50 rounded p-2">
                          <div className="font-semibold text-slate-900">{exercise.sets}</div>
                          <div className="text-xs text-slate-600">Sets</div>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <div className="font-semibold text-slate-900">{exercise.reps}</div>
                          <div className="text-xs text-slate-600">Reps</div>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <div className="font-semibold text-slate-900">{exercise.weight || "BW"}</div>
                          <div className="text-xs text-slate-600">Weight</div>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <div className="font-semibold text-slate-900">{exercise.restSeconds}s</div>
                          <div className="text-xs text-slate-600">Rest</div>
                        </div>
                      </div>
                    )}

                    {exercise.type === 'for-time' && exercise.segments && (
                      <div className="space-y-2">
                        {exercise.segments.map((segment, segIdx) => (
                          <div key={segIdx} className="flex items-center justify-between bg-slate-50 rounded p-2 text-sm">
                            <span className="font-medium">{segment.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600">{segment.durationMinutes} min</span>
                              {segment.zone && (
                                <Badge variant="outline" className="text-xs">
                                  {segment.zone}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {exercise.notes && (
                      <p className="text-xs text-slate-600 mt-2 italic">
                        Note: {exercise.notes}
                      </p>
                    )}

                    {exercise.equipment.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {exercise.equipment.map((eq) => (
                          <Badge key={eq} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!formattedWorkout ? (
            <Button
              onClick={handleFormat}
              disabled={isFormatting || libraryLoading || !rawText.trim()}
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              {isFormatting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Format with AI
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleImport}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Import Workout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
