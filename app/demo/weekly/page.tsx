"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Beef,
  Footprints,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Target,
  Zap,
  Moon,
} from "lucide-react";

interface DayGoal {
  id: string;
  label: string;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface WorkoutPreview {
  id: string;
  name: string;
  type: string;
  estimatedMinutes: number;
  exerciseCount: number;
  muscleGroups: string[];
  completed: boolean;
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  nutritionGoals: DayGoal[];
  activityGoals: DayGoal[];
  workout: WorkoutPreview | null;
}

export default function WeeklyDemo() {
  useDemoNavigation("weekly");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekData, setWeekData] = useState<DayData[]>([]);

  // URL parameters for customization
  const [title, setTitle] = useState("ACM Training");
  const [clientName, setClientName] = useState("Rory");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTitle = params.get("title");
    const urlClientName = params.get("clientName");

    if (urlTitle) setTitle(urlTitle);
    if (urlClientName) setClientName(urlClientName);
  }, []);

  // Generate week data based on current week + offset
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7); // Start from Sunday

    const workoutSchedule: (WorkoutPreview | null)[] = [
      null, // Sunday - Rest
      {
        id: "1",
        name: "Upper Body Strength",
        type: "Strength",
        estimatedMinutes: 55,
        exerciseCount: 5,
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        completed: weekOffset < 0 || (weekOffset === 0 && today.getDay() > 1),
      },
      {
        id: "2",
        name: "Zone 2 Cardio",
        type: "Cardio",
        estimatedMinutes: 45,
        exerciseCount: 1,
        muscleGroups: ["Full Body", "Cardio"],
        completed: weekOffset < 0 || (weekOffset === 0 && today.getDay() > 2),
      },
      {
        id: "3",
        name: "Lower Body Strength",
        type: "Strength",
        estimatedMinutes: 60,
        exerciseCount: 6,
        muscleGroups: ["Quads", "Glutes", "Hamstrings"],
        completed: weekOffset < 0 || (weekOffset === 0 && today.getDay() > 3),
      },
      null, // Thursday - Rest
      {
        id: "4",
        name: "Push Day",
        type: "Strength",
        estimatedMinutes: 50,
        exerciseCount: 5,
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        completed: weekOffset < 0 || (weekOffset === 0 && today.getDay() > 5),
      },
      {
        id: "5",
        name: "HIIT & Core",
        type: "HIIT",
        estimatedMinutes: 35,
        exerciseCount: 8,
        muscleGroups: ["Core", "Full Body"],
        completed: weekOffset < 0 || (weekOffset === 0 && today.getDay() > 6),
      },
    ];

    const days: DayData[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday =
        date.toDateString() === today.toDateString() && weekOffset === 0;
      const isPast = date < today && !isToday;

      // Vary the goals slightly by day for realism
      const calorieBase = 2200;
      const proteinBase = 165;
      const stepsBase = 10000;
      const sleepBase = 8;

      // Training days have higher calorie/protein targets
      const isTrainingDay = workoutSchedule[i] !== null;
      const calorieTarget = isTrainingDay ? calorieBase + 200 : calorieBase;
      const proteinTarget = isTrainingDay
        ? proteinBase + 15
        : proteinBase;

      days.push({
        date,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        isToday,
        isPast,
        nutritionGoals: [
          {
            id: "calories",
            label: "Calories",
            target: calorieTarget,
            unit: "cal",
            icon: <Flame className="w-4 h-4" />,
            color: "from-orange-500 to-red-600",
            gradient: "from-orange-500 to-red-600",
          },
          {
            id: "protein",
            label: "Protein",
            target: proteinTarget,
            unit: "g",
            icon: <Beef className="w-4 h-4" />,
            color: "from-amber-500 to-orange-600",
            gradient: "from-amber-500 to-orange-600",
          },
        ],
        activityGoals: [
          {
            id: "steps",
            label: "Steps",
            target: stepsBase,
            unit: "",
            icon: <Footprints className="w-4 h-4" />,
            color: "from-green-500 to-emerald-600",
            gradient: "from-green-500 to-emerald-600",
          },
          {
            id: "sleep",
            label: "Sleep",
            target: sleepBase,
            unit: "hrs",
            icon: <Moon className="w-4 h-4" />,
            color: "from-blue-500 to-indigo-600",
            gradient: "from-blue-500 to-indigo-600",
          },
        ],
        workout: workoutSchedule[i],
      });
    }

    setWeekData(days);

    // Set selected day to today if in current week
    if (weekOffset === 0) {
      setSelectedDayIndex(today.getDay());
    } else {
      setSelectedDayIndex(0);
    }
  }, [weekOffset]);

  const selectedDay = weekData[selectedDayIndex];

  const getWeekRangeString = () => {
    if (weekData.length === 0) return "";
    const start = weekData[0].date;
    const end = weekData[6].date;
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  };

  const totalWorkoutMinutes = weekData.reduce((acc, day) => {
    return acc + (day.workout?.estimatedMinutes || 0);
  }, 0);

  const completedWorkouts = weekData.filter((day) => day.workout?.completed).length;
  const totalWorkouts = weekData.filter((day) => day.workout !== null).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 space-y-6 pt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4 pb-2"
        >
          <div className="flex items-center justify-between mb-2">
            <Link href="/demo/summary">
              <Button variant="ghost" size="sm" className="text-slate-600">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Summary
              </Button>
            </Link>
          </div>
          <h1
            className="text-3xl font-black italic text-slate-900 mb-1 tracking-tight text-center"
            style={{
              fontFamily:
                '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            Weekly Plan
          </h1>
          <p className="text-lg text-slate-600 text-center">
            Plan your week ahead, {clientName}
          </p>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset(weekOffset - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  {weekOffset === 0
                    ? "This Week"
                    : weekOffset === 1
                    ? "Next Week"
                    : weekOffset === -1
                    ? "Last Week"
                    : getWeekRangeString()}
                </h2>
                <p className="text-sm text-slate-600">{getWeekRangeString()}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset(weekOffset + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Week Overview Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Dumbbell className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {completedWorkouts}/{totalWorkouts}
                </p>
                <p className="text-xs text-slate-600">Workouts</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {Math.round(totalWorkoutMinutes / 60)}h {totalWorkoutMinutes % 60}m
                </p>
                <p className="text-xs text-slate-600">Total Time</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-600">Week 4</p>
                <p className="text-xs text-slate-600">of Training Block</p>
              </div>
            </div>

            {/* Day Selector */}
            <div className="grid grid-cols-7 gap-2">
              {weekData.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`p-2 rounded-lg text-center transition-all relative ${
                    selectedDayIndex === index
                      ? "bg-blue-600 text-white shadow-lg"
                      : day.isToday
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : day.isPast
                      ? "bg-slate-100 text-slate-400"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p
                    className={`text-xs font-medium ${
                      selectedDayIndex === index
                        ? "text-white/80"
                        : day.isPast
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {day.dayName}
                  </p>
                  <p className="text-lg font-bold">{day.dayNumber}</p>
                  {day.workout && (
                    <div
                      className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                        day.workout.completed
                          ? "bg-green-400"
                          : selectedDayIndex === index
                          ? "bg-white/60"
                          : "bg-blue-400"
                      }`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Selected Day Details */}
        {selectedDay && (
          <motion.div
            key={selectedDayIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedDay.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                {selectedDay.isToday && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                    Today
                  </Badge>
                )}
              </h3>
            </div>

            {/* Workout Preview */}
            {selectedDay.workout ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-5 border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Dumbbell className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {selectedDay.workout.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-slate-50"
                          >
                            {selectedDay.workout.type}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {selectedDay.workout.exerciseCount} exercises
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedDay.workout.completed ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : selectedDay.isPast ? (
                      <Badge className="bg-red-100 text-red-700 border-red-200">
                        Missed
                      </Badge>
                    ) : null}
                  </div>

                  {/* Workout Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Clock className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedDay.workout.estimatedMinutes} min
                        </p>
                        <p className="text-xs text-slate-600">Est. Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Zap className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedDay.workout.muscleGroups.slice(0, 2).join(", ")}
                        </p>
                        <p className="text-xs text-slate-600">Focus Areas</p>
                      </div>
                    </div>
                  </div>

                  {/* Muscle Groups Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDay.workout.muscleGroups.map((muscle, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {muscle}
                      </Badge>
                    ))}
                  </div>

                  {/* Start Workout Button */}
                  {!selectedDay.workout.completed && !selectedDay.isPast && (
                    <Link href="/demo/workout">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {selectedDay.isToday ? "Start Workout" : "Preview Workout"}{" "}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-5 border-l-4 border-l-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-700">
                        Rest Day
                      </h4>
                      <p className="text-sm text-slate-500">
                        Focus on recovery and hitting your nutrition goals
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Nutrition Goals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h4 className="text-md font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Nutrition Goals
              </h4>
              <Card className="p-4">
                <div className="space-y-3">
                  {selectedDay.nutritionGoals.map((goal, idx) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center text-white`}
                        >
                          {goal.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {goal.label}
                          </p>
                          <p className="text-sm text-slate-600">
                            {selectedDay.workout
                              ? "Training day target"
                              : "Rest day target"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">
                          {goal.target.toLocaleString()}
                          <span className="text-sm font-normal text-slate-500 ml-1">
                            {goal.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Activity Goals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h4 className="text-md font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Footprints className="w-5 h-5 text-green-500" />
                Activity Goals
              </h4>
              <Card className="p-4">
                <div className="space-y-3">
                  {selectedDay.activityGoals.map((goal, idx) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center text-white`}
                        >
                          {goal.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {goal.label}
                          </p>
                          <p className="text-sm text-slate-600">Daily target</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">
                          {goal.target.toLocaleString()}
                          <span className="text-sm font-normal text-slate-500 ml-1">
                            {goal.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Week at a Glance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h4 className="text-md font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Week at a Glance
              </h4>
              <Card className="p-4">
                <div className="space-y-2">
                  {weekData.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedDayIndex === idx
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            day.isToday
                              ? "bg-blue-600 text-white"
                              : day.isPast
                              ? "bg-slate-200 text-slate-400"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {day.dayNumber}
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              day.isPast && !day.isToday
                                ? "text-slate-400"
                                : "text-slate-900"
                            }`}
                          >
                            {day.dayName}
                            {day.isToday && (
                              <span className="text-blue-600 text-xs ml-2">
                                Today
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {day.workout ? day.workout.name : "Rest Day"}
                          </p>
                        </div>
                      </div>
                      {day.workout && (
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-700">
                              {day.workout.estimatedMinutes} min
                            </p>
                          </div>
                          {day.workout.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : day.isPast ? (
                            <Circle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
