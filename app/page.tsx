"use client";

import { useState, useEffect } from "react";
import { IPhoneMockup } from "@/components/iphone-mockup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { ScheduleDemoModal } from "@/components/schedule-demo-modal";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("summary");
  const [title, setTitle] = useState<string>("ACM Training");
  const [clientName, setClientName] = useState<string>("Rory");
  const [greeting, setGreeting] = useState<string>("Good day");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

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

  const sections: Record<string, {
    id: string;
    title: string;
    description: string;
    features: string[];
  }> = {
    summary: {
      id: "summary",
      title: "Track Progress in Real-Time",
      description: "See comprehensive performance metrics, goal trajectories, and AI-powered insights that adapt to each client's unique fitness journey.",
      features: ["Performance Scoring", "Goal Tracking", "Progress Predictions", "Adaptive Metrics"],
    },
    chat: {
      id: "chat",
      title: "24/7 AI Coaching Support",
      description: "Natural language interaction with AI coach for instant guidance, injury detection, and personalized exercise substitutions—no more waiting for replies.",
      features: ["Instant Responses", "Injury Detection", "Smart Substitutions", "Motivational Support"],
    },
    workout: {
      id: "workout",
      title: "Adaptive Workout Sessions",
      description: "Real-time workout adjustments based on available equipment, injuries, or preferences. Every session is personalized to the client's current situation.",
      features: ["Equipment Alternatives", "Form Guidance", "Progress Tracking", "Real-time Adjustments"],
    },
    goal: {
      id: "goal",
      title: "Goal-Driven Training Plans",
      description: "AI creates periodized training and nutrition plans reverse-engineered from specific, measurable goals. No more generic templates.",
      features: ["Periodized Programming", "Milestone Tracking", "Nutrition Plans", "Progress Predictions"],
    },
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from same origin
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'DEMO_NAVIGATION') {
        const page = event.data.page;
        if (sections[page]) {
          setCurrentPage(page);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const activeSection = sections[currentPage];
  const sectionKeys = Object.keys(sections);
  const currentIndex = sectionKeys.indexOf(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold text-white">TrainerAI</span>
            </div>


            <div className="flex items-center gap-3">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setIsWaitlistOpen(true)}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Above the Fold */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-6 text-sm">
            AI-Powered Personal Training Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Professional Coaching{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              With AI Support & Encouragement
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Scale your coaching to 3-5x more clients while saving 10+ hours weekly. AI adapts each client's program in real-time to maximize results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Waitlist
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-500 bg-slate-800/50 text-slate-100 hover:bg-slate-700 hover:border-slate-400 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">3-5x</div>
              <div className="text-slate-400">More Clients Per Trainer</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400">AI Coaching Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10+ hrs</div>
              <div className="text-slate-400">Saved Per Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section with iPhone */}
      <section id="demo" className="min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start max-w-7xl mx-auto">
            {/* iPhone Mockup - Left Side (Hidden on Mobile) */}
            <div className="hidden md:flex justify-center lg:justify-end lg:sticky lg:top-8">
              <IPhoneMockup>
                <iframe
                  src={`/demo/${currentPage}?title=${encodeURIComponent(title)}&clientName=${encodeURIComponent(clientName)}`}
                  className="w-full h-full border-0"
                  title="Demo"
                />
              </IPhoneMockup>
            </div>

            {/* Dynamic Content - Right Side */}
            <div className="space-y-6 lg:pl-8 flex items-center min-h-screen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Badge variant="secondary" className="mb-4">
                    {`Feature`}
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {activeSection.title}
                  </h1>
                  <p className="text-xl text-slate-300 mb-8">
                    {activeSection.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {activeSection.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 text-slate-200"
                      >
                        <span className="text-green-400 text-lg">✓</span>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Demo Button */}
                  <div className="md:hidden">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => window.open(`/demo/${currentPage}?title=${encodeURIComponent(title)}&clientName=${encodeURIComponent(clientName)}`, '_blank')}
                    >
                      Open Interactive Demo
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Problem with Traditional Training Platforms
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Generic plans, static workouts, and slow responses are holding trainers back from scaling their business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generic Plans</h3>
              <p className="text-slate-400 mb-6">
                Week-by-week templates with no connection to specific, measurable goals. Clients plateau and lose motivation.
              </p>
              <div className="border-t border-slate-700 pt-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Goal-Driven AI Planning</h4>
                <p className="text-slate-300 text-sm">
                  AI generates periodized workout + nutrition plans reverse-engineered from specific goals with milestone tracking.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Static Workouts</h3>
              <p className="text-slate-400 mb-6">
                Rigid plans fail when equipment isn't available. Clients skip workouts or make poor substitutions.
              </p>
              <div className="border-t border-slate-700 pt-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Intelligent Exercise Substitution</h4>
                <p className="text-slate-300 text-sm">
                  Real-time exercise alternatives based on equipment, injuries, or preferences while maintaining training stimulus.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Slow Responses</h3>
              <p className="text-slate-400 mb-6">
                Clients wait hours or days for answers. Injuries worsen, motivation drops, and trainers can't scale.
              </p>
              <div className="border-t border-slate-700 pt-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">24/7 AI Coaching</h4>
                <p className="text-slate-300 text-sm">
                  Instant feedback, automatic plan adjustments, and motivational support with trainer oversight and approval.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Powerful AI-driven features that automate the repetitive work so you can focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                  alt="AI Planning"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Plan Generation</h3>
              <p className="text-slate-400">
                Generate periodized 4-16 week programs with integrated workout and nutrition plans in seconds. Progressive overload included.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
                  alt="Exercise Substitution"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Exercise Substitution</h3>
              <p className="text-slate-400">
                Clients get instant alternatives when equipment isn't available. AI maintains training stimulus and progression.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
                  alt="AI Coaching"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time AI Coaching</h3>
              <p className="text-slate-400">
                Natural language chat detects injuries, fatigue, and motivation issues. AI adjusts plans instantly with your oversight.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                  alt="Progress Analytics"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Progress Analytics</h3>
              <p className="text-slate-400">
                Track goal trajectories, workout adherence, and performance metrics. AI predicts goal achievement with current progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
                  alt="Nutrition Tracking"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nutrition Tracking</h3>
              <p className="text-slate-400">
                AI-assisted macro logging from natural language. Clients describe meals, AI calculates and tracks progress to targets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop"
                  alt="Health Integration"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Health Data Integration</h3>
              <p className="text-slate-400">
                Sync with Apple Health and Google Fit. Track sleep, heart rate, and activity automatically for better insights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      */}

      {/* How It Works Section */}
      <section id="how-it-works" className="pb-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Three Steps to Scale Your Business
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From goal setting to real-time coaching, our AI handles the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30" style={{ width: '66%', left: '16.5%' }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white relative z-10">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Set Client Goals</h3>
              <p className="text-slate-400">
                Define specific, measurable goals with deadlines. "Add 10kg to back squat in 6 weeks" or "Complete half marathon under 2 hours."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white relative z-10">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Generates Plans</h3>
              <p className="text-slate-400">
                AI creates periodized workout and nutrition plans with progressive overload. Review, customize, and approve before publishing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white relative z-10">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Adapt in Real-Time</h3>
              <p className="text-slate-400">
                AI coaches clients 24/7, handling injuries, equipment changes, and motivation. You oversee and approve adjustments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Forward-Thinking Trainers
            </h2>
            <p className="text-xl text-slate-300">
              Join trainers who've scaled their business with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="Trainer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="text-sm text-slate-400">Elite Performance Training</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "I went from managing 15 clients to 45 without sacrificing quality. The AI handles routine questions and adjustments, letting me focus on strategy."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Trainer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">Marcus Chen</div>
                  <div className="text-sm text-slate-400">Strength & Conditioning Coach</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "The periodization AI is incredible. It generates better programs than I used to create manually, and saves me 12+ hours every week."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                  alt="Trainer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">Alex Rivera</div>
                  <div className="text-sm text-slate-400">Online Fitness Coach</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "My clients love the instant AI coaching. They get answers immediately, stay motivated, and hit their goals faster than ever."
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-slate-400">Hours Saved/Week</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">3-5x</div>
              <div className="text-slate-400">Client Capacity</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">70%</div>
              <div className="text-slate-400">Goal Achievement</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-slate-400">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section id="pricing" className="relative bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Training Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the future of AI-powered personal training. Scale your business while maintaining the personal touch your clients love.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-slate-100 px-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer font-semibold"
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Waitlist
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-purple-600 px-8 shadow-lg hover:shadow-xl transition-all cursor-pointer font-semibold"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Schedule Demo
            </Button>
          </div>

          {/* Pricing Tiers Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $35<span className="text-lg font-normal text-white/80">/month</span>
              </div>
              <p className="text-white/80 mb-6">Perfect for solo trainers starting to scale</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> 25 clients
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> AI plan generation
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> Exercise substitution
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> Basic AI coaching
                </li>
              </ul>
            </div>

            <div className="bg-white border border-white rounded-2xl p-8 text-left relative transform md:scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">
                $69<span className="text-lg font-normal text-slate-600">/month</span>
              </div>
              <p className="text-slate-600 mb-6">For established trainers scaling their business</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-900">
                  <span className="text-green-600">✓</span> 50 clients
                </li>
                <li className="flex items-center gap-2 text-slate-900">
                  <span className="text-green-600">✓</span> Full AI autonomy
                </li>
                <li className="flex items-center gap-2 text-slate-900">
                  <span className="text-green-600">✓</span> Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-slate-900">
                  <span className="text-green-600">✓</span> Priority support
                </li>
                <li className="flex items-center gap-2 text-slate-900">
                  <span className="text-green-600">✓</span> Custom branding
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
              <div className="text-4xl font-bold text-white mb-4">
                Contact us
              </div>
              <p className="text-white/80 mb-6">For training businesses at scale</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> 150+ clients
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> White-label app
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> API access
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> Dedicated support
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-green-300">✓</span> Team features
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-white">
            <div>
              <div className="text-4xl font-bold mb-2">3-5x</div>
              <div className="text-white/80">More Clients Per Trainer</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">AI Support Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                <span className="text-xl font-bold text-white">TrainerAI</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your Professional Coaching With AI Support & Encouragement
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-slate-400 hover:text-white text-sm transition-colors">Demo</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 TrainerAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Form Modal */}
      <WaitlistForm open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />

      {/* Schedule Demo Modal */}
      <ScheduleDemoModal open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen} />
    </div>
  );
}
