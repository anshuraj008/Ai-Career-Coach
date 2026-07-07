"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2, Calendar, FileText, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className="border border-dashed border-white/10 bg-slate-950/20 rounded-2xl py-12 text-center">
        <CardHeader className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-primary/5 border border-primary/10">
            <FileText className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">No Cover Letters Yet</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 max-w-sm">
              Generate your first ATS-optimized, personalized cover letter to get started on your application.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      {coverLetters.map((letter) => (
        <Card 
          key={letter.id} 
          className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/25 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  {letter.jobTitle}
                  <span className="text-muted-foreground font-normal text-xs">at</span>
                  {letter.companyName}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <Calendar className="h-3 w-3 text-primary/60" />
                  Created {format(new Date(letter.createdAt), "MMM dd, yyyy")}
                </CardDescription>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 relative z-10">
                <AlertDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-slate-900 rounded-lg transition-colors"
                    onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border border-white/10 bg-slate-950">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-bold text-foreground">Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete your cover letter for **{letter.jobTitle}** at **{letter.companyName}**.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                      >
                        Delete Permanent
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-muted-foreground text-xs leading-relaxed line-clamp-4 border-t border-white/5 pt-4">
              {letter.jobDescription || "No job description provided."}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                className="text-xs border-white/5 rounded-xl flex items-center gap-1 group/btn"
              >
                View Full Letter
                <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
