"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-16 relative overflow-hidden">
      {/* Decorative gradient glow behind hero */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-[50%] w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="space-y-8 text-center max-w-5xl mx-auto px-4 relative z-10">
        <div className="space-y-6 mx-auto">
          {/* Introducing badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-1.5 text-xs text-primary shadow-inner hover:bg-primary/10 transition-colors cursor-default">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">Your Ultimate AI Career Guide</span>
          </div>

          <h1 className="text-5xl font-black md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none gradient-title animate-gradient pb-4">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[650px] text-muted-foreground md:text-xl leading-relaxed">
            Advance your career with personalized guidance, mock interview prep, and
            ATS-optimized tools designed for professional growth.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 font-bold text-sm tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview Image with glowing frame */}
        <div className="hero-image-wrapper mt-12 md:mt-16">
          <div 
            ref={imageRef} 
            className="hero-image rounded-2xl border border-white/10 bg-slate-950 p-1 md:p-2 shadow-[0_0_50px_rgba(255,255,255,0.03)] hover:shadow-[0_0_60px_rgba(255,255,255,0.06)] transition-shadow duration-500 mx-auto max-w-5xl"
          >
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl border border-white/5 mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
