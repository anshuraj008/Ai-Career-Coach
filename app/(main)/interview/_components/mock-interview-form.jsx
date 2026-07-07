"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Camera,
  CameraOff,
  Mic,
  Keyboard,
  Briefcase,
  Layers,
  Clock,
  Building,
  Target,
  ArrowRight,
} from "lucide-react";

export default function MockInterviewForm() {
  const router = useRouter();
  const [role, setRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState("30 Mins");
  const [companyType, setCompanyType] = useState("Product-based");
  const [mode, setMode] = useState("Text");
  const [camera, setCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const params = new URLSearchParams({
      role,
      experienceLevel,
      difficulty,
      duration,
      companyType,
      mode,
      camera: camera.toString(),
    });
    
    router.push(`/interview/mock?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Select */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            Target Role / Position
          </Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend developer, Product Manager"
            className="rounded-xl border-white/5 bg-zinc-950/50"
            required
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Experience Level
          </Label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-white/5 bg-zinc-950/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="Entry-Level">Entry-Level / Graduate</option>
            <option value="Mid-Level">Mid-Level (2-5 years)</option>
            <option value="Senior">Senior (5-8 years)</option>
            <option value="Lead/Manager">Lead / Manager (8+ years)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" />
            Difficulty Level
          </Label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-white/5 bg-zinc-950/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Interview Duration
          </Label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-white/5 bg-zinc-950/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="15 Mins">15 Mins (Fast Track)</option>
            <option value="30 Mins">30 Mins (Standard)</option>
            <option value="45 Mins">45 Mins (Detailed)</option>
            <option value="60 Mins">60 Mins (Comprehensive)</option>
          </select>
        </div>

        {/* Company Type */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-primary" />
            Company Profile
          </Label>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-white/5 bg-zinc-950/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="Startup">Early-Stage / Growth Startup</option>
            <option value="Product-based">Mid-Sized Product-based Company</option>
            <option value="Service-based">Service-based Enterprise</option>
            <option value="FAANG">FAANG / Big Tech Giant</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Voice/Text toggle */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Interview Mode
          </Label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("Text")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "Text"
                  ? "bg-zinc-800 text-foreground shadow-inner"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Keyboard className="h-4 w-4" />
              Chat / Text
            </button>
            <button
              type="button"
              onClick={() => setMode("Voice")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "Voice"
                  ? "bg-zinc-800 text-foreground shadow-inner"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mic className="h-4 w-4" />
              Voice Mode
            </button>
          </div>
        </div>

        {/* Camera toggle */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Camera Option
          </Label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setCamera(false)}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                !camera
                  ? "bg-zinc-800 text-foreground shadow-inner"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CameraOff className="h-4 w-4" />
              Camera Off
            </button>
            <button
              type="button"
              onClick={() => setCamera(true)}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                camera
                  ? "bg-zinc-800 text-foreground shadow-inner"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Camera className="h-4 w-4" />
              Camera On
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl px-8 shadow-md font-bold group hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {isSubmitting ? (
            "Launching..."
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-primary-foreground group-hover:scale-110 transition-transform" />
              Start AI Mock Interview
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
