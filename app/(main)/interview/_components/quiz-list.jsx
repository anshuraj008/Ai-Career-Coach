"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { Calendar, Trophy, ArrowRight, HelpCircle } from "lucide-react";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Review your performance logs and improvement paths.
              </CardDescription>
            </div>
            <Button 
              onClick={() => router.push("/interview/mock")}
              className="rounded-xl px-5 font-bold text-xs tracking-wider uppercase group hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Start New Quiz
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6 md:px-8">
          <div className="space-y-4">
            {!assessments?.length ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No quiz history available yet. Start your first mock quiz above!
              </div>
            ) : (
              assessments.map((assessment, i) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer border border-white/5 bg-slate-950/20 hover:bg-slate-950/40 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden group shadow-sm flex flex-col md:flex-row md:items-center justify-between p-6 gap-4"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary/10 transition-colors">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <h4 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        Quiz #{assessments.length - i}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        Score: {assessment.quizScore.toFixed(1)}%
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(assessment.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                      </span>
                    </div>
                    {assessment.improvementTip && (
                      <p className="text-xs text-muted-foreground/80 italic leading-relaxed pt-1 line-clamp-2 max-w-2xl">
                        💡 {assessment.improvementTip}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold self-start md:self-center border-white/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    View Breakdown
                  </Button>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8">
          <DialogHeader className="border-b border-white/5 pb-4 mb-4">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Quiz Breakdown Details
            </DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <QuizResult
              result={selectedQuiz}
              hideStartNew
              onStartNew={() => router.push("/interview/mock")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
