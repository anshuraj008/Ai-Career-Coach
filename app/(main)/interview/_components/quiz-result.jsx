"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
  onCancel,
}) {
  if (!result) return null;

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title font-black mb-6 px-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full h-2 bg-zinc-900 border border-white/5 rounded-full" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
            <p className="font-medium text-primary text-sm mb-1">Improvement Tip:</p>
            <p className="text-muted-foreground text-xs leading-relaxed">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground">Question Review</h3>
          {result.questions.map((q, index) => (
            <div key={index} className="border border-white/5 bg-zinc-950/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm text-foreground leading-snug">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-semibold text-foreground">Your answer:</span> {q.userAnswer}</p>
                {!q.isCorrect && <p><span className="font-semibold text-foreground">Correct answer:</span> {q.answer}</p>}
              </div>
              <div className="text-xs bg-zinc-900/40 border border-white/5 p-3 rounded-lg space-y-1">
                <p className="font-bold text-primary">Explanation:</p>
                <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 mt-4 border-t border-white/5 pt-4">
          <Button onClick={onStartNew} className="w-full rounded-xl font-bold py-5">
            Start New Quiz
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="w-full rounded-xl font-bold py-5 border-white/5 hover:bg-white/5 transition-all">
              Back to Dashboard
            </Button>
          )}
        </CardFooter>
      )}
    </div>
  );
}
