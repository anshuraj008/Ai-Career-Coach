import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Brain,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-20 md:py-28 lg:py-36 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl gradient-title pb-3 animate-gradient">
              Elevate Your Career with AI intelligence
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Explore powerful, specialized tools designed to streamline your job search and boost professional success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-white/5 bg-zinc-950/40 backdrop-blur-md hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500 transform hover:-translate-y-2 group rounded-2xl overflow-hidden"
              >
                <CardContent className="pt-8 pb-8 px-6 text-center flex flex-col items-center h-full justify-between">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 p-4 rounded-2xl bg-muted/40 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300 shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 bg-zinc-950/40 backdrop-blur-md border-y border-white/5 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { num: "50+", label: "Industries Covered" },
              { num: "1000+", label: "Interview Questions" },
              { num: "95%", label: "Success Rate" },
              { num: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center space-y-2 group p-4 rounded-2xl hover:bg-muted/10 transition-colors duration-300"
              >
                <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary group-hover:scale-105 transition-transform duration-300">
                  {stat.num}
                </h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 md:py-28 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              How It Works
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Four simple steps to accelerate your career growth with intelligent guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-5 p-6 rounded-2xl bg-zinc-950/20 border border-white/5 hover:border-primary/20 transition-all duration-300 relative group"
              >
                <span className="absolute top-4 right-6 text-5xl font-black text-white/5 group-hover:text-primary/10 transition-colors duration-300">
                  {`0${index + 1}`}
                </span>
                <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300 shadow-md">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 md:py-28 bg-zinc-950/30 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl gradient-title pb-3">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Hear from professionals who unlocked their potential and landed their dream roles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((test, index) => (
              <Card
                key={index}
                className="bg-zinc-950/40 border border-white/5 hover:border-primary/20 transition-all duration-300 rounded-2xl flex flex-col justify-between"
              >
                <CardContent className="pt-8 pb-8 px-6 flex flex-col justify-between h-full space-y-6">
                  <blockquote className="text-muted-foreground text-sm md:text-base leading-relaxed italic relative">
                    <span className="text-4xl text-primary/20 absolute -top-4 -left-3 font-serif">
                      &ldquo;
                    </span>
                    {test.quote}
                    <span className="text-4xl text-primary/20 absolute -bottom-4 font-serif">
                      &rdquo;
                    </span>
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        width={48}
                        height={48}
                        src={test.image}
                        alt={test.author}
                        className="rounded-full object-cover border-2 border-primary/25"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{test.author}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {test.role}
                      </p>
                      <p className="text-xs text-primary font-semibold">
                        {test.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 md:py-28 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 rounded-full px-3 py-1 text-xs text-primary mb-2">
              <HelpCircle className="h-3 w-3" />
              <span>Questions?</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Find answers to common questions about our AI-powered career coach platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-zinc-950/20 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-white/5 last:border-b-0 py-1"
                >
                  <AccordionTrigger className="text-left font-semibold text-base hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-10 px-4">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl bg-zinc-950/80 border border-white/5 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-20 px-6 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl max-w-2xl leading-tight">
              Ready to Accelerate Your Career Success?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg leading-relaxed">
              Join thousands of professionals who are advancing their careers with intelligent, tailored AI coaching.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                className="h-12 px-8 font-bold text-sm tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
