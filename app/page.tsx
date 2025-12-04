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
  const [showClickIndicator, setShowClickIndicator] = useState(true);

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

    // Hide click indicator after 6 seconds
    const timer = setTimeout(() => {
      setShowClickIndicator(false);
    }, 6000);

    return () => clearTimeout(timer);
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
      <section className="relative pt-32 pb-12 md:pb-20 px-4">
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
              className="border-2 border-slate-500 bg-slate-800/50 text-slate-100 hover:bg-white hover:border-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
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
      <section id="demo" className="min-h-screen flex flex-col items-center justify-center pb-12 pt-4 md:pt-0">
        {/* Section Header - Mobile */}
        <div className="w-full text-center md:hidden mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Interactive Demo
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">
              Experience TrainerAI
            </h2>
            <p className="text-slate-400 text-sm">
              Swipe through key features
            </p>
          </motion.div>
        </div>

        {/* Section Header - Desktop */}
        <div className="w-full text-center hidden md:block mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-2">
              Interactive Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              See It In Action
            </h2>
            <p className="text-slate-400">
              Click through the features on the phone mockup ↓
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start max-w-7xl mx-auto">
            {/* iPhone Mockup - Left Side (Hidden on Mobile) */}
            <div className="hidden md:flex justify-center lg:justify-end lg:sticky lg:top-8 relative">
              {/* Interactive Demo Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-50"
              >
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Live Interactive Demo
                  </motion.span>
                </Badge>
              </motion.div>

              <div className="relative group">
                <IPhoneMockup>
                  <iframe
                    src={`/demo/${currentPage}?title=${encodeURIComponent(title)}&clientName=${encodeURIComponent(clientName)}`}
                    className="w-full h-full border-0 pt-7 pb-5 cursor-pointer"
                    title="Interactive Demo - Click to interact"
                  />
                </IPhoneMockup>
              </div>
            </div>

            {/* Dynamic Content - Right Side */}
            <div className="space-y-6 lg:pl-8 flex items-center md:min-h-screen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {/* Mobile Card Layout */}
                  <div className="md:hidden bg-slate-800/50 border border-slate-700 rounded-3xl p-6 mb-6">
                    <Badge variant="secondary" className="mb-4">
                      Feature {currentIndex + 1} of {sectionKeys.length}
                    </Badge>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                      {activeSection.title}
                    </h2>
                    <p className="text-base text-slate-300 mb-6">
                      {activeSection.description}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {activeSection.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 text-slate-200 text-sm"
                        >
                          <span className="text-green-400 text-base">✓</span>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => window.open(`/demo/${currentPage}?title=${encodeURIComponent(title)}&clientName=${encodeURIComponent(clientName)}`, '_blank')}
                    >
                      Try Demo Feature →
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="md:hidden flex items-center justify-between mb-8 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(sectionKeys[Math.max(0, currentIndex - 1)])}
                      disabled={currentIndex === 0}
                      className="border-slate-600 text-slate-900 bg-white hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </Button>

                    <div className="flex gap-2">
                      {sectionKeys.map((key, idx) => (
                        <button
                          key={key}
                          onClick={() => setCurrentPage(key)}
                          className={`${
                            currentPage === key
                              ? "w-8 h-2 bg-slate-300"
                              : "w-2 h-2 bg-slate-600"
                          } rounded-full transition-all duration-300 cursor-pointer`}
                          aria-label={`View ${sections[key].title}`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(sectionKeys[Math.min(sectionKeys.length - 1, currentIndex + 1)])}
                      disabled={currentIndex === sectionKeys.length - 1}
                      className="border-slate-600 text-slate-900 bg-white hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </Button>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
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
                  </div>

                  {/* Demo Navigation Dots */}
                  <div className="hidden md:flex items-center gap-3 mt-8">
                    <span className="text-sm text-slate-400 font-medium">Try each feature:</span>
                    <div className="flex gap-2">
                      {sectionKeys.map((key, idx) => (
                        <button
                          key={key}
                          onClick={() => setCurrentPage(key)}
                          className={`group relative ${
                            currentPage === key
                              ? "w-8 h-3"
                              : "w-3 h-3"
                          } rounded-full transition-all duration-300 cursor-pointer`}
                          aria-label={`View ${sections[key].title}`}
                        >
                          <div
                            className={`w-full h-full rounded-full transition-all ${
                              currentPage === key
                                ? "bg-slate-300 hover:bg-slate-300"
                                : "bg-slate-600 hover:bg-slate-500"
                            }`}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {sections[key].title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="hidden md:flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(sectionKeys[Math.max(0, currentIndex - 1)])}
                      disabled={currentIndex === 0}
                      className="border-slate-600 text-slate-900 bg-white hover:bg-slate-800 hover:text-white disabled:opacity-50"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(sectionKeys[Math.min(sectionKeys.length - 1, currentIndex + 1)])}
                      disabled={currentIndex === sectionKeys.length - 1}
                      className="border-slate-600 text-slate-900 bg-white hover:bg-slate-800 hover:text-white disabled:opacity-50"
                    >
                      Next →
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
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
                £35<span className="text-lg font-normal text-white/80">/month</span>
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
                £69<span className="text-lg font-normal text-slate-600">/month</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-white">
            <div>
              <div className="text-4xl font-bold mb-2">3-5x</div>
              <div className="text-white/80">More Clients Per Trainer</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">AI Support Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          

          <div className="pt-0 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 TrainerAI. All rights reserved.
            </p>
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
