import { getCoverLetters } from "@/actions/cover-letter";
import { getResume } from "@/actions/resume";
import Link from "next/link";
import { Sparkles, CheckCircle, Lightbulb, TrendingUp, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";
import CoverLetterGenerator from "./_components/cover-letter-generator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();
  const resume = await getResume();
  const hasResume = !!resume;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 relative">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="space-y-1 border-b border-white/5 pb-6">
        <h1 className="font-extrabold tracking-tight gradient-title text-4xl md:text-5xl">
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Create customized, professional cover letters tailored to your target roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Generator Form & History */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Interactive Generator Form (directly integrated) */}
          <CoverLetterGenerator />

          {/* History Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Cover Letters</h2>
            </div>
            <CoverLetterList coverLetters={coverLetters} />
          </div>
        </div>

        {/* Right Column: Insights & AI Status Sidebar */}
        <div className="space-y-6">
          
          {/* Cover Letter Metrics Card */}
          <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10 flex flex-row items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold tracking-tight text-foreground">Usage Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Total Letters</span>
                <span className="text-foreground font-bold">{coverLetters.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Monthly Limits</span>
                <span className="text-emerald-500 font-bold">Unlimited</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Resume Connection Status */}
          <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10 flex flex-row items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <CardTitle className="text-sm font-bold tracking-tight text-foreground">AI Personalization</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {hasResume ? (
                <div className="space-y-3">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/10 bg-emerald-400/5 text-xs font-bold py-1 px-3 w-full justify-center rounded-xl flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Active Resume Synced
                  </Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
                    The generator reads your saved resume details to automatically customize each new cover letter.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Badge variant="outline" className="text-rose-400 border-rose-400/10 bg-rose-400/5 text-xs font-bold py-1 px-3 w-full justify-center rounded-xl flex items-center gap-1.5">
                    No Resume Uploaded
                  </Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed text-center mb-2">
                    Create a resume in the builder first to unlock highly personalized cover letters.
                  </p>
                  <Link href="/resume" className="block w-full">
                    <Button variant="outline" className="w-full text-xs font-bold border-white/5 rounded-xl">
                      Create Resume
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Writing Tips Checklist */}
          <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10 flex flex-row items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold tracking-tight text-foreground">Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Choose template styles that fit the target organization's values (Formal, Modern, etc.).</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Keep content concise and punchy to respect recruiter constraints.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Use AI Polish within the letter preview to clean grammar before sending.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
