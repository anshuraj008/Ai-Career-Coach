"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

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
      setActiveTab("preview");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-6 max-w-5xl mx-auto px-4 md:px-0 py-4">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="font-extrabold tracking-tight gradient-title text-4xl md:text-5xl">
            Resume Builder
          </h1>
          <p className="text-sm text-muted-foreground">
            Create an ATS-optimized, professional resume with AI enhancements.
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
        <TabsList className="grid w-full grid-cols-2 max-w-[320px] mb-8 p-1 bg-slate-950/80 border border-white/5 rounded-xl shadow-inner">
          <TabsTrigger 
            value="edit"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-primary transition-all duration-300 font-semibold py-2 text-xs"
          >
            Form Fields
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-primary transition-all duration-300 font-semibold py-2 text-xs"
          >
            Markdown Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
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
                    className="rounded-xl border-white/5 bg-slate-950/50"
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
                    className="rounded-xl border-white/5 bg-slate-950/50"
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
                    className="rounded-xl border-white/5 bg-slate-950/50"
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
                    className="rounded-xl border-white/5 bg-slate-950/50"
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
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
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
                    className="h-32 rounded-xl border-white/5 bg-slate-950/50 leading-relaxed"
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
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
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
                    className="h-32 rounded-xl border-white/5 bg-slate-950/50 leading-relaxed"
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
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
              <div className="border-b border-white/5 pb-4 mb-4">
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

            {/* Education */}
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
              <div className="border-b border-white/5 pb-4 mb-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">Education</h3>
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

            {/* Projects */}
            <div className="space-y-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
              <div className="border-b border-white/5 pb-4 mb-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">Projects</h3>
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
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="text-primary hover:text-primary/80 font-semibold p-0 flex items-center gap-1.5"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume Markdown
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Visual Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-4 gap-3 items-center border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 rounded-2xl mb-4 max-w-fit">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 animate-bounce" />
              <span className="text-xs font-semibold leading-relaxed">
                Caution: You will lose any manual markdown edits if you modify and save the Form Fields again.
              </span>
            </div>
          )}
          <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-white">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                  padding: "20px",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
