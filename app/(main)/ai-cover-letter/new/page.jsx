import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="flex flex-col space-y-4 mb-4">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-primary hover:text-primary/80 font-semibold text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}
