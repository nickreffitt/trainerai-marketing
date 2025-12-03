"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Timer,
  Pause,
  Play,
  Flag,
  Trophy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Video,
  RotateCcw
} from "lucide-react";

interface SetData {
  reps: number;
  weight: number;
}

interface Segment {
  name: string;
  durationMinutes: number;
  zone?: string;
  videoId: string;
  actualDurationMinutes?: number;
}

interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'for-time';
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
}

interface SubstitutionOption {
  exercise: Exercise;
  reason: string;
  similarity: number;
}

export default function WorkoutDemo() {
  useDemoNavigation('workout');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showSubstitutionDialog, setShowSubstitutionDialog] = useState(false);
  const [substitutionOptions, setSubstitutionOptions] = useState<SubstitutionOption[]>([]);
  const [selectedSubstitution, setSelectedSubstitution] = useState<string | null>(null);
  const [showOtherFeedback, setShowOtherFeedback] = useState(false);
  const [exerciseFeedback, setExerciseFeedback] = useState("");
  const [aiModification, setAiModification] = useState<Exercise | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [workoutNote, setWorkoutNote] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showEditSets, setShowEditSets] = useState(false);
  const [editingSets, setEditingSets] = useState<SetData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // For-time block timer state
  const [timerPhase, setTimerPhase] = useState<'preview' | 'prep' | 'active' | 'complete' | 'review'>('preview');
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [editingSegments, setEditingSegments] = useState<Segment[]>([]);
  const [showVideos, setShowVideos] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [workout, setWorkout] = useState({
    name: "Upper Body Strength - Week 4",
    goal: "Increase bench press 1RM by 10kg",
    coachNotes: "Great progress on your bench press journey! This week we're focusing on controlled eccentrics to build strength in the stretch position.",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    estimatedTime: "55-65 minutes",
    exercises: [
      {
        id: "1",
        type: "strength",
        name: "Barbell Bench Press",
        sets: 4,
        reps: "6-8",
        weight: "80kg",
        notes: "Focus on controlled eccentric (3 sec down)",
        restSeconds: 180,
        equipment: ["Barbell", "Bench", "Rack"],
        muscleGroups: ["Chest", "Triceps", "Shoulders"],
        completed: false,
        videoId: "SCVCLChPQFY",
      },
      {
        id: "2",
        type: "strength",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-10",
        weight: "30kg ea.",
        notes: "30° incline, full range of motion",
        restSeconds: 120,
        equipment: ["Dumbbells", "Adjustable Bench"],
        muscleGroups: ["Upper Chest", "Shoulders"],
        completed: false,
        videoId: "5CECBjd7HLQ",
      },
      {
        id: "3",
        type: "strength",
        name: "Cable Flyes",
        sets: 3,
        reps: "12-15",
        weight: "Stack 7",
        notes: "Squeeze at peak contraction",
        restSeconds: 90,
        equipment: ["Cable Machine"],
        muscleGroups: ["Chest"],
        completed: false,
        videoId: "Cj6P91eFXkM",
      },
      {
        id: "4",
        type: "strength",
        name: "Overhead Tricep Extension",
        sets: 3,
        reps: "10-12",
        weight: "22kg",
        notes: "Keep elbows stable",
        restSeconds: 60,
        equipment: ["Cable Machine", "Rope Attachment"],
        muscleGroups: ["Triceps"],
        completed: false,
        videoId: "1u18yJELsh0",
      },
      {
        id: "5",
        type: "for-time",
        name: "55' Mixed Cardio Group",
        sets: 0,
        reps: "",
        notes: "Maintain steady Zone 2 pace throughout",
        restSeconds: 0,
        equipment: ["Ski Erg", "C2 Bike", "Rower"],
        muscleGroups: ["Full Body", "Cardio"],
        completed: false,
        videoId: "",
        segments: [
          {
            name: "Ski Erg",
            durationMinutes: 20,
            zone: "Zone 2",
            videoId: "P7qpoJmX91I",
          },
          {
            name: "C2 Bike",
            durationMinutes: 10,
            zone: "Zone 2",
            videoId: "9GiQvt0rxaU",
          },
          {
            name: "Row",
            durationMinutes: 20,
            zone: "Zone 2",
            videoId: "EkmlAPflpSE",
          },
          {
            name: "C2 Bike",
            durationMinutes: 5,
            zone: "Zone 2",
            videoId: "9GiQvt0rxaU",
          },
        ],
      },
    ] as Exercise[],
  });

  const currentExercise = workout.exercises[currentExerciseIndex];
  const completedCount = workout.exercises.filter(e => e.completed).length;
  const progress = (completedCount / workout.exercises.length) * 100;

  // Scroll detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setIsScrolledDown(scrollTop > 20);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNeedSubstitution = () => {
    const substitutions: SubstitutionOption[] = [];

    switch (currentExercise.name) {
      case "Barbell Bench Press":
        substitutions.push(
          {
            exercise: {
              id: "sub-1",
              name: "Dumbbell Bench Press",
              type: "strength",
              sets: 4,
              reps: "6-8",
              weight: "35kg ea.",
              notes: "Equivalent load, allows for more natural movement pattern",
              restSeconds: 180,
              equipment: ["Dumbbells", "Bench"],
              muscleGroups: ["Chest", "Triceps", "Shoulders"],
              videoId: "VmB1G1K7v94",
            },
            reason: "Same movement pattern, requires only dumbbells and bench",
            similarity: 95,
          },
          {
            exercise: {
              id: "sub-2",
              name: "Push-ups (Weighted)",
              type: "strength",
              sets: 4,
              reps: "15-20",
              weight: "BW + 20kg plate",
              notes: "Bodyweight alternative, add weight with backpack/vest",
              restSeconds: 120,
              equipment: ["None"],
              muscleGroups: ["Chest", "Triceps", "Shoulders", "Core"],
              videoId: "IODxDxX7oi4",
            },
            reason: "No equipment needed, can be done anywhere",
            similarity: 80,
          }
        );
        break;
    }

    setSubstitutionOptions(substitutions);
    setShowSubstitutionDialog(true);
  };

  const handleApplySubstitution = () => {
    if (selectedSubstitution === "other-modification" && aiModification) {
      const newExercises = [...workout.exercises];
      newExercises[currentExerciseIndex] = { ...aiModification, id: currentExercise.id, completed: false };
      setWorkout({ ...workout, exercises: newExercises });
    } else if (selectedSubstitution) {
      const option = substitutionOptions.find((o) => o.exercise.id === selectedSubstitution);
      if (option) {
        const newExercises = [...workout.exercises];
        newExercises[currentExerciseIndex] = { ...option.exercise, id: currentExercise.id, completed: false };
        setWorkout({ ...workout, exercises: newExercises });
      }
    }
    setShowSubstitutionDialog(false);
    setSelectedSubstitution(null);
    setShowOtherFeedback(false);
    setExerciseFeedback("");
    setAiModification(null);
  };

  const handleSubmitExerciseFeedback = () => {
    if (!exerciseFeedback.trim() || isSubmittingFeedback) return;

    setIsSubmittingFeedback(true);

    // Simulate AI response based on feedback
    setTimeout(() => {
      const feedbackLower = exerciseFeedback.toLowerCase();
      const current = currentExercise;
      let modification: Exercise = { ...current };

      if (feedbackLower.includes("heavy") || feedbackLower.includes("too much weight")) {
        // Reduce weight by 10-15%
        const currentWeight = parseInt(current.weight || "0");
        const newWeight = Math.round(currentWeight * 0.85);
        modification = {
          ...current,
          weight: current.weight?.includes("kg") ? `${newWeight}kg` : `${newWeight}${current.weight?.match(/\D+$/)?.[0] || ""}`,
          notes: "Weight reduced for better form and control"
        };
      } else if (feedbackLower.includes("light") || feedbackLower.includes("easy")) {
        // Increase weight by 10-15%
        const currentWeight = parseInt(current.weight || "0");
        const newWeight = Math.round(currentWeight * 1.15);
        modification = {
          ...current,
          weight: current.weight?.includes("kg") ? `${newWeight}kg` : `${newWeight}${current.weight?.match(/\D+$/)?.[0] || ""}`,
          notes: "Weight increased to match your strength level"
        };
      } else if (feedbackLower.includes("more reps") || feedbackLower.includes("higher reps")) {
        // Adjust to higher rep range
        modification = {
          ...current,
          reps: "12-15",
          weight: current.weight ? `${Math.round(parseInt(current.weight) * 0.8)}${current.weight.match(/\D+$/)?.[0] || ""}` : current.weight,
          notes: "Adjusted to higher rep range for muscular endurance"
        };
      } else if (feedbackLower.includes("fewer reps") || feedbackLower.includes("heavier")) {
        // Adjust to lower rep range with higher weight
        modification = {
          ...current,
          reps: "4-6",
          weight: current.weight ? `${Math.round(parseInt(current.weight) * 1.15)}${current.weight.match(/\D+$/)?.[0] || ""}` : current.weight,
          notes: "Adjusted to lower rep range for max strength"
        };
      } else {
        // Generic modification
        modification = {
          ...current,
          notes: `Modified based on your feedback: "${exerciseFeedback}"`
        };
      }

      setAiModification(modification);
      setIsSubmittingFeedback(false);
      setSelectedSubstitution("other-modification");
    }, 1000);
  };

  const handleToggleEditSets = () => {
    if (!showEditSets) {
      const exercise = currentExercise;
      // Initialize set data if it doesn't exist
      const defaultWeight = parseInt(exercise.weight || "0");
      const defaultReps = parseInt(exercise.reps.split("-")[0] || "0");

      const initialSets = exercise.setData || Array.from({ length: exercise.sets }, () => ({
        reps: defaultReps,
        weight: defaultWeight
      }));

      setEditingSets(initialSets);
    }
    setShowEditSets(!showEditSets);
  };

  const handleSaveSets = () => {
    const newExercises = [...workout.exercises];
    newExercises[currentExerciseIndex].setData = editingSets;
    newExercises[currentExerciseIndex].completed = true;
    setWorkout({ ...workout, exercises: newExercises });
    setShowEditSets(false);

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleUpdateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newSets = [...editingSets];
    newSets[index] = { ...newSets[index], [field]: numValue };
    setEditingSets(newSets);
  };

  // Timer handlers for for-time blocks
  const handleStartBlock = () => {
    setTimerPhase('prep');
    setTimeRemainingSeconds(10);
    setCurrentSegmentIndex(0);
    setIsPaused(false);
    setShowVideos(false);
  };

  const handleRestartBlock = () => {
    setShowRestartDialog(true);
  };

  const handleConfirmRestart = () => {
    // Clear previous results
    const newExercises = [...workout.exercises];
    if (newExercises[currentExerciseIndex].segments) {
      newExercises[currentExerciseIndex].segments = newExercises[currentExerciseIndex].segments?.map(seg => ({
        ...seg,
        actualDurationMinutes: undefined
      }));
    }
    newExercises[currentExerciseIndex].completed = false;
    setWorkout({ ...workout, exercises: newExercises });

    // Reset to preview
    setTimerPhase('preview');
    setCurrentSegmentIndex(0);
    setTimeRemainingSeconds(0);
    setIsPaused(false);
    setShowRestartDialog(false);
    setShowVideos(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleFinishEarly = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerPhase('review');
    // Initialize editing segments with actual durations
    if (currentExercise.segments) {
      const completedSegments = currentExercise.segments.map((seg, idx) => ({
        ...seg,
        actualDurationMinutes: idx < currentSegmentIndex ? seg.durationMinutes :
                               idx === currentSegmentIndex ? Math.floor((seg.durationMinutes * 60 - timeRemainingSeconds) / 60) :
                               0
      }));
      setEditingSegments(completedSegments);
    }
  };

  const handleSaveBlock = () => {
    const newExercises = [...workout.exercises];
    if (newExercises[currentExerciseIndex].segments) {
      newExercises[currentExerciseIndex].segments = editingSegments;
    }
    newExercises[currentExerciseIndex].completed = true;
    setWorkout({ ...workout, exercises: newExercises });

    // Reset timer state to show completed state
    setTimerPhase('preview');
    setCurrentSegmentIndex(0);
    setTimeRemainingSeconds(0);
    setIsPaused(false);

    // Don't auto-advance - stay on completed state
    // User can manually navigate to next exercise
  };

  const handleUpdateSegment = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newSegments = [...editingSegments];
    newSegments[index] = { ...newSegments[index], actualDurationMinutes: numValue };
    setEditingSegments(newSegments);
  };

  // Timer effect
  useEffect(() => {
    if (isPaused || timerPhase === 'preview' || timerPhase === 'review' || timerPhase === 'complete') {
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Time's up for current phase/segment
          if (timerPhase === 'prep') {
            // Move to first segment
            if (currentExercise.segments && currentExercise.segments.length > 0) {
              setTimerPhase('active');
              setCurrentSegmentIndex(0);
              return currentExercise.segments[0].durationMinutes * 60;
            }
          } else if (timerPhase === 'active') {
            // Move to next segment or complete
            if (currentExercise.segments && currentSegmentIndex < currentExercise.segments.length - 1) {
              const nextIndex = currentSegmentIndex + 1;
              setCurrentSegmentIndex(nextIndex);
              return currentExercise.segments[nextIndex].durationMinutes * 60;
            } else {
              // All segments complete
              setTimerPhase('complete');
              setTimeout(() => {
                handleFinishEarly(); // Transition to review
              }, 2000);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerPhase, isPaused, currentSegmentIndex, currentExercise]);

  const handleSubmitNote = () => {
    if (!workoutNote.trim() || isSubmittingNote) return;

    setIsSubmittingNote(true);

    // Simulate AI coach response based on note content
    setTimeout(() => {
      const noteLower = workoutNote.toLowerCase();
      let response = "";

      if (noteLower.includes("easy") || noteLower.includes("light")) {
        response = "Thanks for the feedback! I've noted that today's workout felt easier than expected. I'll increase the intensity for your next upper body session by adding 5kg to your compound lifts and reducing rest times slightly. Keep up the great work!";
      } else if (noteLower.includes("hard") || noteLower.includes("difficult") || noteLower.includes("tough") || noteLower.includes("challenging")) {
        response = "I appreciate you sharing that! It's normal to have tougher days. I've adjusted your next workout to give you more recovery time and will maintain the current weight loads to help you build confidence. Remember, consistency is key!";
      } else if (noteLower.includes("tired") || noteLower.includes("fatigue") || noteLower.includes("exhausted")) {
        response = "Thank you for being honest about your energy levels. I'm scheduling an extra rest day this week and will reduce the volume in your next session to prioritize recovery. Your long-term progress is what matters most!";
      } else if (noteLower.includes("pain") || noteLower.includes("hurt") || noteLower.includes("sore")) {
        response = "Thanks for letting me know. I've flagged this for your trainer Sarah to review. In the meantime, I'll modify your upcoming workouts to avoid aggravating this area. Your safety and health are the top priority!";
      } else if (noteLower.includes("great") || noteLower.includes("good") || noteLower.includes("strong")) {
        response = "That's awesome to hear! Your consistency is paying off. I'll progressively increase the challenge in your upcoming sessions to keep building on this momentum. You're on track to hit your goals!";
      } else {
        response = "Thanks for sharing your feedback! I've logged this note and will use it to optimize your upcoming training sessions. Your input helps me create the perfect workout plan for you. Keep communicating how you're feeling!";
      }

      setAiResponse(response);
      setIsSubmittingNote(false);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <div className="flex-none bg-white border-b px-4 py-3 flex items-center justify-between pt-10">
        <div className="flex items-center gap-3">
          <Link href="/demo/summary">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Today's Workout</h1>
        </div>
      </div>

      {/* Workout Container */}
      <div className="flex-1 flex flex-col bg-white shadow-sm overflow-hidden">
        {/* Workout Info Header */}
        <motion.div
          className="flex-none border-b bg-white px-4"
          initial={false}
          animate={{
            paddingTop: isScrolledDown ? 12 : 12,
            paddingBottom: isScrolledDown ? 12 : 12
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Collapsible header content */}
          <motion.div
            className="overflow-hidden"
            initial={false}
            animate={{
              height: isScrolledDown ? 0 : "auto",
              opacity: isScrolledDown ? 0 : 1,
              marginBottom: isScrolledDown ? 0 : 12
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                💪
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{workout.name}</h3>
                <p className="text-sm text-slate-600">{workout.goal}</p>
              </div>
            </div>
          </motion.div>

          {/* Progress bar - Always visible */}
          <motion.div
            className="flex items-center gap-3"
            initial={false}
            animate={{
              marginBottom: isScrolledDown ? 0 : 12
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {completedCount}/{workout.exercises.length}
            </span>
          </motion.div>

          {/* Coach Notes - Collapsible */}
          <motion.div
            className="overflow-hidden"
            initial={false}
            animate={{
              height: isScrolledDown ? 0 : "auto",
              opacity: isScrolledDown ? 0 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="bg-blue-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-700">
                <strong>Coach:</strong> {workout.coachNotes}
              </p>
              <p className="text-xs text-slate-600 mt-1">⏱️ {workout.estimatedTime}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scrollable Exercise List */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
          <div className="space-y-3 max-w-4xl mx-auto">
            {workout.exercises.map((exercise, idx) => {
              const isCurrent = idx === currentExerciseIndex;

              // Compact card for non-current exercises
              if (!isCurrent) {
                return (
                  <Card
                    key={exercise.id}
                    className={`p-3 cursor-pointer transition-all ${
                      exercise.completed
                        ? "bg-green-50 border-green-200 opacity-60"
                        : "hover:border-blue-300"
                    }`}
                    onClick={() => setCurrentExerciseIndex(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            exercise.completed ? "text-green-600" : "text-slate-400"
                          }`}>
                            {idx + 1}
                          </span>
                          <h4 className={`font-semibold text-sm ${
                            exercise.completed ? "line-through text-slate-500" : "text-slate-900"
                          }`}>
                            {exercise.name}
                          </h4>
                          {exercise.completed && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {exercise.type === 'for-time'
                            ? `${exercise.segments?.reduce((sum, seg) => sum + seg.durationMinutes, 0)}' group · ${exercise.segments?.length} movements`
                            : `${exercise.sets} sets × ${exercise.reps} @ ${exercise.weight}`
                          }
                        </p>
                      </div>
                      {!exercise.completed && idx > currentExerciseIndex && (
                        <Badge variant="outline" className="text-xs">
                          Up Next
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              }

              // Expanded card for current exercise
              return (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge className="mb-2 bg-blue-600 gap-1.5">
                    {exercise.type === 'for-time' ? <Timer className="w-3.5 h-3.5" /> : null}
                    Current {exercise.type === 'for-time' ? 'Exercise Group' : 'Exercise'}
                  </Badge>
                  <Card className="border-2 border-blue-500 shadow-lg overflow-hidden p-0 gap-0">
                    {/* Exercise Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{currentExercise.name}</h3>
                      <div className="flex gap-2 flex-wrap">
                        {currentExercise.muscleGroups.map((mg) => (
                          <Badge key={mg} variant="secondary" className="text-xs">
                            {mg}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* FOR-TIME BLOCK */}
                    {currentExercise.type === 'for-time' && currentExercise.segments && (
                      <>
                        {/* Completed State */}
                        {timerPhase === 'preview' && currentExercise.completed && (
                          <div className="px-4 py-4">
                            {/* Completion Badge */}
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-center mb-4 text-white">
                              <Trophy className="w-12 h-12 mx-auto mb-3" />
                              <div className="text-2xl font-bold mb-1">Group Completed!</div>
                              <div className="text-sm font-medium opacity-90">
                                Total: {currentExercise.segments.reduce((sum, seg) => sum + (seg.actualDurationMinutes || seg.durationMinutes), 0).toFixed(1)}'
                              </div>
                            </div>

                            {/* Results Summary */}
                            <h4 className="font-semibold text-slate-900 mb-3">Your Results:</h4>
                            <div className="space-y-2 mb-4">
                              {currentExercise.segments.map((segment, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-slate-900">{segment.name}</p>
                                      <p className="text-xs text-slate-600">{segment.zone}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                      {(segment.actualDurationMinutes || segment.durationMinutes).toFixed(1)}'
                                    </p>
                                    <p className="text-xs text-slate-600">
                                      Target: {segment.durationMinutes}'
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Equipment */}
                            <div className="mb-4">
                              <p className="text-xs font-medium text-slate-600 mb-2">EQUIPMENT USED:</p>
                              <div className="flex gap-2 flex-wrap">
                                {currentExercise.equipment.map((eq) => (
                                  <Badge key={eq} variant="outline" className="text-xs">
                                    {eq}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Restart Button */}
                            <Button
                              onClick={handleRestartBlock}
                              variant="outline"
                              size="lg"
                              className="w-full gap-2"
                            >
                              <RotateCcw className="w-5 h-5" />
                              Restart
                            </Button>
                          </div>
                        )}

                        {/* Preview Mode */}
                        {timerPhase === 'preview' && !currentExercise.completed && (
                          <div className="px-4 py-4">
                            {/* Total Duration */}
                            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 text-center mb-4 text-white">
                              <div className="text-5xl font-bold mb-2">
                                {currentExercise.segments.reduce((sum, seg) => sum + seg.durationMinutes, 0)}'
                              </div>
                              <div className="text-sm font-medium">TOTAL GROUP TIME</div>
                            </div>

                            {/* Segments Preview */}
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-slate-900">Group Overview:</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowVideos(!showVideos)}
                                className="gap-2"
                              >
                                <Video className="w-4 h-4" />
                                {showVideos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showVideos ? 'Hide' : 'Show'} Videos
                              </Button>
                            </div>
                            <div className="space-y-3 mb-4">
                              {currentExercise.segments.map((segment, idx) => (
                                <div key={idx} className="border rounded-lg overflow-hidden">
                                  <div className="flex items-center gap-3 p-3 bg-slate-50">
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {idx + 1}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-slate-900">{segment.name}</h5>
                                      <p className="text-xs text-slate-600">
                                        {segment.durationMinutes}' @ {segment.zone}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Video Preview - Collapsible */}
                                  <AnimatePresence>
                                    {showVideos && (
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="relative w-full aspect-video">
                                          <iframe
                                            src={`https://www.youtube.com/embed/${segment.videoId}?controls=0`}
                                            className="w-full h-full"
                                            allow="encrypted-media"
                                            allowFullScreen
                                          />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>

                            {/* Equipment */}
                            <div className="mb-4">
                              <p className="text-xs font-medium text-slate-600 mb-2">EQUIPMENT NEEDED:</p>
                              <div className="flex gap-2 flex-wrap">
                                {currentExercise.equipment.map((eq) => (
                                  <Badge key={eq} variant="outline" className="text-xs">
                                    {eq}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Coach's Note */}
                            {currentExercise.notes && (
                              <div className="bg-amber-50 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
                                <span className="text-amber-600 text-sm flex-shrink-0">💡</span>
                                <p className="text-xs text-slate-900">
                                  <strong>Tip:</strong> {currentExercise.notes}
                                </p>
                              </div>
                            )}

                            {/* Start Button */}
                            <Button
                              onClick={handleStartBlock}
                              size="lg"
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-bold gap-2"
                            >
                              <Rocket className="w-5 h-5" />
                              Start
                            </Button>
                          </div>
                        )}

                        {/* Prep Countdown */}
                        {timerPhase === 'prep' && (
                          <div className="px-4 py-8">
                            <div className="text-center">
                              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Ready!</h3>
                              <div
                                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-40 h-40 mx-auto flex items-center justify-center text-white shadow-2xl mb-2 cursor-pointer hover:scale-105 transition-transform active:scale-95"
                                onClick={() => {
                                  if (currentExercise.segments && currentExercise.segments.length > 0) {
                                    setTimerPhase('active');
                                    setCurrentSegmentIndex(0);
                                    setTimeRemainingSeconds(currentExercise.segments[0].durationMinutes * 60);
                                  }
                                }}
                              >
                                <div className="text-7xl font-bold">{timeRemainingSeconds}</div>
                              </div>
                              <p className="text-sm text-slate-500 mb-6">Tap to Skip</p>
                              <p className="text-lg text-slate-600 mb-2">Next up:</p>
                              <p className="text-xl font-bold text-slate-900">
                                {currentExercise.segments[0].name}
                              </p>
                              <p className="text-slate-600">
                                {currentExercise.segments[0].durationMinutes}' @ {currentExercise.segments[0].zone}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Active Timer */}
                        {(timerPhase === 'active' || timerPhase === 'complete') && (
                          <div className="px-4 py-6">
                            {/* Current Segment */}
                            <div className="text-center mb-6">
                              <Badge className="mb-3 text-sm bg-blue-600 gap-1.5">
                                <Timer className="w-4 h-4" />
                                Segment {currentSegmentIndex + 1} of {currentExercise.segments.length}
                              </Badge>
                              <h3 className="text-3xl font-bold text-slate-900 mb-0">
                                {currentExercise.segments[currentSegmentIndex]?.name}
                              </h3>
                              <p className="text-slate-600">
                                {currentExercise.segments[currentSegmentIndex]?.zone}
                              </p>
                            </div>

                            {/* Timer Display */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-center mb-6 shadow-2xl">
                              <div className="text-7xl font-bold text-white mb-0">
                                {Math.floor(timeRemainingSeconds / 60)}:{String(timeRemainingSeconds % 60).padStart(2, '0')}
                              </div>
                              <div className="text-sm font-medium text-white/90">TIME REMAINING</div>
                            </div>

                            {/* Next Segment Preview */}
                            {currentSegmentIndex < currentExercise.segments.length - 1 && timerPhase === 'active' && (
                              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                                <p className="text-xs font-medium text-slate-600 mb-1">UP NEXT:</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {currentExercise.segments[currentSegmentIndex + 1].name} - {currentExercise.segments[currentSegmentIndex + 1].durationMinutes}' @ {currentExercise.segments[currentSegmentIndex + 1].zone}
                                </p>
                              </div>
                            )}

                            {/* Control Buttons */}
                            {timerPhase === 'active' && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={handlePauseResume}
                                  variant="outline"
                                  size="lg"
                                  className="flex-1 gap-2"
                                >
                                  {isPaused ? (
                                    <>
                                      <Play className="w-5 h-5" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="w-5 h-5" />
                                      Pause
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={handleFinishEarly}
                                  variant="outline"
                                  size="lg"
                                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 gap-2"
                                >
                                  <Flag className="w-5 h-5" />
                                  Finish Early
                                </Button>
                              </div>
                            )}

                            {/* Complete Message */}
                            {timerPhase === 'complete' && (
                              <div className="text-center">
                                <Trophy className="w-16 h-16 mx-auto mb-4 text-green-600" />
                                <h3 className="text-2xl font-bold text-green-600 mb-2">Group Complete!</h3>
                                <p className="text-slate-600">Great work! Reviewing your times...</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Review Mode */}
                        {timerPhase === 'review' && (
                          <div className="px-4 py-4">
                            <h4 className="font-semibold text-slate-900 mb-4">Review Your Times:</h4>

                            <div className="space-y-4 mb-6">
                              {/* Grid Header */}
                              <div className="grid grid-cols-[1fr_100px] gap-3 items-center font-semibold text-sm text-slate-700">
                                <div>Movement</div>
                                <div className="text-center">Minutes</div>
                              </div>

                              {/* Segment Rows */}
                              <div className="space-y-3">
                                {editingSegments.map((segment, index) => (
                                  <div key={index} className="grid grid-cols-[1fr_100px] gap-3 items-center p-3 bg-slate-50 rounded-lg">
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">{segment.name}</p>
                                      <p className="text-xs text-slate-600">Target: {segment.durationMinutes}' @ {segment.zone}</p>
                                    </div>
                                    <Input
                                      type="number"
                                      inputMode="decimal"
                                      step="0.1"
                                      value={segment.actualDurationMinutes || segment.durationMinutes}
                                      onChange={(e) => handleUpdateSegment(index, e.target.value)}
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTimerPhase('preview')}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSaveBlock}
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Save
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* STRENGTH EXERCISE */}
                    {currentExercise.type === 'strength' && (
                      <>
                        {/* Video */}
                        <div className="relative w-full aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${currentExercise.videoId}?autoplay=1&mute=1&controls=0`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        </div>

                        {/* Exercise Stats */}
                        <div className="px-4 py-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{currentExercise.sets}</div>
                          <div className="text-xs text-slate-600 font-medium">SETS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{currentExercise.reps}</div>
                          <div className="text-xs text-slate-600 font-medium">REPS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">{currentExercise.weight}</div>
                          <div className="text-xs text-slate-600 font-medium">WEIGHT</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{currentExercise.restSeconds}s</div>
                          <div className="text-xs text-slate-600 font-medium">REST</div>
                        </div>
                      </div>

                      {/* Equipment */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-600 mb-1">EQUIPMENT NEEDED:</p>
                        <div className="flex gap-2 flex-wrap">
                          {currentExercise.equipment.map((eq) => (
                            <Badge key={eq} variant="outline" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Coach's Note */}
                      {currentExercise.notes && (
                        <div className="bg-amber-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
                          <span className="text-amber-600 text-sm flex-shrink-0">💡</span>
                          <p className="text-xs text-slate-900">
                            <strong>Tip:</strong> {currentExercise.notes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-3 border-t">
                        <div className="flex gap-2">
                          <Button
                            onClick={handleNeedSubstitution}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            🔄 Substitute
                          </Button>
                          <Button
                            onClick={handleToggleEditSets}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {currentExercise.completed ? "✓ Edit Sets" : "Edit Sets"}
                          </Button>
                        </div>

                        {/* Inline Edit Sets Section */}
                        <AnimatePresence>
                          {showEditSets && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 mt-4 border-t">
                                <div className="space-y-4">
                                  {/* Grid Header */}
                                  <div className="grid grid-cols-[60px_1fr_1fr] gap-3 items-center font-semibold text-sm text-slate-700">
                                    <div>Set</div>
                                    <div>Reps</div>
                                    <div>Weight (kg)</div>
                                  </div>

                                  {/* Set Rows */}
                                  <div className="space-y-3">
                                    {editingSets.map((set, index) => (
                                      <div key={index} className="grid grid-cols-[60px_1fr_1fr] gap-3 items-center">
                                        <div className="text-sm font-medium text-slate-600">
                                          {index + 1}
                                        </div>
                                        <Input
                                          type="number"
                                          inputMode="numeric"
                                          value={set.reps || ''}
                                          onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                                          placeholder="0"
                                          className="text-center"
                                        />
                                        <Input
                                          type="number"
                                          inputMode="decimal"
                                          step="0.5"
                                          value={set.weight || ''}
                                          onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                                          placeholder="0"
                                          className="text-center"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowEditSets(false)}
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleSaveSets}
                                      size="sm"
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      Save Sets
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Link href="/demo/chat" className="w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            💬 Chat with Coach
                          </Button>
                        </Link>
                      </div>
                        </div>
                      </>
                    )}
                  </Card>
                </motion.div>
              );
            })}

            {/* Completion Message */}
            {completedCount === workout.exercises.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                  <div className="text-center">
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="text-lg font-semibold mb-1">Workout Complete!</p>
                    <p className="text-sm">Great work today. Your progress has been logged.</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex-none border-t bg-white px-4 py-3 pb-10">
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
              disabled={currentExerciseIndex === 0}
              className="flex-1"
            >
              ← Previous
            </Button>
            <Button
              onClick={() => setCurrentExerciseIndex(Math.min(workout.exercises.length - 1, currentExerciseIndex + 1))}
              disabled={currentExerciseIndex === workout.exercises.length - 1}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Next →
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNotesDialog(true)}
            className="w-full"
          >
            📝 Add Workout Notes
          </Button>
        </div>
      </div>

      {/* Substitution Dialog */}
      <Dialog open={showSubstitutionDialog} onOpenChange={(open) => {
        setShowSubstitutionDialog(open);
        if (!open) {
          setSelectedSubstitution(null);
          setShowOtherFeedback(false);
          setExerciseFeedback("");
          setAiModification(null);
          setIsSubmittingFeedback(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[85vh] md:max-h-[85vh] max-h-[100vh] w-full md:w-auto h-full md:h-auto overflow-y-auto p-0 md:p-6 rounded-none md:rounded-lg border-0 md:border pt-10">
          <DialogHeader className="px-4 pt-4 md:px-0 md:pt-0">
            <DialogTitle className="text-xl">
              {showOtherFeedback ? "Modify Exercise" : "AI Exercise Substitutions"}
            </DialogTitle>
            <DialogDescription>
              {showOtherFeedback
                ? `Provide feedback about ${currentExercise.name} and get AI-powered modifications`
                : <>Intelligent alternatives for <strong>{currentExercise.name}</strong> based on your equipment and goals.</>
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 px-4 md:px-0">
            {showOtherFeedback ? (
              /* Feedback Chat Interface */
              <div className="space-y-4">
                {/* Chat Messages Area */}
                <div className="space-y-3 bg-gray-50 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                  {/* Initial AI Message */}
                  <div className="flex gap-3 flex-row">
                    <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                      AI
                    </div>
                    <div className="flex-1 max-w-[85%] flex flex-col items-start">
                      <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                        <p className="text-sm leading-relaxed">
                          What would you like to change about <strong>{currentExercise.name}</strong>?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User's Feedback (if submitted) */}
                  {(isSubmittingFeedback || aiModification) && exerciseFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 flex-row-reverse"
                    >
                      <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        U
                      </div>
                      <div className="flex-1 max-w-[85%] flex flex-col items-end">
                        <div className="rounded-2xl px-4 py-3 shadow-sm bg-blue-600 text-white">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{exerciseFeedback}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Loading indicator */}
                  {isSubmittingFeedback && !aiModification && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 flex-row"
                    >
                      <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        AI
                      </div>
                      <div className="flex-1 max-w-[85%] flex flex-col items-start">
                        <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* AI Modification Response */}
                  <AnimatePresence>
                    {aiModification && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3 flex-row"
                      >
                        <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                          AI
                        </div>
                        <div className="flex-1 max-w-[85%] flex flex-col items-start">
                          <Badge className="text-xs mb-1 bg-blue-600">✏️ Modified</Badge>
                          <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                            <p className="text-sm leading-relaxed mb-2">
                              I've adjusted the exercise based on your feedback:
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Modified Exercise Card */}
                {aiModification && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-2 border-blue-600 shadow-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-lg text-slate-900">{aiModification.name}</h4>
                        <Badge className="bg-green-600">Modified</Badge>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{aiModification.sets}</div>
                          <div className="text-xs text-slate-600 font-medium">SETS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{aiModification.reps}</div>
                          <div className="text-xs text-slate-600 font-medium">REPS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">{aiModification.weight}</div>
                          <div className="text-xs text-slate-600 font-medium">WEIGHT</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{aiModification.restSeconds}s</div>
                          <div className="text-xs text-slate-600 font-medium">REST</div>
                        </div>
                      </div>

                      {/* Notes */}
                      {aiModification.notes && (
                        <div className="bg-amber-50 rounded px-3 py-2">
                          <p className="text-xs text-slate-900">
                            <strong>💡 Note:</strong> {aiModification.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}

                {/* Input Area */}
                {!aiModification && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="E.g., 'Too heavy', 'Want more reps', 'Prefer lighter weight with higher volume'"
                      value={exerciseFeedback}
                      onChange={(e) => setExerciseFeedback(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitExerciseFeedback();
                        }
                      }}
                      className="min-h-[80px] resize-none"
                      disabled={isSubmittingFeedback}
                    />

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100"
                        onClick={() => setExerciseFeedback("The weight is too heavy")}
                      >
                        ⚖️ Too Heavy
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100"
                        onClick={() => setExerciseFeedback("I want more reps with lighter weight")}
                      >
                        🔁 More Reps
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100"
                        onClick={() => setExerciseFeedback("I want heavier weight with fewer reps")}
                      >
                        💪 Heavier Weight
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100"
                        onClick={() => setExerciseFeedback("The weight feels too light")}
                      >
                        ⬆️ Too Light
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Substitution Options List */
              <>
            {/* Other - Modify Exercise Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="overflow-hidden cursor-pointer transition-all p-4 hover:border-purple-400 hover:shadow-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50"
                onClick={() => setShowOtherFeedback(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-md">
                    ✨
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-1">Modify This Exercise</h4>
                    <p className="text-sm text-slate-600">
                      Adjust weight, reps, or other parameters with AI assistance
                    </p>
                  </div>
                  <span className="text-purple-600 font-bold">→</span>
                </div>
              </Card>
            </motion.div>

            {substitutionOptions.map((option) => (
              <motion.div
                key={option.exercise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer transition-all p-0 gap-0 ${
                    selectedSubstitution === option.exercise.id
                      ? "border-2 border-blue-600 shadow-lg"
                      : "hover:border-slate-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSubstitution(option.exercise.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Video Preview */}
                    <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${option.exercise.videoId}?controls=0`}
                        className="absolute top-0 left-0 w-full h-full min-h-[200px]"
                        allow="encrypted-media"
                        allowFullScreen
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg text-slate-900">{option.exercise.name}</h4>
                        <Badge
                          variant={option.similarity >= 90 ? "default" : "secondary"}
                          className={option.similarity >= 90 ? "bg-green-600" : ""}
                        >
                          {option.similarity}% match
                        </Badge>
                      </div>

                      {/* Muscle Groups */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {option.exercise.muscleGroups.map((mg) => (
                          <Badge key={mg} variant="secondary" className="text-xs">
                            {mg}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-slate-600 mb-3 italic">"{option.reason}"</p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{option.exercise.sets}</div>
                          <div className="text-xs text-slate-600 font-medium">SETS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{option.exercise.reps}</div>
                          <div className="text-xs text-slate-600 font-medium">REPS</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">{option.exercise.weight}</div>
                          <div className="text-xs text-slate-600 font-medium">WEIGHT</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{option.exercise.restSeconds}s</div>
                          <div className="text-xs text-slate-600 font-medium">REST</div>
                        </div>
                      </div>

                      {/* Equipment */}
                      <div className="mb-2">
                        <p className="text-xs font-medium text-slate-600 mb-1">EQUIPMENT:</p>
                        <div className="flex gap-2 flex-wrap">
                          {option.exercise.equipment.map((eq) => (
                            <Badge key={eq} variant="outline" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {option.exercise.notes && (
                        <div className="bg-amber-50 rounded px-2 py-1.5 mt-2">
                          <p className="text-xs text-slate-900">
                            <strong>💡 Tip:</strong> {option.exercise.notes}
                          </p>
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {selectedSubstitution === option.exercise.id && (
                        <div className="mt-3 flex items-center gap-2 text-blue-600">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
              </>
            )}
          </div>

          <DialogFooter className="gap-2 px-4 pb-10 md:px-0 md:pb-0">
            {showOtherFeedback ? (
              <>
                <Button variant="outline" onClick={() => {
                  setShowOtherFeedback(false);
                  setExerciseFeedback("");
                  setAiModification(null);
                  setIsSubmittingFeedback(false);
                }}>
                  ← Back
                </Button>
                {!aiModification ? (
                  <Button
                    onClick={handleSubmitExerciseFeedback}
                    disabled={!exerciseFeedback.trim() || isSubmittingFeedback}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmittingFeedback ? "Generating..." : "Get AI Suggestion"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleApplySubstitution}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Modification
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowSubstitutionDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApplySubstitution}
                  disabled={!selectedSubstitution}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Substitution
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workout Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={(open) => {
        setShowNotesDialog(open);
        if (!open) {
          setWorkoutNote("");
          setAiResponse(null);
          setIsSubmittingNote(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] md:max-h-[85vh] max-h-[100vh] w-full md:w-auto h-full md:h-auto p-0 md:p-6 rounded-none md:rounded-lg border-0 md:border flex flex-col">
          <DialogHeader className="px-4 pt-4 md:px-0 md:pt-0 flex-none">
            <DialogTitle className="text-xl">Workout Feedback</DialogTitle>
            <DialogDescription>
              Share how the workout felt. Your AI coach will provide personalized feedback.
            </DialogDescription>
          </DialogHeader>

          {/* Chat Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 md:px-0 py-4">
            <div className="space-y-3">
              {/* Initial AI Message */}
              <div className="flex gap-3 flex-row">
                <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                  AI
                </div>
                <div className="flex-1 max-w-[85%] flex flex-col items-start">
                  <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                    <p className="text-sm leading-relaxed">
                      How are you feeling today? Let me know your energy level, mood, and any concerns so I can adjust your workout, nutrition, and activity targets accordingly.
                    </p>
                  </div>
                </div>
              </div>

              {/* User's Note (if submitted) */}
              {(isSubmittingNote || aiResponse) && workoutNote && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 flex-row-reverse"
                >
                  <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                    U
                  </div>
                  <div className="flex-1 max-w-[85%] flex flex-col items-end">
                    <div className="rounded-2xl px-4 py-3 shadow-sm bg-blue-600 text-white">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{workoutNote}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator */}
              {isSubmittingNote && !aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 flex-row"
                >
                  <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                    AI
                  </div>
                  <div className="flex-1 max-w-[85%] flex flex-col items-start">
                    <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Response */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 flex-row"
                  >
                    <div className="flex-none h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                      AI
                    </div>
                    <div className="flex-1 max-w-[85%] flex flex-col items-start">
                      <Badge className="text-xs mb-1 bg-blue-600">✏️ Plan Modified</Badge>
                      <div className="rounded-2xl px-4 py-3 shadow-sm bg-white text-slate-900 border border-gray-200">
                        <p className="text-sm leading-relaxed">{aiResponse}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          {!aiResponse && (
            <div className="flex-none border-t bg-white px-4 md:px-0 py-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your feedback here..."
                  value={workoutNote}
                  onChange={(e) => setWorkoutNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitNote();
                    }
                  }}
                  className="min-h-[80px] resize-none"
                  disabled={isSubmittingNote}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => setWorkoutNote("Felt great today! Ready for more weight next time.")}
                  >
                    💪 Felt Strong
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => setWorkoutNote("This was challenging but I pushed through!")}
                  >
                    🔥 Tough Workout
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => setWorkoutNote("Felt easier than expected, ready to progress.")}
                  >
                    ✨ Felt Easy
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => setWorkoutNote("Feeling tired today, didn't have my usual energy.")}
                  >
                    😴 Low Energy
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2 px-4 pb-4 md:px-0 md:pb-0 flex-none border-t pt-4">
            {!aiResponse ? (
              <>
                <Button variant="outline" onClick={() => {
                  setShowNotesDialog(false);
                  setWorkoutNote("");
                  setAiResponse(null);
                }} disabled={isSubmittingNote}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitNote}
                  disabled={!workoutNote.trim() || isSubmittingNote}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmittingNote ? "Sending..." : "Send"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setShowNotesDialog(false);
                  setWorkoutNote("");
                  setAiResponse(null);
                  setIsSubmittingNote(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart Group Confirmation Dialog */}
      <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart Exercise Group?</DialogTitle>
            <DialogDescription>
              This will clear your previous results and start the group from the beginning. Your current times will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRestartDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRestart}
              className="bg-red-600 hover:bg-red-700"
            >
              Restart Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
