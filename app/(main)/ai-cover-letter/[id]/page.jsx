import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col space-y-4 mb-6">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-primary hover:text-primary/80 font-semibold text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="space-y-1">
          <h1 className="font-extrabold tracking-tight gradient-title text-3xl md:text-4xl">
            {coverLetter?.jobTitle} <span className="text-muted-foreground font-normal text-lg">at</span> {coverLetter?.companyName}
          </h1>
          <p className="text-sm text-muted-foreground">
            View and edit your AI generated cover letter.
          </p>
        </div>
      </div>

      <CoverLetterPreview content={coverLetter?.content} id={id} />
    </div>
  );
}
