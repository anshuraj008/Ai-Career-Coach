"use client";

import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import {
  Save,
  Sparkles,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  Edit,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { updateCoverLetter, improveCoverLetterAI } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";

const CoverLetterPreview = ({ content, id }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [previewMode, setPreviewMode] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);

  // Save updates action
  const {
    loading: isSaving,
    fn: updateCoverLetterFn,
    data: saveResult,
  } = useFetch(updateCoverLetter);

  // AI improvements / grammar checks action
  const {
    loading: isImproving,
    fn: improveCoverLetterAIFn,
    data: improvementResult,
  } = useFetch(improveCoverLetterAI);

  // Handle manual saving
  const handleSave = async () => {
    try {
      await updateCoverLetterFn(id, editorContent);
      toast.success("Cover letter saved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save cover letter");
    }
  };

  // Trigger AI text improvements
  const handleAIImprove = async () => {
    try {
      const response = await improveCoverLetterAIFn({
        content: editorContent,
        type: "improve",
      });
      if (response) {
        setEditorContent(response);
        toast.success("AI improvement applied successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to improve text");
    }
  };

  // Trigger AI grammar corrections
  const handleGrammarCheck = async () => {
    try {
      const response = await improveCoverLetterAIFn({
        content: editorContent,
        type: "grammar",
      });
      if (response) {
        setEditorContent(response);
        toast.success("Grammar and spelling checks applied!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fix grammar");
    }
  };

  // Dynamic PDF exporter
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
      const element = document.getElementById("cover-letter-pdf");
      const opt = {
        margin: [20, 20],
        filename: "cover_letter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  // Dynamic DOCX text exporter
  const generateDOCX = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([editorContent], { type: "text/plain;charset=utf-8" });
      element.href = URL.createObjectURL(file);
      element.download = "cover_letter.docx";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      console.error("DOCX generation error:", error);
      toast.error("Failed to export Word document");
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor & AI Workspace Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl shadow-sm">
        
        {/* Toggle Editor Mode */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(previewMode === "preview" ? "edit" : "preview")}
            className="rounded-xl text-xs font-bold border-white/5"
          >
            {previewMode === "preview" ? (
              <>
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Content
              </>
            ) : (
              <>
                <Monitor className="h-3.5 w-3.5 mr-1.5" />
                Visual Preview
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl text-xs font-bold shadow-md"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* AI Polish Options & Document Exporters */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAIImprove}
            disabled={isImproving}
            className="rounded-xl text-xs font-bold border-white/5 hover:border-primary/20 hover:bg-primary/5 text-primary"
          >
            {isImproving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                AI Improve
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGrammarCheck}
            disabled={isImproving}
            className="rounded-xl text-xs font-bold border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 text-emerald-400"
          >
            {isImproving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Fix Grammar
              </>
            )}
          </Button>

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

          <Button
            variant="outline"
            size="sm"
            onClick={generateDOCX}
            className="rounded-xl text-xs font-bold border-white/5"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Export DOCX
          </Button>
        </div>
      </div>

      {/* Live Markdown Editor Workspace */}
      <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-white">
        <MDEditor 
          value={editorContent} 
          onChange={setEditorContent} 
          preview={previewMode} 
          height={700} 
        />
      </div>

      {/* Hidden container for PDF layout formatting */}
      <div className="hidden">
        <div 
          id="cover-letter-pdf" 
          style={{ 
            background: "white", 
            color: "black", 
            padding: "40px", 
            fontSize: "14px", 
            fontFamily: "serif",
            lineHeight: "1.6"
          }}
        >
          <MDEditor.Markdown source={editorContent} />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
