"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDemoNavigation } from "@/hooks/use-demo-navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface WorkoutChange {
  type: "removed" | "added" | "modified";
  exerciseName: string;
  details?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    type?: "injury_detection" | "plan_adjustment" | "substitution" | "motivation";
    workoutChanges?: WorkoutChange[];
  };
}

export default function AIChatDemo() {
  useDemoNavigation('chat');
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! Ready for your workout today? You've got Upper Body Strength on the schedule. How are you feeling?",
      timestamp: new Date(Date.now() - 600000),
    },
    {
      id: "2",
      role: "user",
      content: "I'm feeling good but my shoulder has been bothering me a bit",
      timestamp: new Date(Date.now() - 540000),
    },
    {
      id: "3",
      role: "assistant",
      content: "Thanks for letting me know. Can you tell me more about the shoulder pain? When did it start and what movements make it worse?",
      timestamp: new Date(Date.now() - 480000),
      metadata: { type: "injury_detection" },
    },
    {
      id: "4",
      role: "user",
      content: "Started yesterday, overhead movements feel uncomfortable",
      timestamp: new Date(Date.now() - 420000),
    },
    {
      id: "5",
      role: "assistant",
      content: "I understand. I'm going to adjust today's workout to avoid overhead pressing movements. I've replaced Overhead Press with Landmine Press which keeps your shoulder in a safer range of motion. I've also notified your trainer Sarah about this change for review.\n\nYour modified workout is ready when you are!",
      timestamp: new Date(Date.now() - 360000),
      metadata: {
        type: "plan_adjustment",
        workoutChanges: [
          {
            type: "removed",
            exerciseName: "Overhead Tricep Extension",
            details: "Removed due to shoulder discomfort"
          },
          {
            type: "added",
            exerciseName: "Landmine Press",
            details: "3 sets × 10-12 @ 25kg"
          }
        ]
      },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    const userInput = inputValue.toLowerCase();
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      // Detect equipment issues
      if (userInput.includes("barbell") || userInput.includes("equipment")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "No problem! I've updated your workout to replace exercises that require a barbell with dumbbell alternatives. These will target the same muscle groups effectively.",
          timestamp: new Date(),
          metadata: {
            type: "plan_adjustment",
            workoutChanges: [
              {
                type: "removed",
                exerciseName: "Barbell Bench Press",
                details: "Requires barbell"
              },
              {
                type: "added",
                exerciseName: "Dumbbell Bench Press",
                details: "4 sets × 6-8 @ 35kg ea."
              }
            ]
          },
        };
      }
      // Detect time constraints
      else if (userInput.includes("30 minutes") || userInput.includes("shorter") || userInput.includes("time")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've condensed your workout to fit in 30 minutes by reducing rest times and combining exercises into supersets. You'll still hit all the key muscle groups!",
          timestamp: new Date(),
          metadata: {
            type: "plan_adjustment",
            workoutChanges: [
              {
                type: "modified",
                exerciseName: "All Exercises",
                details: "Rest times reduced to 60s"
              },
              {
                type: "removed",
                exerciseName: "Cable Flyes",
                details: "Removed to save time"
              }
            ]
          },
        };
      }
      // Detect nutrition questions
      else if (userInput.includes("calories") || userInput.includes("nutrition") || userInput.includes("eat")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Based on your goals and today's Upper Body workout, your calorie target is 2,400 calories with the following macronutrient split:\n\n• Protein: 180g (30%)\n• Carbs: 300g (50%)\n• Fat: 53g (20%)\n\nSince you're training today, make sure to get adequate protein and carbs for recovery!",
          timestamp: new Date(),
          metadata: { type: "motivation" },
        };
      }
      // Default motivational response
      else {
        const responses = [
          "That's great! Let's keep that momentum going. Remember to focus on your breathing during the heavier sets.",
          "I've logged that for you. Your trainer will be proud of your consistency!",
          "Perfect timing! Your body is adapting well to the progressive overload. Keep it up!",
        ];

        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          metadata: { type: "motivation" },
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case "injury_detection":
        return <Badge variant="destructive" className="text-xs mb-1">🚨 Injury Alert</Badge>;
      case "plan_adjustment":
        return <Badge className="text-xs mb-1 bg-blue-600">✏️ Plan Modified</Badge>;
      case "substitution":
        return <Badge variant="secondary" className="text-xs mb-1">🔄 Exercise Swap</Badge>;
      case "motivation":
        return <Badge variant="outline" className="text-xs mb-1">💪 Encouragement</Badge>;
      default:
        return null;
    }
  };

  const WorkoutChangesCard = ({ changes }: { changes: WorkoutChange[] }) => {
    return (
      <Link href="/demo/workout" className="block no-underline">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>📋</span>
                Workout Changes
              </h4>
              <Badge variant="outline" className="text-xs bg-white">
                {changes.length} {changes.length === 1 ? "change" : "changes"}
              </Badge>
            </div>
            <div className="space-y-2">
              {changes.map((change, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {change.type === "removed" && (
                    <>
                      <span className="text-red-600 flex-shrink-0 mt-0.5">−</span>
                      <div className="flex-1">
                        <span className="line-through text-slate-600">{change.exerciseName}</span>
                        {change.details && (
                          <span className="text-slate-500 ml-1">· {change.details}</span>
                        )}
                      </div>
                    </>
                  )}
                  {change.type === "added" && (
                    <>
                      <span className="text-green-600 flex-shrink-0 mt-0.5">+</span>
                      <div className="flex-1">
                        <span className="font-medium text-slate-900">{change.exerciseName}</span>
                        {change.details && (
                          <span className="text-slate-600 ml-1">· {change.details}</span>
                        )}
                      </div>
                    </>
                  )}
                  {change.type === "modified" && (
                    <>
                      <span className="text-blue-600 flex-shrink-0 mt-0.5">~</span>
                      <div className="flex-1">
                        <span className="font-medium text-slate-900">{change.exerciseName}</span>
                        {change.details && (
                          <span className="text-slate-600 ml-1">· {change.details}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">Tap to view full workout</span>
              <span className="text-blue-600">→</span>
            </div>
          </Card>
        </motion.div>
      </Link>
    );
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
          <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex-none border-b bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
              AI
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI Coach</h3>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className={`flex-none h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600"
                        : "bg-gradient-to-br from-slate-600 to-slate-800"
                    }`}
                  >
                    {message.role === "assistant" ? "AI" : "U"}
                  </motion.div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[70%] ${message.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    {message.metadata?.type && (
                      <motion.div
                        initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {getMessageBadge(message.metadata.type)}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </motion.div>
                    {message.metadata?.workoutChanges && message.metadata.workoutChanges.length > 0 && (
                      <WorkoutChangesCard changes={message.metadata.workoutChanges} />
                    )}
                    <span className="text-xs text-slate-500 mt-1 px-2">
                      {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Invisible element at the end to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-none border-t bg-white px-4 py-3 pb-10">
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 px-6">
              Send
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("I don't have access to a barbell today")}
              className="text-xs"
            >
              🏋️ Equipment Issue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("Can you make today's workout shorter? I only have 30 minutes")}
              className="text-xs"
            >
              ⏱️ Time Constraint
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("How many calories should I eat today?")}
              className="text-xs"
            >
              🍽️ Nutrition Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
