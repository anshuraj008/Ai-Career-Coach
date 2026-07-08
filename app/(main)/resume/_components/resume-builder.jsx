"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  FileText,
  User,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  FolderGit,
  GraduationCap,
  Settings,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});
const MDEditorMarkdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.Markdown),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown, markdownToEntries } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function ResumeBuilder({ initialContent, resumeData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      internships: [],
      achievements: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  // Populate form defaults from existing markdown
  useEffect(() => {
    if (initialContent) {
      const parsedValues = markdownToEntries(initialContent);
      reset(parsedValues);
      setPreviewContent(initialContent);
    }
  }, [initialContent, reset]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
      router.refresh();
      setActiveTab("preview");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`Email: ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`Phone: ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(`LinkedIn: ${contactInfo.linkedin}`);
    if (contactInfo.twitter) parts.push(`Twitter: ${contactInfo.twitter}`);

    const fullName = user?.fullName || "Professional Profile";
    const contactRows = [];
    if (parts.length > 0) contactRows.push(parts.slice(0, 2).join(" &nbsp;&nbsp; | &nbsp;&nbsp; "));
    if (parts.length > 2) contactRows.push(parts.slice(2).join(" &nbsp;&nbsp; | &nbsp;&nbsp; "));

    return parts.length > 0
      ? `# ${fullName}\n\n${contactRows.map((row) => `<div align="center">${row}</div>`).join("\n")}
\n---`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects, certifications, internships, achievements } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(internships, "Internships"),
      entriesToMarkdown(projects, "Projects"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(certifications, "Certifications"),
      entriesToMarkdown(achievements, "Achievements"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const onSubmit = async (data) => {
    try {
      const combined = getCombinedContent();
      const formattedContent = combined
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      await saveResumeFn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // Completion Percentage calculation
  const completionPercentage = useMemo(() => {
    let score = 0;
    const { contactInfo, summary, skills, experience, education, projects, certifications, internships, achievements } = formValues;
    
    if (contactInfo?.email) score += 10;
    if (contactInfo?.mobile) score += 5;
    if (contactInfo?.linkedin) score += 5;
    if (summary && summary.trim().length > 10) score += 15;
    if (skills && skills.trim().length > 5) score += 15;
    if (experience && experience.length > 0) score += 15;
    if (education && education.length > 0) score += 15;
    if (projects && projects.length > 0) score += 10;
    if ((certifications && certifications.length > 0) || (internships && internships.length > 0) || (achievements && achievements.length > 0)) {
      score += 10;
    }
    return Math.min(score, 100);
  }, [formValues]);

  // ATS Score calculation (interactive)
  const atsScore = useMemo(() => {
    let score = 30; // base score
    const { contactInfo, summary, skills, experience, education, projects, certifications, internships, achievements } = formValues;

    if (contactInfo?.email && contactInfo?.linkedin) score += 10;
    if (summary && summary.trim().length > 30) score += 10;
    if (skills && skills.trim().split(",").length > 4) score += 10;
    if (experience && experience.length > 0) score += 15;
    if (education && education.length > 0) score += 10;
    if (projects && projects.length > 0) score += 10;
    if (certifications && certifications.length > 0) score += 5;

    const allDescriptions = [
      ...(experience || []),
      ...(projects || []),
      ...(internships || []),
    ]
      .map((e) => e.description || "")
      .join(" ");

    const hasMetrics = /[\d%]+|\b(million|billion|thousands|percent|ROI|growth)\b/i.test(allDescriptions);
    if (hasMetrics) score += 10;

    return Math.min(score, 100);
  }, [formValues]);

  // Strength Indicator calculation
  const strengthIndicator = useMemo(() => {
    if (atsScore < 50) return { label: "Weak Profile", color: "text-rose-400 border-rose-400/10 bg-rose-400/5" };
    if (atsScore < 70) return { label: "Good Profile", color: "text-amber-400 border-amber-400/10 bg-amber-400/5" };
    if (atsScore < 85) return { label: "Strong Profile", color: "text-emerald-400 border-emerald-400/10 bg-emerald-400/5" };
    return { label: "Excellent Profile", color: "text-primary border-primary/10 bg-primary/5" };
  }, [atsScore]);

  // Dynamic recommendations for user resume
  const recommendations = useMemo(() => {
    const tips = [];
    const { contactInfo, summary, skills, experience, education, projects } = formValues;

    if (!contactInfo?.linkedin) tips.push("Add your LinkedIn profile link to improve contact completeness.");
    if (!summary || summary.trim().length < 30) tips.push("Expand your Professional Summary with a brief, high-impact value proposition statement.");
    if (!skills || skills.trim().split(",").length < 5) tips.push("List at least 5 key technical or core soft skills.");
    if (!experience || experience.length === 0) tips.push("Add at least one professional work experience or internship.");
    if (!projects || projects.length === 0) tips.push("List matching academic or personal engineering projects.");

    const allDescriptions = [
      ...(experience || []),
      ...(projects || []),
    ]
      .map((e) => e.description || "")
      .join(" ");
    const hasMetrics = /[\d%]+|\b(million|billion|thousands|percent|ROI|growth)\b/i.test(allDescriptions);
    if (!hasMetrics) tips.push("Quantify achievements (e.g. 'Improved performance by 15%') in experience descriptions.");

    if (tips.length === 0) tips.push("Looking great! Your resume format complies with major ATS guidelines.");
    return tips;
  }, [formValues]);

  // Format last saved text
  const lastSavedText = useMemo(() => {
    const dateToUse = saveResult?.updatedAt || resumeData?.updatedAt;
    if (!dateToUse) return "Not saved yet";
    try {
      return format(new Date(dateToUse), "dd MMM yyyy 'at' hh:mm a");
    } catch {
      return "Just now";
    }
  }, [saveResult, resumeData]);

  return (
    <div data-color-mode="light" className="space-y-6 max-w-5xl mx-auto px-4 md:px-0 py-4 relative">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="font-extrabold tracking-tight gradient-title text-4xl md:text-5xl">
            AI Resume Builder
          </h1>
          <p className="text-sm text-muted-foreground">
            Create an ATS-optimized, professional resume with live visual checks.
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full md:w-auto">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex-1 md:flex-none shadow-md rounded-xl font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Resume
              </>
            )}
          </Button>
          <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="flex-1 md:flex-none rounded-xl font-semibold border-white/5 shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[320px] mb-8 p-1 bg-zinc-950/80 border border-white/5 rounded-xl shadow-inner">
          <TabsTrigger 
            value="edit"
            className="rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-primary transition-all duration-300 font-semibold py-2 text-xs"
          >
            Form Fields
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-primary transition-all duration-300 font-semibold py-2 text-xs"
          >
            Markdown Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left / Main form section columns */}
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Contact Information */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <Input
                        {...register("contactInfo.email")}
                        type="email"
                        placeholder="yourname@domain.com"
                        className="rounded-xl border-white/5 bg-zinc-950/50"
                        error={errors.contactInfo?.email}
                      />
                      {errors.contactInfo?.email && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mobile Number</label>
                      <Input
                        {...register("contactInfo.mobile")}
                        type="tel"
                        placeholder="e.g. +1 555-0199"
                        className="rounded-xl border-white/5 bg-zinc-950/50"
                      />
                      {errors.contactInfo?.mobile && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.mobile.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LinkedIn URL</label>
                      <Input
                        {...register("contactInfo.linkedin")}
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        className="rounded-xl border-white/5 bg-zinc-950/50"
                      />
                      {errors.contactInfo?.linkedin && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.linkedin.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Twitter/X Profile</label>
                      <Input
                        {...register("contactInfo.twitter")}
                        type="url"
                        placeholder="https://x.com/username"
                        className="rounded-xl border-white/5 bg-zinc-950/50"
                      />
                      {errors.contactInfo?.twitter && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.twitter.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Professional Summary</h3>
                  </div>
                  <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="h-32 rounded-xl border-white/5 bg-zinc-950/50 leading-relaxed"
                        placeholder="Write a compelling, impact-focused summary highlighting your value proposition..."
                        error={errors.summary}
                      />
                    )}
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-500">{errors.summary.message}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Skills</h3>
                  </div>
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="h-32 rounded-xl border-white/5 bg-zinc-950/50 leading-relaxed"
                        placeholder="e.g. Languages: JavaScript, Python. Tools: Git, Docker, Next.js. Methodologies: Agile..."
                        error={errors.skills}
                      />
                    )}
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Work Experience</h3>
                  </div>
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Experience"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-500">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Internships */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Internships</h3>
                  </div>
                  <Controller
                    name="internships"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Internship"
                        entries={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Projects */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <FolderGit className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Project Portfolio</h3>
                  </div>
                  <Controller
                    name="projects"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Project"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.projects && (
                    <p className="text-sm text-red-500">
                      {errors.projects.message}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Education Details</h3>
                  </div>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Education"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.education && (
                    <p className="text-sm text-red-500">
                      {errors.education.message}
                    </p>
                  )}
                </div>

                {/* Certifications */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Certifications & Credentials</h3>
                  </div>
                  <Controller
                    name="certifications"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Certification"
                        entries={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Awards & Achievements</h3>
                  </div>
                  <Controller
                    name="achievements"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Achievement"
                        entries={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving} className="rounded-xl px-8 shadow-md">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Submit & View Resume
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right sidebar stats and recommendation cards */}
            <div className="space-y-6">
              
              {/* ATS & Completion Stats */}
              <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl sticky top-24">
                <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10 flex flex-row items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold tracking-tight text-foreground">Resume Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  
                  {/* Strength Indicator */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Resume Strength</span>
                    <Badge variant="outline" className={`text-xs font-bold px-3 py-1 rounded-xl w-full text-center flex justify-center items-center gap-1.5 ${strengthIndicator.color}`}>
                      <Activity className="h-3.5 w-3.5" />
                      {strengthIndicator.label}
                    </Badge>
                  </div>

                  {/* Dynamic Completion Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground uppercase tracking-wider">Completion Rate</span>
                      <span className="text-primary font-bold">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2 rounded-full" />
                  </div>

                  {/* Dynamic ATS score calculation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground uppercase tracking-wider">Live ATS Score</span>
                      <span className="text-emerald-500 font-extrabold">{atsScore}/100</span>
                    </div>
                    <div className="w-full bg-zinc-900 border border-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          atsScore < 50 ? "bg-rose-500" : atsScore < 75 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${atsScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Last Saved/Updated timestamp */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Last Saved</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary/60" />
                      <span>{lastSavedText}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Recommendations checklist */}
              <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10 flex flex-row items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <CardTitle className="text-sm font-bold tracking-tight text-foreground">ATS Tips & Warnings</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-4 p-4 border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
                className="rounded-xl text-xs font-bold border-white/5"
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit Markdown
                  </>
                ) : (
                  <>
                    <Monitor className="h-3.5 w-3.5 mr-1.5" />
                    Visual Preview
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                disabled={isGenerating}
                className="rounded-xl text-xs font-bold border-white/5"
              >
                {isGenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          {resumeMode !== "preview" && (
            <div className="flex p-4 gap-3 items-center border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 rounded-2xl mb-4 max-w-fit animate-pulse">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-semibold leading-relaxed">
                Caution: You will lose any manual markdown edits if you modify and save the Form Fields again.
              </span>
            </div>
          )}

          {/* Premium Paper Canvas Mockup */}
          <div 
            key="preview-container" 
            className={`p-4 md:p-8 bg-zinc-950/20 border border-white/5 rounded-3xl flex justify-center shadow-inner overflow-x-auto ${
              resumeMode === "preview" ? "" : "hidden"
            }`}
          >
            <div
              className="resume-markdown-preview w-full max-w-[800px] min-h-[1050px] bg-white text-black pt-6 pb-10 px-8 md:pt-8 md:pb-12 md:px-14 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm prose prose-slate select-text"
              id="resume-pdf"
              style={{ fontFamily: "'Inter', sans-serif" }}
              translate="no"
            >
              <MDEditorMarkdown 
                source={previewContent || ""} 
                style={{ background: "white", color: "black" }} 
              />
            </div>
          </div>

          {/* Live Markdown Editor Box */}
          <div 
            key="editor-container" 
            className={`border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-white ${
              resumeMode !== "preview" ? "" : "hidden"
            }`} 
            translate="no"
          >
            <MDEditor
              value={previewContent || ""}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
