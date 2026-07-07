"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Sparkles, BrainCircuit, CheckCircle, HelpCircle } from "lucide-react";

export default function Quiz({ config = {} }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  useEffect(() => {
    if (config && Object.keys(config).length > 0 && !hasStarted) {
      setHasStarted(true);
      generateQuizFn(config);
    }
  }, [config, hasStarted]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn(config);
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <BarLoader className="mt-4" width={"100%"} color="hsl(var(--primary))" />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">
          Generating customized questions...
        </p>
      </div>
    );
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2 border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="text-center py-8 border-b border-white/5 bg-slate-950/20 flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-primary/5 border border-primary/10 mb-2">
            <BrainCircuit className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent className="py-8 px-6 md:px-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            This quiz contains 10 technical questions tailored specific to your registered industry and expertise. Take your time and choose the best answers.
          </p>
        </CardContent>
        <CardFooter className="bg-slate-950/20 px-6 py-4 flex justify-center border-t border-white/5">
          <Button onClick={() => generateQuizFn(config)} className="w-full max-w-sm rounded-xl py-6 font-bold shadow-md hover:scale-105 transition-all">
            Start AI Mock Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2 border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Question {currentQuestion + 1} of {quizData.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quizData.length) * 100)}% Complete</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-900 border border-white/5 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 px-6 md:px-8">
        <p className="text-lg font-bold tracking-tight text-foreground leading-snug">{question.question}</p>
        
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="grid grid-cols-1 gap-3"
        >
          {question.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === option;
            return (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected 
                    ? "border-primary bg-primary/5 text-foreground shadow-sm" 
                    : "border-white/5 bg-slate-950/20 text-muted-foreground hover:bg-slate-900/30 hover:border-white/10"
                }`}
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                }`}>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-slate-950" />}
                </div>
                <Label htmlFor={`option-${index}`} className="text-sm font-semibold cursor-pointer leading-relaxed w-full">
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-6 p-5 bg-slate-900/40 border border-white/5 rounded-xl space-y-2 animate-fade-in">
            <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Explanation
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/5 bg-slate-950/20 px-6 py-4">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
            className="rounded-xl border-white/5 text-xs font-semibold"
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto rounded-xl px-6 font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          {savingResult && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
