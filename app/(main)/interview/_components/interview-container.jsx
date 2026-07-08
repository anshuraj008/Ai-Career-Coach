"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatsCards from "./stats-cards";
import PerformanceChart from "./performace-chart";
import QuizList from "./quiz-list";
import MockInterviewForm from "./mock-interview-form";
import Quiz from "./quiz";
import {
  BrainCircuit,
  Trophy,
  Flame,
  Calendar,
  Clock,
  Sparkles,
  Play,
  ArrowRight,
  TrendingUp,
  Lock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "HR Interview", difficulty: "Easy", duration: "15-20 min", questions: 12, completion: 80, color: "text-blue-400 bg-blue-400/5 border-blue-400/10" },
  { name: "Technical Interview", difficulty: "Medium", duration: "30-45 min", questions: 20, completion: 65, color: "text-indigo-400 bg-indigo-400/5 border-indigo-400/10" },
  { name: "Behavioral Interview", difficulty: "Medium", duration: "20-30 min", questions: 15, completion: 45, color: "text-emerald-400 bg-emerald-400/5 border-emerald-400/10" },
  { name: "System Design", difficulty: "Hard", duration: "45-60 min", questions: 10, completion: 20, color: "text-purple-400 bg-purple-400/5 border-purple-400/10" },
  { name: "DSA Practice", difficulty: "Hard", duration: "60-90 min", questions: 50, completion: 15, color: "text-rose-400 bg-rose-400/5 border-rose-400/10" },
  { name: "Frontend", difficulty: "Medium", duration: "30-40 min", questions: 25, completion: 70, color: "text-cyan-400 bg-cyan-400/5 border-cyan-400/10" },
  { name: "Backend", difficulty: "Medium", duration: "30-45 min", questions: 25, completion: 50, color: "text-amber-400 bg-amber-400/5 border-amber-400/10" },
  { name: "Full Stack", difficulty: "Hard", duration: "45-60 min", questions: 30, completion: 35, color: "text-teal-400 bg-teal-400/5 border-teal-400/10" },
  { name: "Database", difficulty: "Medium", duration: "25-30 min", questions: 15, completion: 40, color: "text-sky-400 bg-sky-400/5 border-sky-400/10" },
  { name: "Operating Systems", difficulty: "Hard", duration: "30 min", questions: 12, completion: 25, color: "text-orange-400 bg-orange-400/5 border-orange-400/10" },
  { name: "Computer Networks", difficulty: "Medium", duration: "25-30 min", questions: 15, completion: 30, color: "text-pink-400 bg-pink-400/5 border-pink-400/10" },
  { name: "OOP", difficulty: "Easy", duration: "15-20 min", questions: 10, completion: 90, color: "text-violet-400 bg-violet-400/5 border-violet-400/10" },
  { name: "Java", difficulty: "Medium", duration: "30-40 min", questions: 20, completion: 55, color: "text-red-400 bg-red-400/5 border-red-400/10" },
  { name: "JavaScript", difficulty: "Medium", duration: "25-35 min", questions: 25, completion: 75, color: "text-yellow-400 bg-yellow-400/5 border-yellow-400/10" },
  { name: "React", difficulty: "Medium", duration: "30-45 min", questions: 20, completion: 65, color: "text-teal-400 bg-teal-400/5 border-teal-400/10" },
  { name: "Node.js", difficulty: "Medium", duration: "30 min", questions: 18, completion: 50, color: "text-green-400 bg-green-400/5 border-green-400/10" },
];

export default function InterviewContainer({
  assessments = [],
  userName = "Professional",
  randomQuote = "",
  streak = 0,
  overallAvg = 0,
  isPremium = false,
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("HR Interview");
  const [activeQuizConfig, setActiveQuizConfig] = useState(null);
  
  const setupSectionRef = useRef(null);

  // Check if blocked by free tier limit
  const assessmentsCount = assessments.length;
  const isBlocked = !isPremium && assessmentsCount >= 2;

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    if (activeQuizConfig) {
      setActiveQuizConfig(null);
    }
    setupSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFormSubmit = (config) => {
    if (isBlocked) {
      router.push("/checkout");
      return;
    }
    setActiveQuizConfig(config);
  };

  const handleQuizComplete = () => {
    // Refresh Next.js server data to load new history, streak, and avg scores
    router.refresh();
  };

  const handleQuizCancel = () => {
    setActiveQuizConfig(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-0 py-4 relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-[15%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 z-10 relative">
          <div className="space-y-4 max-w-xl">
            <Badge variant="secondary" className="bg-primary/5 border border-primary/15 text-primary text-[10px] uppercase font-bold tracking-wider rounded-lg px-2.5 py-1">
              Welcome Back
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Hey, {userName}!
            </h1>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;{randomQuote}&rdquo;
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button 
                onClick={() => {
                  setupSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-xl px-5 font-bold shadow-md hover:scale-105 transition-all"
              >
                Start Mock Interview
              </Button>
              <a href="#performance">
                <Button variant="outline" className="rounded-xl px-5 font-bold border-white/5">
                  View Analytics
                </Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:w-auto w-full md:border-l border-white/5 md:pl-8">
            {/* Streak */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
              <div className="flex items-center gap-1.5">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Streak</span>
              </div>
              <div className="text-3xl font-black">{streak || 0} Days</div>
              <p className="text-[10px] text-muted-foreground">Keep it up!</p>
            </div>

            {/* Completion Progress */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Score</span>
              </div>
              <div className="text-3xl font-black">{overallAvg}%</div>
              <div className="w-20 bg-zinc-900 border border-white/5 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${overallAvg}%` }}
                />
              </div>
            </div>

            {/* Reminder */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Session</span>
              </div>
              <div className="text-sm font-bold leading-normal">Ready whenever</div>
              <p className="text-[10px] text-muted-foreground">Custom mocks active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" ref={setupSectionRef} id="mock-setup">
        {/* Left Column: Mock Setup or Quiz, Stats, and Performance Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Quiz vs Setup Form */}
          {activeQuizConfig ? (
            <Quiz 
              config={activeQuizConfig} 
              onCancel={handleQuizCancel} 
              onComplete={handleQuizComplete} 
            />
          ) : isBlocked ? (
            /* Premium Plan Lock / Upgrade Callout Card */
            <Card className="border border-purple-500/20 bg-gradient-to-br from-zinc-950 via-purple-950/10 to-zinc-950 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium Feature
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-purple-400 w-fit">
                  <Sparkles className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black text-foreground">
                    Unlock Unlimited Mock Interviews
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground max-w-md">
                    You have generated <strong>{assessmentsCount} / 2</strong> mock interviews on your Free plan. Upgrade to Premium for infinite sessions and full analytical reviews.
                  </CardDescription>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Premium Benefits
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Unlimited mock interviews.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Dynamic, detailed score diagnostics.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Customizable categories & prompts.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Real-time expert career advice.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex justify-end">
                <Link href="/checkout" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-8 py-5 shadow-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.03] transition-all">
                    <Sparkles className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            /* Regular AI Mock Setup Form Card */
            <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold tracking-tight text-foreground">AI Mock Interview</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Customize mock parameters to generate tailored coding or behavioral interviews.
                      </CardDescription>
                    </div>
                  </div>
                  {!isPremium && (
                    <Badge className="bg-zinc-900 border border-white/5 text-muted-foreground text-[10px] px-2.5 py-1">
                      {assessmentsCount} / 2 Free Mocks
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 px-6 md:px-8">
                <MockInterviewForm 
                  selectedCategory={selectedCategory} 
                  onSubmit={handleFormSubmit} 
                />
              </CardContent>
            </Card>
          )}

          {/* Performance Analytics Block */}
          <div id="performance" className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Performance Analytics</h3>
              <p className="text-xs text-muted-foreground">Check your quiz scores and performance metrics over time.</p>
            </div>
            <StatsCards assessments={assessments} />
            <PerformanceChart assessments={assessments} />
          </div>
        </div>

        {/* Right Column: Interview Categories Sidebar */}
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Interview Categories</h3>
            <p className="text-xs text-muted-foreground">Practice concept-specific multiple-choice assessments.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[820px] overflow-y-auto pr-1">
            {categories.map((cat, index) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <Card 
                  onClick={() => handleCategoryClick(cat.name)}
                  key={index}
                  className={`group relative border transition-all duration-300 rounded-xl overflow-hidden p-4 shadow-sm cursor-pointer ${
                    isSelected 
                      ? "border-primary bg-primary/5 hover:bg-primary/10" 
                      : "border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-sm tracking-tight transition-colors ${
                          isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}>
                          {cat.name}
                        </h4>
                        <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          cat.difficulty === "Easy" ? "text-emerald-400 border-emerald-400/10 bg-emerald-400/5" :
                          cat.difficulty === "Hard" ? "text-rose-400 border-rose-400/10 bg-rose-400/5" :
                          "text-amber-400 border-amber-400/10 bg-amber-400/5"
                        }`}>
                          {cat.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary/60" />
                          {cat.duration}
                        </span>
                        <span>{cat.questions} questions</span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold">
                          <span>Completion</span>
                          <span>{cat.completion}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 border border-white/5 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${cat.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="pt-6">
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
