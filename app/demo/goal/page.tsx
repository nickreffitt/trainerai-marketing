"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface GoalFormData {
  clientName: string;
  goalType: string;
  specificMetric: string;
  targetValue: string;
  timeframe: string;
  currentLevel: string;
  constraints: string;
  preferences: string;
}

interface GeneratedPlan {
  overview: {
    goal: string;
    duration: string;
    phases: number;
  };
  workouts: {
    week: number;
    focus: string;
    sessions: {
      day: string;
      type: string;
      exercises: string[];
      duration: string;
    }[];
  }[];
  nutrition: {
    dailyCalories: number;
    macros: { protein: number; carbs: number; fats: number };
    mealTiming: string[];
  };
  milestones: {
    week: number;
    target: string;
    assessment: string;
  }[];
}

export default function GoalDemo() {
  useDemoNavigation('goal');
  const [step, setStep] = useState<"form" | "generating" | "review">("form");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<GoalFormData>({
    clientName: "Alex Johnson",
    goalType: "strength",
    specificMetric: "Bench Press 1RM",
    targetValue: "100kg",
    timeframe: "8",
    currentLevel: "75kg",
    constraints: "Shoulder mobility limitations, prefers morning workouts",
    preferences: "Enjoys compound movements, dislikes cardio",
  });

  const [generatedPlan] = useState<GeneratedPlan>({
    overview: {
      goal: "Increase Bench Press 1RM from 75kg to 100kg",
      duration: "8 weeks",
      phases: 3,
    },
    workouts: [
      {
        week: 1,
        focus: "Foundation & Technique",
        sessions: [
          {
            day: "Monday",
            type: "Upper Push",
            exercises: ["Bench Press 4×8 @70kg", "Incline DB Press 3×10", "Cable Flyes 3×12", "Tricep Extensions 3×12"],
            duration: "60 min",
          },
          {
            day: "Wednesday",
            type: "Upper Pull",
            exercises: ["Barbell Rows 4×8", "Pull-ups 3×8", "Face Pulls 3×15", "Bicep Curls 3×12"],
            duration: "55 min",
          },
          {
            day: "Friday",
            type: "Full Body Power",
            exercises: ["Bench Press 5×5 @75kg", "Squats 4×6", "RDL 3×8", "Overhead Press 3×8"],
            duration: "70 min",
          },
        ],
      },
      {
        week: 4,
        focus: "Strength Building",
        sessions: [
          {
            day: "Monday",
            type: "Upper Push (Heavy)",
            exercises: ["Bench Press 5×5 @85kg", "Close-Grip Bench 3×6", "DB Press 3×8", "Tricep Dips 3×10"],
            duration: "65 min",
          },
          {
            day: "Wednesday",
            type: "Dynamic Upper",
            exercises: ["Speed Bench 8×3 @60kg", "Incline Press 4×8", "Cable Flyes 3×12", "Push-ups 3×15"],
            duration: "55 min",
          },
          {
            day: "Friday",
            type: "Max Effort Upper",
            exercises: ["Bench Press 3×3 @90kg", "Board Press 3×5", "Overhead Press 4×6", "Rows 4×8"],
            duration: "75 min",
          },
        ],
      },
    ],
    nutrition: {
      dailyCalories: 2800,
      macros: { protein: 180, carbs: 320, fats: 85 },
      mealTiming: [
        "Pre-workout: 40g carbs, 20g protein (1hr before)",
        "Post-workout: 50g carbs, 30g protein (within 30min)",
        "Evening: Higher protein, moderate carbs",
      ],
    },
    milestones: [
      { week: 2, target: "78kg x 5 reps", assessment: "Form check, RPE assessment" },
      { week: 4, target: "85kg x 3 reps", assessment: "Mid-program review, adjust if needed" },
      { week: 6, target: "92kg x 2 reps", assessment: "Deload week preparation" },
      { week: 8, target: "100kg x 1 rep", assessment: "1RM test, goal achievement" },
    ],
  });

  const handleGenerate = () => {
    setStep("generating");
    setProgress(0);

    // Simulate AI generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("review"), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const generationSteps = [
    "Analyzing client profile and current fitness level...",
    "Calculating optimal progression path to goal...",
    "Designing periodized workout plan with 3 phases...",
    "Selecting exercises based on preferences and constraints...",
    "Calculating nutrition targets and macro distribution...",
    "Setting weekly milestones and assessment points...",
    "Optimizing recovery periods and deload weeks...",
    "Generating detailed session plans...",
    "Finalizing plan and safety checks...",
    "Plan ready for review!",
  ];

  const currentStep = Math.floor(progress / 10);

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                ← Back to Demos
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Goal-Driven Plan Generator</h1>
            <p className="text-slate-600">Define specific, measurable goals and let AI create a periodized training plan</p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              {/* Client Info */}
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Goal Type */}
              <div>
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={formData.goalType} onValueChange={(v) => setFormData({ ...formData, goalType: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength Gain</SelectItem>
                    <SelectItem value="muscle">Muscle Building</SelectItem>
                    <SelectItem value="weightloss">Weight Loss</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="performance">Sport Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Metric */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specificMetric">Specific Metric</Label>
                  <Input
                    id="specificMetric"
                    placeholder="e.g., Bench Press 1RM"
                    value={formData.specificMetric}
                    onChange={(e) => setFormData({ ...formData, specificMetric: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentLevel">Current Level</Label>
                  <Input
                    id="currentLevel"
                    placeholder="e.g., 75kg"
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Target & Timeframe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    placeholder="e.g., 100kg"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe (weeks)</Label>
                  <Input
                    id="timeframe"
                    type="number"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Constraints */}
              <div>
                <Label htmlFor="constraints">Constraints & Limitations</Label>
                <Textarea
                  id="constraints"
                  placeholder="Injuries, equipment limitations, schedule constraints..."
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Preferences */}
              <div>
                <Label htmlFor="preferences">Training Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Likes, dislikes, training style..."
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-lg"
              >
                ✨ Generate AI Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <span className="text-3xl text-white">🧠</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">AI is Generating Your Plan</h2>
            <p className="text-slate-600">Creating a personalized, periodized training program...</p>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-3 mb-2" />
            <p className="text-center text-sm text-slate-600">{progress}% complete</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 min-h-[200px]">
            {generationSteps.slice(0, currentStep + 1).map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 mb-2 transition-opacity ${
                  idx === currentStep ? "opacity-100" : "opacity-50"
                }`}
              >
                <span className="text-green-600">✓</span>
                <span className="text-sm text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <span className="text-sm text-slate-500">1 DECEMBER 2025</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">HYBRID PERFORMANCE CLUB - TRACK 1</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Coach's Notes */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full" />
              <div>
                <h2 className="text-white font-bold text-lg">Coaches notes [HYBRID] - WK 8</h2>
                <span className="text-cyan-100 text-sm">Tap to view</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white">
              📊
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-slate-900 font-medium">Team, Happy Monday!</p>

            <p className="text-slate-900">
              GREAT work last week. Roll on week 8 👊
            </p>

            <p className="text-slate-700">
              Here's what we'll be focusing on over the next few months;
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">👉</span>
                <span className="text-slate-900">Posterior / Glute Development</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">👉</span>
                <span className="text-slate-900">Anti-Rotation Trunk</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">👉</span>
                <span className="text-slate-900">Running (speed project)</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-900 font-semibold mb-2">KPI's / Benchmarks;</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-slate-900">8RM Hip Thrust</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-slate-900">8RM Incline Bench Press</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-slate-900">5KM Run</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-bold text-slate-900 mb-2">This week's outline (lifts & stimulus);</p>
              <p className="text-slate-900"><strong>MON</strong> - POWER + STRENGTH</p>
            </div>
          </div>

          <div className="px-6 pb-4">
            <Button variant="ghost" className="w-full text-cyan-600">
              🕐 HISTORY
            </Button>
          </div>
        </Card>

        {/* Movement Prep */}
        <Card>
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span>🛠️</span>
              Movement prep
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">[2 sets]</p>
              <div className="space-y-2">
                <p className="text-slate-900">6/6 Fixed Bar Hip Airplanes</p>
                <p className="text-slate-900">8/8 x 90/90 Heel taps</p>
                <p className="text-slate-900">8/8 Clamshells</p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <div className="relative flex-shrink-0 w-40 h-24 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium drop-shadow">90/90 Heel Taps</p>
                </div>
              </div>
              <div className="relative flex-shrink-0 w-40 h-24 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium drop-shadow">Fixed Bar Hip Airplanes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 pb-4">
            <Button variant="ghost" className="w-full text-cyan-600">
              🕐 HISTORY
            </Button>
          </div>
        </Card>

        {/* ISO's */}
        <Card>
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span>💥</span>
              ISO's
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">[2 sets]</p>
              <div className="space-y-2">
                <p className="text-slate-900">30s Zercher ISO es</p>
                <p className="text-slate-900">20s SL Calf Yielding ISO es</p>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-3 flex items-start gap-2">
              <span className="text-red-600 text-lg flex-shrink-0">🎯</span>
              <p className="text-sm text-slate-900">
                <strong>RPE 5-6 effort for yielding, RPE 8-9 effort for overcoming</strong>
              </p>
            </div>

            <div className="bg-slate-50 border-l-4 border-slate-400 p-3 flex items-start gap-2">
              <span className="text-slate-600 text-lg flex-shrink-0">📝</span>
              <p className="text-sm text-slate-900">
                Perform 2 sets of each movement before moving on
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <div className="relative flex-shrink-0 w-40 h-24 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
              </div>
              <div className="relative flex-shrink-0 w-40 h-24 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 pb-4">
            <Button variant="ghost" className="w-full text-cyan-600">
              🕐 HISTORY
            </Button>
          </div>
        </Card>

        {/* Power Dev */}
        <Card>
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span>💥</span>
              Power Dev (2 options)
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="font-bold text-slate-900 mb-2">Option 1: [8' EMOM]</p>
              <div className="space-y-1">
                <p className="text-slate-900">2 Power Cleans <span className="font-semibold">Please add your PR</span></p>
                <p className="text-slate-900">1 High Box Jump Rx 30/24"</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-bold text-slate-900 mb-2">Option 2: [3 Rounds]</p>
              <div className="space-y-1">
                <p className="text-slate-900">5 Seated Box Jumps</p>
                <p className="text-slate-900">(for MAX height)</p>
              </div>
            </div>

            <div className="bg-slate-50 border-l-4 border-slate-400 p-3 flex items-start gap-2">
              <span className="text-slate-600 text-lg flex-shrink-0">📝</span>
              <p className="text-sm text-slate-900">
                Please note the 2 power options on our HYBRID programme are dependant on whether you want to work on your olympic lifting or not. Please choose one 🙏
              </p>
            </div>

            <div className="bg-cyan-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-900 font-semibold">1RM Power Clean</p>
                <Badge className="bg-cyan-600">+PR</Badge>
              </div>
              <div className="relative flex-shrink-0 w-full h-32 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">▶️</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-sm font-medium drop-shadow">Seated Box Jumps</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 pb-4">
            <Button variant="ghost" className="w-full text-cyan-600">
              🕐 HISTORY
            </Button>
          </div>
        </Card>

        {/* Barbell Hip Thrust */}
        <Card>
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-bold text-slate-900">Barbell Hip Thrust</h3>
          </div>
          <div className="p-6">
            <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">▶️</span>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-slate-900/80">08 ELEVATED BARBELL HIP THRUST</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-900 font-semibold mb-2">Week 1: 4 x 8 @ 70% of 8RM</p>
                <p className="text-sm text-slate-600">Build to your working weight, then perform 4 sets</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
                <p className="text-sm text-slate-900">
                  <strong>📌 KPI Benchmark:</strong> Track your 8RM for this movement
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-4">
            <Button variant="ghost" className="w-full text-cyan-600">
              🕐 HISTORY
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 mt-8">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
              Edit Plan
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white">
              Assign to Client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
