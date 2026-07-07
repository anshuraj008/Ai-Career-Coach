import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="font-extrabold tracking-tight gradient-title text-4xl md:text-5xl">
            My Cover Letters
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your generated cover letters and application documents.
          </p>
        </div>
        <Link href="/ai-cover-letter/new">
          <Button className="rounded-xl px-5 font-bold shadow-md hover:scale-105 active:scale-95 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
