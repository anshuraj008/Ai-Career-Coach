"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles, Building, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [template, setTemplate] = useState("Formal");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // Update content when letter is generated
  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn({ ...data, template });
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  const templates = ["Formal", "Modern", "Creative", "Tech-focused"];

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[25%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="space-y-1 pb-4 border-b border-white/5">
        <h1 className="font-extrabold tracking-tight gradient-title text-4xl md:text-5xl">
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate an engaging, role-specific cover letter using your profile information.
        </p>
      </div>

      <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/20">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Building className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Provide details about the company and job description you're applying for.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-6 md:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    placeholder="e.g. Google"
                    className="rounded-xl border-white/5 bg-slate-950/50"
                    {...register("companyName")}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title</Label>
                <div className="relative">
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Frontend Engineer"
                    className="rounded-xl border-white/5 bg-slate-950/50"
                    {...register("jobTitle")}
                  />
                </div>
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the full job description or key requirements here to tailor the letter..."
                className="h-44 rounded-xl border-white/5 bg-slate-950/50 leading-relaxed"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Cover Letter Template Style
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {templates.map((t) => {
                  const isSelected = template === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTemplate(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-sm scale-[1.03]"
                          : "border-white/5 bg-slate-950/20 text-muted-foreground hover:bg-slate-900/30 hover:border-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={generating}
                className="rounded-xl px-8 shadow-md font-bold tracking-wide transition-all duration-300 group hover:scale-105 active:scale-95"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-primary-foreground group-hover:scale-110 transition-transform" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
