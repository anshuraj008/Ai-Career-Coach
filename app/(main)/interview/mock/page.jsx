import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";


export default async function MockInterviewPage({ searchParams }) {
  const resolvedParams = await searchParams;

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-4">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0 text-primary hover:text-primary/80 font-semibold text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Dashboard
          </Button>
        </Link>

        <div className="pb-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight gradient-title">AI Mock Interview</h1>
          <p className="text-sm text-muted-foreground">
            Test your skills with an AI-generated session tailored to your settings.
          </p>
        </div>
      </div>

      <Quiz config={resolvedParams} />
    </div>
  );
}
