import { Brain, Target, Trophy, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Average Score Card */}
      <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Score</CardTitle>
          <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Trophy className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight text-foreground">{getAverageScore()}%</div>
          <p className="text-xs text-muted-foreground font-medium">
            Across all taken assessments
          </p>
        </CardContent>
      </Card>

      {/* Questions Practiced Card */}
      <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions Practiced</CardTitle>
          <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Brain className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight text-foreground">{getTotalQuestions()}</div>
          <p className="text-xs text-muted-foreground font-medium">
            Total unique review questions
          </p>
        </CardContent>
      </Card>

      {/* Latest Score Card */}
      <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Score</CardTitle>
          <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Target className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight text-foreground">
            {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Score from most recent assessment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
