import { getAssessments } from "@/actions/interview";
import { currentUser } from "@clerk/nextjs/server";
import InterviewContainer from "./_components/interview-container";

const quotes = [
  "Your career growth is a compounding effect of daily consistent practice.",
  "Consistent preparation is the key to unlocking major product-based tech roles.",
  "Every mock interview question you solve bridges the gap to your dream offer.",
  "Challenge yourself today. Engineering mastery is built one concept at a time.",
  "Believe in your technical skill. Absolute confidence comes from preparation.",
];

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const user = await currentUser();
  const userName = user?.firstName || "Professional";
  const isPremium = user?.publicMetadata?.plan === "premium";

  // Select a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Calculate some simple streak statistics
  const streak = assessments?.length ? Math.min(assessments.length, 5) : 0;
  const overallAvg = assessments?.length 
    ? (assessments.reduce((acc, current) => acc + current.quizScore, 0) / assessments.length).toFixed(0) 
    : 0;

  return (
    <InterviewContainer
      assessments={assessments}
      userName={userName}
      randomQuote={randomQuote}
      streak={streak}
      overallAvg={overallAvg}
      isPremium={isPremium}
    />
  );
}
