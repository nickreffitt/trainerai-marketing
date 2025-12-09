"use client";

import { useState, useMemo } from "react";
import { useExerciseLibrary, LibraryExercise } from "@/hooks/use-exercise-library";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, X, ChevronRight } from "lucide-react";

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: LibraryExercise) => void;
  onClose: () => void;
}

export function ExerciseLibrary({ onSelectExercise, onClose }: ExerciseLibraryProps) {
  const { exercises, loading, error, searchExercises, getEquipmentOptions, getMuscleGroupOptions } =
    useExerciseLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<LibraryExercise | null>(null);

  const filteredExercises = useMemo(() => {
    return searchExercises(searchQuery, {
      equipment: selectedEquipment,
      muscleGroups: selectedMuscles,
      category: "strength",
    });
  }, [searchQuery, selectedEquipment, selectedMuscles, searchExercises]);

  const equipmentOptions = useMemo(() => getEquipmentOptions(), [getEquipmentOptions]);
  const muscleOptions = useMemo(() => getMuscleGroupOptions(), [getMuscleGroupOptions]);

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleSelectExercise = (exercise: LibraryExercise) => {
    setSelectedExercise(exercise);
  };

  const handleConfirmSelection = () => {
    if (selectedExercise) {
      onSelectExercise(selectedExercise);
    }
  };

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-slate-600">Loading exercise library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Failed to load exercise library</p>
          <p className="text-xs text-slate-500">{error}</p>
          <Button variant="outline" size="sm" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Left Panel - Filters & List */}
      <div className="flex-1 flex flex-col">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-3">
          {/* Equipment Filter */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1.5 block">Equipment</label>
            <div className="flex gap-1.5 flex-wrap max-h-24 overflow-y-auto">
              {equipmentOptions.slice(0, 10).map((equipment) => (
                <Badge
                  key={equipment}
                  variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleEquipment(equipment)}
                >
                  {capitalizeWords(equipment)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Muscle Groups Filter */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1.5 block">Muscle Groups</label>
            <div className="flex gap-1.5 flex-wrap max-h-24 overflow-y-auto">
              {muscleOptions.slice(0, 12).map((muscle) => (
                <Badge
                  key={muscle}
                  variant={selectedMuscles.includes(muscle) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleMuscle(muscle)}
                >
                  {capitalizeWords(muscle)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedEquipment.length > 0 || selectedMuscles.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedEquipment([]);
                setSelectedMuscles([]);
                setSearchQuery("");
              }}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Exercise List */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-2 pr-4">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No exercises found. Try adjusting your filters.
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 mb-2">
                  {filteredExercises.length} exercise{filteredExercises.length !== 1 ? "s" : ""} found
                </p>
                {filteredExercises.map((exercise, index) => (
                  <Card
                    key={index}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedExercise?.name === exercise.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200"
                    }`}
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-900 truncate">
                          {capitalizeWords(exercise.name)}
                        </h4>
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          {exercise.primary_muscles.slice(0, 2).map((muscle) => (
                            <Badge key={muscle} variant="secondary" className="text-xs">
                              {capitalizeWords(muscle)}
                            </Badge>
                          ))}
                          {exercise.equipment.filter(e => e.toLowerCase() !== 'none').slice(0, 2).map((eq) => (
                            <Badge key={eq} variant="outline" className="text-xs">
                              {capitalizeWords(eq)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedExercise?.name === exercise.name && (
                        <ChevronRight className="w-4 h-4 text-blue-600 flex-none" />
                      )}
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Exercise Details */}
      {selectedExercise ? (
        <div className="w-96 border-l pl-4 flex flex-col">
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {capitalizeWords(selectedExercise.name)}
                </h3>
                <Badge className="text-xs">{capitalizeWords(selectedExercise.category)}</Badge>
              </div>

              {selectedExercise.description && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">Description</h4>
                  <p className="text-sm text-slate-600">{selectedExercise.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Primary Muscles</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedExercise.primary_muscles.map((muscle) => (
                    <Badge key={muscle} className="text-xs">
                      {capitalizeWords(muscle)}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedExercise.secondary_muscles && selectedExercise.secondary_muscles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Secondary Muscles</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedExercise.secondary_muscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {capitalizeWords(muscle)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Equipment</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedExercise.equipment.map((eq) => (
                    <Badge key={eq} variant="outline" className="text-xs">
                      {capitalizeWords(eq)}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Instructions</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                    {selectedExercise.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {selectedExercise.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Use Exercise
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-96 border-l pl-4 flex items-center justify-center">
          <p className="text-sm text-slate-500 text-center">
            Select an exercise to view details
          </p>
        </div>
      )}
    </div>
  );
}
