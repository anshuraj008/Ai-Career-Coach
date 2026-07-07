// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {entries.map((item, index) => (
          <div
            key={index}
            className="relative p-6 border border-white/5 rounded-2xl bg-slate-950/30 hover:border-primary/20 hover:bg-slate-950/50 transition-all duration-300 group flex items-start justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h4 className="text-base font-bold tracking-tight text-foreground">
                  {item.title} <span className="text-muted-foreground font-normal">at</span> {item.organization}
                </h4>
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pt-1">
                {item.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
              onClick={() => handleDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {isAdding && (
        <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <PlusCircle className="h-5 w-5 text-primary animate-pulse" />
              Add {type} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title / Position</label>
                <Input
                  placeholder="e.g. Software Engineer"
                  className="rounded-xl border-white/5 bg-slate-950/50"
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization / Company</label>
                <Input
                  placeholder="e.g. Google"
                  className="rounded-xl border-white/5 bg-slate-950/50"
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                <Input
                  type="month"
                  className="rounded-xl border-white/5 bg-slate-950/50"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                <Input
                  type="month"
                  className="rounded-xl border-white/5 bg-slate-950/50"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900/30 border border-white/5 rounded-xl p-3 max-w-fit">
              <input
                type="checkbox"
                id="current"
                className="h-4 w-4 rounded border-white/10 text-primary focus:ring-primary"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                Currently working/studying here
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
              <Textarea
                placeholder={`Describe your key achievements, responsibilities, and technologies used...`}
                className="h-32 rounded-xl border-white/5 bg-slate-950/50 leading-relaxed"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all group"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Improving description...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary group-hover:scale-110 transition-transform" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-white/5 bg-slate-950/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/5"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="rounded-xl" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full h-11 border-dashed border-white/10 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-300 rounded-xl"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2 animate-bounce" />
          Add New {type}
        </Button>
      )}
    </div>
  );
}
