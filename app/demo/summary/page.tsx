"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import Link from "next/link";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CheckCircle2, TrendingUp, Apple, Moon, Heart, Flame, Footprints, AlertTriangle, Check, Lightbulb, ClipboardList, Dumbbell, UtensilsCrossed, BarChart3, Beef, Smile, Meh, Frown, Battery, BatteryLow, Zap } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController);

type TimeRange = "day" | "week" | "block";
type GoalType = "strength" | "endurance" | "bodycomp";

interface MetricCard {
  name: string;
  icon: React.ReactNode;
  current: string;
  target: string;
  score: number;
  trend: "up" | "down" | "stable";
}

export default function SummaryDemo() {
  useDemoNavigation('summary');
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const goalType: GoalType = "strength"; // In real app, this would come from user's goal
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [userFeelingInput, setUserFeelingInput] = useState("");
  const [hasSubmittedFeeling, setHasSubmittedFeeling] = useState(false);
  const [isSubmittingFeeling, setIsSubmittingFeeling] = useState(false);
  const [submittedFeelingText, setSubmittedFeelingText] = useState("");

  // URL parameters for customization
  const [title, setTitle] = useState("ACM Training");
  const [clientName, setClientName] = useState("Rory");
  const [greeting, setGreeting] = useState("Good day");

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTitle = params.get('title');
    const urlClientName = params.get('clientName');

    if (urlTitle) setTitle(urlTitle);
    if (urlClientName) setClientName(urlClientName);

    // Set greeting based on local time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Refs for scroll animations
  const goalProgressRef = useRef(null);
  const insightsRef = useRef(null);
  const nutritionRef = useRef(null);

  const goalProgressInView = useInView(goalProgressRef, { once: true, margin: "-100px" });
  const insightsInView = useInView(insightsRef, { once: true, margin: "-100px" });
  const nutritionInView = useInView(nutritionRef, { once: true, margin: "-100px" });

  const [agendaItems, setAgendaItems] = useState([
    { id: 'workout', label: 'Complete today\'s workout', subtitle: 'Upper Body Strength - Week 4', completed: false, icon: <Dumbbell className="w-4 h-4" />, color: 'from-green-500 to-emerald-600' },
    { id: 'calories', label: 'Hit your calorie target', current: 1850, target: 2200, unit: 'cal', completed: false, icon: <Flame className="w-4 h-4" />, color: 'from-orange-500 to-red-600', gradient: 'from-orange-500 to-red-600' },
    { id: 'protein', label: 'Hit your protein target', current: 142, target: 165, unit: 'g', completed: false, icon: <Beef className="w-4 h-4" />, color: 'from-amber-500 to-orange-600', gradient: 'from-amber-500 to-orange-600' },
    { id: 'steps', label: 'Walk 10k steps', current: 10000, target: 10000, unit: '', completed: true, icon: <Footprints className="w-4 h-4" />, color: 'from-green-500 to-emerald-600', gradient: 'from-green-500 to-emerald-600' },
  ]);


  // Mock data for goal progress graph
  const progressData = [
    { week: 'Week 1', target: 100, actual: 102, predicted: null },
    { week: 'Week 2', target: 102.5, actual: 104, predicted: null },
    { week: 'Week 3', target: 105, actual: 106.5, predicted: null },
    { week: 'Week 4', target: 107.5, actual: 108, predicted: 108 },
    { week: 'Week 5', target: 110, actual: null, predicted: 111 },
    { week: 'Week 6', target: 110, actual: null, predicted: 112 },
  ];

  // Goal-specific scoring weights and metrics
  const getMetrics = (): MetricCard[] => {
    switch (goalType as GoalType) {
      case "strength":
        return [
          {
            name: "Workout Completion",
            icon: <CheckCircle2 className="w-5 h-5" />,
            current: "4/4 sessions",
            target: "4 sessions/week",
            score: 100,
            trend: "up"
          },
          {
            name: "Volume Progression",
            icon: <TrendingUp className="w-5 h-5" />,
            current: "+8% vs last week",
            target: "+5% weekly",
            score: 85,
            trend: "up"
          },
          {
            name: "Nutrition",
            icon: <Apple className="w-5 h-5" />,
            current: "1850 cal avg",
            target: "2200 cal",
            score: 70,
            trend: "down"
          },
          {
            name: "Sleep",
            icon: <Moon className="w-5 h-5" />,
            current: "6.5 hrs avg",
            target: "7-9 hrs",
            score: 65,
            trend: "down"
          },
          {
            name: "Resting HR",
            icon: <Heart className="w-5 h-5" />,
            current: "58 bpm",
            target: "55-65 bpm",
            score: 90,
            trend: "stable"
          }
        ];
      case "endurance":
        return [
          {
            name: "Workout Completion",
            icon: <CheckCircle2 className="w-5 h-5" />,
            current: "5/6 sessions",
            target: "6 sessions/week",
            score: 83,
            trend: "stable"
          },
          {
            name: "Zone 2 HR",
            icon: <Heart className="w-5 h-5" />,
            current: "142 bpm avg",
            target: "< 145 bpm",
            score: 92,
            trend: "up"
          },
          {
            name: "Active Calories",
            icon: <Flame className="w-5 h-5" />,
            current: "2100 cal avg",
            target: "2400 cal",
            score: 87,
            trend: "up"
          },
          {
            name: "Nutrition",
            icon: <Apple className="w-5 h-5" />,
            current: "2350 cal avg",
            target: "2500 cal",
            score: 94,
            trend: "stable"
          },
          {
            name: "Sleep",
            icon: <Moon className="w-5 h-5" />,
            current: "7.8 hrs avg",
            target: "7-9 hrs",
            score: 95,
            trend: "up"
          },
          {
            name: "Steps",
            icon: <Footprints className="w-5 h-5" />,
            current: "8200 avg",
            target: "10k daily",
            score: 82,
            trend: "stable"
          }
        ];
      case "bodycomp":
        return [
          {
            name: "Nutrition",
            icon: <Apple className="w-5 h-5" />,
            current: "1750 cal avg",
            target: "1800 cal",
            score: 97,
            trend: "up"
          },
          {
            name: "Protein",
            icon: <Beef className="w-5 h-5" />,
            current: "145g avg",
            target: "150g",
            score: 96,
            trend: "up"
          },
          {
            name: "Workout Completion",
            icon: <CheckCircle2 className="w-5 h-5" />,
            current: "3/4 sessions",
            target: "4 sessions/week",
            score: 75,
            trend: "stable"
          },
          {
            name: "Sleep",
            icon: <Moon className="w-5 h-5" />,
            current: "7 hrs avg",
            target: "7-9 hrs",
            score: 88,
            trend: "stable"
          },
          {
            name: "Active Calories",
            icon: <Flame className="w-5 h-5" />,
            current: "1900 cal avg",
            target: "2000 cal",
            score: 95,
            trend: "up"
          }
        ];
      default:
        return [];
    }
  };

  const metrics = getMetrics();

  // Calculate overall score based on goal type and time range
  const calculateOverallScore = (): number => {
    const weights = goalType === "strength"
      ? [0.40, 0.25, 0.20, 0.10, 0.05]
      : goalType === "endurance"
      ? [0.35, 0.20, 0.15, 0.15, 0.10, 0.05]
      : [0.40, 0.25, 0.15, 0.10, 0.10];

    const baseScore = Math.round(
      metrics.reduce((acc, metric, idx) => {
        return acc + metric.score * (weights[idx] || 0);
      }, 0)
    );

    // Adjust score based on time range to show different colors
    if (timeRange === "day") return 92; // Green (excellent)
    if (timeRange === "week") return 68; // Yellow/Orange (good progress)
    if (timeRange === "block") return 58; // Red (needs improvement)

    return baseScore;
  };

  const overallScore = calculateOverallScore();

  // Animation sequence for score counting
  useEffect(() => {
    // Animate score counting up
    const duration = 1500;
    const steps = 60;
    const increment = overallScore / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedScore(Math.round(increment * currentStep));
      } else {
        setAnimatedScore(overallScore);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [overallScore]);

  // Animation sequence for daily check-in
  useEffect(() => {
    // Show typing indicator for 1.5s
    const typingTimer = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
    }, 1500);

    return () => {
      clearTimeout(typingTimer);
    };
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-emerald-700";
    return "text-slate-700";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-emerald-600 to-teal-700";
    return "from-slate-600 to-slate-700";
  };

  const insights = [
    {
      type: "warning",
      icon: <AlertTriangle className="w-6 h-6" />,
      message: "Sleep is 20% below target this week - recovery may be compromised"
    },
    {
      type: "success",
      icon: <CheckCircle2 className="w-6 h-6" />,
      message: "Great consistency! 12-day workout streak"
    },
    {
      type: "info",
      icon: <Lightbulb className="w-6 h-6" />,
      message: "You're trending 1 week ahead of goal. Consider increasing squat volume by 10% next week?"
    }
  ];

  const chartConfig = {
    target: {
      label: "Target Path",
      color: "#94a3b8",
    },
    actual: {
      label: "Actual Progress",
      color: "#3b82f6",
    },
    predicted: {
      label: "AI Prediction",
      color: "#8b5cf6",
    },
  } satisfies ChartConfig;

  const handleSubmitFeeling = () => {
    if (!userFeelingInput.trim() || isSubmittingFeeling) return;

    setSubmittedFeelingText(userFeelingInput);
    setIsSubmittingFeeling(true);

    // Simulate AI response based on feeling
    setTimeout(() => {
      let adjustedItems = [...agendaItems];
      const inputLower = userFeelingInput.toLowerCase();

      if (inputLower.includes("tired") || inputLower.includes("exhausted") || inputLower.includes("fatigue") || inputLower.includes("low energy")) {
        adjustedItems = adjustedItems.map(item => {
          if (item.id === 'workout') return { ...item, subtitle: 'Upper Body Strength - Week 4 (Deload -15%)', label: 'Complete today\'s workout (reduced intensity)' } as typeof item;
          if (item.id === 'calories') return { ...item, target: 1900 } as typeof item;
          if (item.id === 'steps') return { ...item, target: 7000, current: Math.min(item.current || 0, 7000), label: 'Walk 7k steps (adjusted)' } as typeof item;
          return item;
        });
      } else if (inputLower.includes("sore") || inputLower.includes("pain") || inputLower.includes("hurt")) {
        adjustedItems = adjustedItems.map(item => {
          if (item.id === 'workout') return { ...item, subtitle: 'Active Recovery - Mobility & Light Cardio', label: 'Complete active recovery session' } as typeof item;
          if (item.id === 'steps') return { ...item, target: 6000, current: Math.min(item.current || 0, 6000), label: 'Walk 6k steps (adjusted)' } as typeof item;
          return item;
        });
      } else if (inputLower.includes("great") || inputLower.includes("amazing") || inputLower.includes("energized") || inputLower.includes("strong") || inputLower.includes("feel good") || inputLower.includes("excellent")) {
        adjustedItems = adjustedItems.map(item => {
          if (item.id === 'workout') return { ...item, subtitle: 'Upper Body Strength - Week 4 (+1 Set)', label: 'Complete today\'s workout (bonus set!)' } as typeof item;
          if (item.id === 'calories') return { ...item, target: 2400 } as typeof item;
          if (item.id === 'protein') return { ...item, target: 180 } as typeof item;
          if (item.id === 'steps') return { ...item, target: 12000, label: 'Walk 12k steps (bonus goal!)' } as typeof item;
          return item;
        });
      }

      setAgendaItems(adjustedItems);
      setHasSubmittedFeeling(true);
      setIsSubmittingFeeling(false);
      setShowAgenda(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6 pt-10">
        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4 pb-2 text-center"
        >
          <h1 className="text-4xl font-black italic text-slate-900 mb-1 tracking-tight" style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif', letterSpacing: '-0.03em' }}>{title}</h1>
          <p className="text-lg text-slate-600">{greeting}, {clientName}!</p>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className={`p-6 bg-gradient-to-br ${getScoreBgColor(overallScore)} border-0 shadow-xl`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Circular Score */}
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <motion.div
                    className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 250 }}
                  >
                    <motion.span
                      className={`text-4xl font-bold ${getScoreColor(overallScore)}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      {animatedScore}
                    </motion.span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Score Info */}
              <motion.div
                className="flex-1 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  {overallScore >= 80 ? "Excellent Progress!" : overallScore >= 60 ? "Good Progress" : "Keep Pushing"}
                </h2>
                <p className="text-white/90 mb-4">
                  Your overall performance score for this {timeRange}
                </p>

                {/* Time Range Toggle */}
                <div className="flex justify-center">
                  <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                    <TabsList className="bg-white/20 border-white/30">
                      <TabsTrigger value="day" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white/90">Today</TabsTrigger>
                      <TabsTrigger value="week" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white/90">This Week</TabsTrigger>
                      <TabsTrigger value="block" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white/90">This Block</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </motion.div>

              {/* Goal Info */}
              <motion.div
                className="text-center md:text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">Strength Goal</Badge>
                <p className="text-sm font-semibold text-white">+10kg Back Squat</p>
                <p className="text-xs text-white/80">Target: 110kg by Week 6</p>
                <Badge className="mt-2 bg-white/30 text-white border-white/40 backdrop-blur-sm">
                  ✓ On Track (1 week ahead)
                </Badge>
              </motion.div>
            </div>
          </Card>
        </motion.div>


        {/* Daily Check-in Conversation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Daily Check-in</h3>
          <Card className="p-6">
            <div className="space-y-4">
              {/* Typing Indicator with AI Avatar */}
              {showTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-sm font-semibold">AI</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-100 rounded-lg p-4 w-fit"
                  >
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* AI Message with Avatar */}
              {showMessage && !hasSubmittedFeeling && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-sm font-semibold">AI</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 rounded-lg p-4 flex-1"
                  >
                    <p className="text-sm text-slate-900">
                      {greeting}! How are you feeling today? Let me know your energy level, mood, and any concerns so I can personalize your plan.
                    </p>
                  </motion.div>
                </div>
              )}

              {/* User Input (if not submitted yet) - Full Width */}
              {showMessage && !hasSubmittedFeeling && !isSubmittingFeeling && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-3"
                >
                  <Textarea
                    placeholder="E.g., 'Feeling great and energized!'"
                    value={userFeelingInput}
                    onChange={(e) => setUserFeelingInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitFeeling();
                      }
                    }}
                    className="min-h-[80px] resize-none w-full"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => setUserFeelingInput("Feeling great and energized today!")}
                    >
                      💪 Feeling Great
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => setUserFeelingInput("Feeling pretty tired, didn't sleep well")}
                    >
                      😴 Low Energy
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => setUserFeelingInput("Feeling a bit sore from yesterday's workout")}
                    >
                      💢 Feeling Sore
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => setUserFeelingInput("Feeling good, ready for my workout!")}
                    >
                      ✨ Feeling Good
                    </Badge>
                  </div>
                  <Button
                    onClick={handleSubmitFeeling}
                    disabled={!userFeelingInput.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                  </Button>
                </motion.div>
              )}

                  {/* User's submitted message */}
                  {hasSubmittedFeeling && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-blue-600 rounded-lg p-4 max-w-[80%]">
                        <p className="text-sm text-white whitespace-pre-wrap">{submittedFeelingText}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* AI typing after user submits */}
                  {isSubmittingFeeling && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-100 rounded-lg p-4 w-fit"
                    >
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}

              {/* AI Response with agenda */}
              {hasSubmittedFeeling && showAgenda && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-sm font-semibold">AI</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 rounded-lg p-4 flex-1"
                  >
                    <p className="text-sm text-slate-900">
                      Thanks for sharing! I've personalized your plan based on how you're feeling. Here's what's on deck for today:
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Today's Agenda */}
              {hasSubmittedFeeling && showAgenda && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Here's what's on deck for today:</h4>

                  {agendaItems.map((item, index) => {
                    const isWorkout = item.id === 'workout';

                    const content = (
                      <div className={`space-y-2 ${isWorkout ? 'rounded-lg p-3 bg-slate-50 border border-slate-200' : ''}`}>
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            item.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-slate-300'
                          }`}>
                            {item.completed && <Check className="w-3 h-3 text-white" />}
                          </div>

                          {/* Icon */}
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                              {item.label}
                            </span>
                            {item.subtitle && (
                              <p className="text-xs text-slate-600 mt-0.5">{item.subtitle}</p>
                            )}
                            {item.current !== undefined && (
                              <p className="text-xs font-semibold text-slate-700 mt-1">
                                {item.current.toLocaleString()} / {item.target?.toLocaleString()} {item.unit}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {item.current !== undefined && item.target && (
                          <div className="ml-16">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.current / item.target) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className={`bg-gradient-to-r ${item.gradient} h-2 rounded-full`}
                              />
                            </div>
                          </div>
                        )}

                        {/* Start Workout Button */}
                        {isWorkout && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                              Start Workout →
                            </Button>
                          </div>
                        )}
                      </div>
                    );

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {isWorkout ? (
                          <Link href="/demo/workout" className="block">
                            {content}
                          </Link>
                        ) : (
                          <div>
                            {content}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Goal Progress Graph */}
        <motion.div
          ref={goalProgressRef}
          initial={{ opacity: 0, y: 50 }}
          animate={goalProgressInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Back Squat Progress</h3>
                <p className="text-sm text-slate-600">Goal: Increase 1RM from 100kg → 110kg by Week 6</p>
              </div>
            </div>
            <CardContent className="p-0">
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <LineChart
                  accessibilityLayer
                  data={progressData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.replace('Week ', 'W')}
                  />
                  <YAxis
                    domain={[95, 115]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}kg`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey="target"
                    type="linear"
                    stroke="var(--color-target)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    dataKey="actual"
                    type="linear"
                    stroke="var(--color-actual)"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                  <Line
                    dataKey="predicted"
                    type="linear"
                    stroke="var(--color-predicted)"
                    strokeWidth={3}
                    strokeDasharray="3 3"
                    dot={false}
                    connectNulls={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="text-center p-3 bg-blue-50 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={goalProgressInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <p className="text-xs text-slate-600 mb-1">Current 1RM</p>
                <p className="text-xl font-bold text-blue-600">108kg</p>
              </motion.div>
              <motion.div
                className="text-center p-3 bg-purple-50 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={goalProgressInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <p className="text-xs text-slate-600 mb-1">Predicted Finish</p>
                <p className="text-xl font-bold text-purple-600">Week 5 (1 week early)</p>
              </motion.div>
              <motion.div
                className="text-center p-3 bg-green-50 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={goalProgressInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <p className="text-xs text-slate-600 mb-1">Progress to Goal</p>
                <p className="text-xl font-bold text-green-600">80% (8/10kg)</p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          ref={insightsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={insightsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-3">AI Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={insightsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1, ease: "easeOut" }}
              >
                <Card className={`p-4 border-l-4 ${
                  insight.type === "warning"
                    ? "border-l-yellow-500 bg-yellow-50"
                    : insight.type === "success"
                    ? "border-l-green-500 bg-green-50"
                    : "border-l-blue-500 bg-blue-50"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">{insight.icon}</div>
                    <p className="text-sm text-slate-900 flex-1">{insight.message}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nutrition & Activity Combined Section */}
        <motion.div
          ref={nutritionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={nutritionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-col items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={nutritionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-900">Nutrition & Activity</h3>
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <TabsList>
                <TabsTrigger value="day">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="block">This Block</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {timeRange === "day" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activity Card */}
              <Card className="p-6">
                <h4 className="text-md font-semibold text-slate-900 mb-4 text-center">Activity</h4>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Merged Activity Rings */}
                  <div className="relative w-64 h-64 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <defs>
                        <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff5aadff" />
                          <stop offset="100%" stopColor="#df34f9ff" />
                        </linearGradient>
                        <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0ac083ff" />
                          <stop offset="100%" stopColor="#029969ff" />
                        </linearGradient>
                        <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2fc8ffff" />
                          <stop offset="100%" stopColor="#2063f4ff" />
                        </linearGradient>
                      </defs>

                      {/* Outer Ring - Volume (Pink/Magenta) */}
                      <circle
                        cx="128"
                        cy="128"
                        r="105"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="14"
                        opacity="0.3"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="105"
                        fill="none"
                        stroke="url(#volumeGradient)"
                        strokeWidth="14"
                        strokeDasharray={`${(24500 / 25000) * (2 * Math.PI * 105)} ${2 * Math.PI * 105}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />

                      {/* Middle Ring - Steps (Green) */}
                      <circle
                        cx="128"
                        cy="128"
                        r="85"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="14"
                        opacity="0.3"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="85"
                        fill="none"
                        stroke="url(#stepsGradient)"
                        strokeWidth="14"
                        strokeDasharray={`${(8200 / 10000) * (2 * Math.PI * 85)} ${2 * Math.PI * 85}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />

                      {/* Inner Ring - Sleep (Blue) */}
                      <circle
                        cx="128"
                        cy="128"
                        r="64"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="14"
                        opacity="0.3"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="64"
                        fill="none"
                        stroke="url(#sleepGradient)"
                        strokeWidth="14"
                        strokeDasharray={`${(7.2 / 8) * (2 * Math.PI * 64)} ${2 * Math.PI * 64}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600"></div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Volume</h4>
                          <p className="text-xs text-slate-600">Weekly training load</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">24,500 kg</p>
                        <p className="text-xs text-slate-600">Goal: 25,000 kg</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"></div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Steps</h4>
                          <p className="text-xs text-slate-600">Daily movement</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">8,200</p>
                        <p className="text-xs text-slate-600">Goal: 10,000 steps</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Sleep</h4>
                          <p className="text-xs text-slate-600">Recovery time</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">7.2 hrs</p>
                        <p className="text-xs text-slate-600">Goal: 7-9 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Nutrition Card */}
              <Card className="p-6 mb-10">
                <h4 className="text-md font-semibold text-slate-900 mb-4 text-center">Nutrition</h4>
                <div className="flex flex-col items-center">
              {/* Circular Progress with Pie Chart */}
              <div className="relative w-64 h-64 mb-6">
                {/* Outer circular progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="128"
                    cy="128"
                    r="105"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="14"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="128"
                    cy="128"
                    r="105"
                    fill="none"
                    stroke="url(#emeraldGradient)"
                    strokeWidth="14"
                    strokeDasharray={`${(1850 / 2200) * (2 * Math.PI * 150)} ${2 * Math.PI * 150}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner doughnut chart */}
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  <Doughnut
                    data={{
                      labels: ['Protein', 'Carbs', 'Fat'],
                      datasets: [{
                        data: [142, 185, 60],
                        backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6'],
                        borderColor: '#ffffff',
                        borderWidth: 5
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      cutout: '0%',
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'white',
                          titleColor: '#1e293b',
                          bodyColor: '#475569',
                          borderColor: '#e2e8f0',
                          borderWidth: 1,
                          padding: 8,
                          displayColors: true,
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              return `${label}: ${value}g`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Calorie Display */}
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-slate-900">1,850 cal</p>
                <p className="text-sm text-slate-600">of 2,200 cal goal</p>
              </div>

              {/* Macro Breakdown */}
              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-slate-900">Protein</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">142g (31%)</p>
                    <p className="text-xs text-slate-600">Goal: 165g (30%)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-900">Carbs</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">185g (40%)</p>
                    <p className="text-xs text-slate-600">Goal: 220g (40%)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-slate-900">Fat</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">60g (29%)</p>
                    <p className="text-xs text-slate-600">Goal: 73g (30%)</p>
                  </div>
                </div>
              </div>
                </div>
              </Card>
            </div>
          )}

          {timeRange === "week" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Training Volume Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Training Volume</h4>
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [5200, 0, 6100, 5800, 0, 6400, 1000],
                              backgroundColor: '#ec4899',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [6250, 0, 6250, 6250, 0, 6250, 0],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false,
                              spanGaps: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + ' kg';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-pink-50 rounded">
                      <p className="text-xs text-slate-600">Weekly Total: <span className="font-bold text-pink-600">24,500 kg</span> / Target: 25,000 kg</p>
                    </div>
                  </Card>

                  {/* Steps Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Daily Steps</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [8500, 7200, 9100, 8800, 7500, 8200, 6900],
                              backgroundColor: '#10b981',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [10000, 10000, 10000, 10000, 10000, 10000, 10000],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 6000,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' steps';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-green-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-green-600">8,029</span> / Target: 10,000 steps</p>
                    </div>
                  </Card>

                  {/* Sleep Chart */}
                  <Card className="p-4 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Sleep</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [7.5, 6.8, 7.2, 6.5, 7.0, 7.8, 7.4],
                              backgroundColor: '#3b82f6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Min Target',
                              data: [7, 7, 7, 7, 7, 7, 7],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            },
                            {
                              label: 'Max Target',
                              data: [9, 9, 9, 9, 9, 9, 9],
                              type: 'line',
                              borderColor: '#cbd5e1',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 5,
                              max: 10,
                              ticks: {
                                font: { size: 10 },
                                color: '#64748b',
                                callback: function(value: any) {
                                  return value + 'h';
                                }
                              },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + ' hrs';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-blue-600">7.2 hrs</span> / Target: 7-9 hrs</p>
                    </div>
                  </Card>

                  {/* Calories Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Calories Consumed</h4>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [2100, 1950, 2200, 1800, 1850, 2000, 1900],
                              backgroundColor: '#10b981',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [2200, 2200, 2200, 2200, 2200, 2200, 2200],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 1500,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + ' cal';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-green-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-green-600">1,971 cal</span> / Target: 2,200 cal</p>
                    </div>
                  </Card>

                  {/* Protein Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Protein</h4>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [150, 142, 165, 135, 142, 148, 145],
                              backgroundColor: '#f59e0b',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [165, 165, 165, 165, 165, 165, 165],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 100,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-amber-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-amber-600">147g</span> / Target: 165g</p>
                    </div>
                  </Card>

                  {/* Carbs Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Carbs</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [210, 185, 220, 175, 185, 195, 190],
                              backgroundColor: '#3b82f6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [220, 220, 220, 220, 220, 220, 220],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 150,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-blue-600">194g</span> / Target: 220g</p>
                    </div>
                  </Card>

                  {/* Fat Chart */}
                  <Card className="p-4 mb-10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Fat</h4>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [70, 60, 73, 55, 60, 65, 62],
                              backgroundColor: '#8b5cf6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [73, 73, 73, 73, 73, 73, 73],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 40,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-purple-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-purple-600">64g</span> / Target: 73g</p>
                    </div>
                  </Card>
                </div>
              )}

          {timeRange === "block" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Training Volume Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Weekly Training Volume</h4>
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [22500, 23100, 23800, 24500, 25200, null],
                              backgroundColor: '#ec4899',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [25000, 25000, 25000, 25000, 25000, 25000],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 20000,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' kg';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-pink-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-pink-600">23,820 kg</span> / Target: 25,000 kg</p>
                    </div>
                  </Card>

                  {/* Steps Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Daily Steps</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [7800, 8100, 8500, 8029, 8300, null],
                              backgroundColor: '#10b981',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [10000, 10000, 10000, 10000, 10000, 10000],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 7000,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' steps/day';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-green-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-green-600">8,146</span> / Target: 10,000 steps</p>
                    </div>
                  </Card>

                  {/* Sleep Chart */}
                  <Card className="p-4 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Sleep</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Activity</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [7.8, 7.5, 7.0, 7.2, 7.4, null],
                              backgroundColor: '#3b82f6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Min Target',
                              data: [7, 7, 7, 7, 7, 7],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            },
                            {
                              label: 'Max Target',
                              data: [9, 9, 9, 9, 9, 9],
                              type: 'line',
                              borderColor: '#cbd5e1',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 6,
                              max: 10,
                              ticks: {
                                font: { size: 10 },
                                color: '#64748b',
                                callback: function(value: any) {
                                  return value + 'h';
                                }
                              },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + ' hrs';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-blue-600">7.4 hrs</span> / Target: 7-9 hrs</p>
                    </div>
                  </Card>

                  {/* Calories Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Calories Consumed</h4>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [2050, 2100, 1980, 1971, 2020, null],
                              backgroundColor: '#10b981',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [2200, 2200, 2200, 2200, 2200, 2200],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 1800,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + ' cal';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-green-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-green-600">2,024 cal</span> / Target: 2,200 cal</p>
                    </div>
                  </Card>

                  {/* Protein Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Protein Consumed</h4>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [145, 152, 143, 147, 150, null],
                              backgroundColor: '#f59e0b',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [165, 165, 165, 165, 165, 165],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 130,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-amber-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-amber-600">147g</span> / Target: 165g</p>
                    </div>
                  </Card>

                  {/* Carbs Chart */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Carbohydrates Consumed</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [205, 215, 190, 194, 200, null],
                              backgroundColor: '#3b82f6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [220, 220, 220, 220, 220, 220],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 180,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-blue-600">201g</span> / Target: 220g</p>
                    </div>
                  </Card>

                  {/* Fat Chart */}
                  <Card className="p-4 mb-10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Average Fats Consumed</h4>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">Nutrition</Badge>
                    </div>
                    <div className="h-48">
                      <Bar
                        data={{
                          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                          datasets: [
                            {
                              label: 'Actual',
                              data: [68, 70, 62, 64, 67, null],
                              backgroundColor: '#8b5cf6',
                              borderRadius: 4,
                              barPercentage: 0.6
                            },
                            {
                              label: 'Target',
                              data: [73, 73, 73, 73, 73, 73],
                              type: 'line',
                              borderColor: '#94a3b8',
                              borderWidth: 2,
                              borderDash: [5, 5],
                              pointRadius: 0,
                              fill: false
                            }
                          ] as any
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 55,
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { color: '#e2e8f0' }
                            },
                            x: {
                              ticks: { font: { size: 10 }, color: '#64748b' },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#1e293b',
                              bodyColor: '#475569',
                              borderColor: '#e2e8f0',
                              borderWidth: 1,
                              padding: 8,
                              displayColors: true,
                              titleFont: { size: 11 },
                              bodyFont: { size: 11 },
                              callbacks: {
                                label: function(context: any) {
                                  return context.dataset.label + ': ' + context.parsed.y + 'g';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="text-center mt-2 p-2 bg-purple-50 rounded">
                      <p className="text-xs text-slate-600">Avg: <span className="font-bold text-purple-600">66g</span> / Target: 73g</p>
                    </div>
                  </Card>
                </div>
              )}
        </motion.div>
      </div>
    </div>
  );
}
