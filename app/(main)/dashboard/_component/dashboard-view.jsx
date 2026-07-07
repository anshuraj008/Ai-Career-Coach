"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Calendar,
  Sparkles,
  DollarSign,
  Compass,
  Edit2,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industries } from "@/data/industries";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser, downgradeToFree } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import Link from "next/link";

const DashboardView = ({ insights, initialProfile, isPremium }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Parse initial user values back to form defaults
  const parsedProfile = useMemo(() => {
    if (!initialProfile?.industry) return null;
    const parts = initialProfile.industry.split("-");
    const industryId = parts[0];
    const subIndustryFormatted = parts.slice(1).join("-");

    const matchedIndustry = industries.find((ind) => ind.id === industryId);
    const matchedSubIndustry = matchedIndustry?.subIndustries.find(
      (sub) => sub.toLowerCase().replace(/ /g, "-") === subIndustryFormatted
    );

    return {
      industry: industryId,
      subIndustry: matchedSubIndustry || "",
      experience: initialProfile.experience?.toString() || "0",
      skills: initialProfile.skills?.join(", ") || "",
      bio: initialProfile.bio || "",
    };
  }, [initialProfile]);

  const [selectedIndustry, setSelectedIndustry] = useState(() => {
    if (!parsedProfile) return null;
    return industries.find((ind) => ind.id === parsedProfile.industry) || null;
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: parsedProfile || {
      industry: "",
      subIndustry: "",
      experience: "0",
      skills: "",
      bio: "",
    },
  });

  // Watch industry field to filter specializations
  const watchIndustry = watch("industry");

  // Reset form when profile updates
  useEffect(() => {
    if (parsedProfile) {
      reset(parsedProfile);
      setSelectedIndustry(
        industries.find((ind) => ind.id === parsedProfile.industry) || null
      );
    }
  }, [parsedProfile, reset]);

  const {
    loading: isUpdating,
    fn: updateUserFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUser);

  // Process profile updates
  const onProfileSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  // Handle server update result
  useEffect(() => {
    if (updateResult && !isUpdating) {
      toast.success("Profile and Market Insights updated!");
      setOpen(false);
      router.refresh();
    }
    if (updateError) {
      toast.error(updateError.message || "Failed to update profile");
    }
  }, [updateResult, updateError, isUpdating]);

  const {
    loading: isDowngrading,
    fn: downgradeToFreeFn,
    data: downgradeResult,
    error: downgradeError,
  } = useFetch(downgradeToFree);

  const handleDowngrade = async () => {
    try {
      await downgradeToFreeFn();
    } catch (error) {
      console.error("Downgrade error:", error);
    }
  };

  useEffect(() => {
    if (downgradeResult?.success && !isDowngrading) {
      toast.success("Downgraded to Free plan.");
      router.refresh();
    }
    if (downgradeError) {
      toast.error(downgradeError.message || "Failed to downgrade plan");
    }
  }, [downgradeResult, downgradeError, isDowngrading]);

  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
      case "medium":
        return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
      case "low":
        return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
      default:
        return "bg-slate-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500 bg-amber-500/5 border-amber-500/10" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500 bg-rose-500/5 border-rose-500/10" };
      default:
        return { icon: LineChart, color: "text-slate-500 bg-slate-500/5 border-slate-500/10" };
    }
  };

  const outlookInfo = getMarketOutlookInfo(insights.marketOutlook);
  const OutlookIcon = outlookInfo.icon;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd MMM yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 relative">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Market Insights</h2>
          <p className="text-xs text-muted-foreground">Real-time industry overview and salary analytics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="rounded-xl border-white/5 text-[10px] font-bold px-3 py-1 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-primary/60" />
            Last updated: {lastUpdatedDate}
          </Badge>

          {isPremium ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDowngrade}
              disabled={isDowngrading}
              className="rounded-xl font-bold border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs shadow-sm h-8"
            >
              {isDowngrading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Downgrading...
                </>
              ) : (
                "Downgrade to Free"
              )}
            </Button>
          ) : (
            <Link href="/checkout">
              <Button size="sm" className="rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs h-8">
                Upgrade to Premium
              </Button>
            </Link>
          )}

          {/* Edit Profile Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl font-semibold shadow-md gap-1.5 hover:scale-105 active:scale-95 transition-all text-xs">
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border border-white/10 bg-zinc-950 max-h-[90vh] overflow-y-auto w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="gradient-title text-2xl font-bold">Edit Profile Details</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update your target industry, experience, and profile details to customize your coaching experience.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4 pt-2">
                
                {/* Industry Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-industry" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry</Label>
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setSelectedIndustry(industries.find((ind) => ind.id === val) || null);
                          setValue("subIndustry", "");
                        }}
                      >
                        <SelectTrigger id="edit-industry" className="rounded-xl border-white/5 bg-zinc-900/50">
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10">
                          <SelectGroup>
                            <SelectLabel>Industries</SelectLabel>
                            {industries.map((ind) => (
                              <SelectItem key={ind.id} value={ind.id}>
                                {ind.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.industry && (
                    <p className="text-xs text-red-500">{errors.industry.message}</p>
                  )}
                </div>

                {/* Specialization Selection */}
                {watchIndustry && (
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-specialization" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Specialization</Label>
                    <Controller
                      name="subIndustry"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="edit-specialization" className="rounded-xl border-white/5 bg-zinc-900/50">
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            <SelectGroup>
                              <SelectLabel>Specializations</SelectLabel>
                              {selectedIndustry?.subIndustries.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.subIndustry && (
                      <p className="text-xs text-red-500">{errors.subIndustry.message}</p>
                    )}
                  </div>
                )}

                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-experience" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of Experience</Label>
                  <Input
                    id="edit-experience"
                    type="number"
                    min="0"
                    max="50"
                    className="rounded-xl border-white/5 bg-zinc-900/50"
                    placeholder="e.g. 5"
                    {...register("experience")}
                  />
                  {errors.experience && (
                    <p className="text-xs text-red-500">{errors.experience.message}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-skills" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</Label>
                  <Input
                    id="edit-skills"
                    className="rounded-xl border-white/5 bg-zinc-900/50"
                    placeholder="e.g., Python, JavaScript, Project Management"
                    {...register("skills")}
                  />
                  <span className="text-[10px] text-muted-foreground leading-relaxed block">
                    Separate multiple skills with commas
                  </span>
                  {errors.skills && (
                    <p className="text-xs text-red-500">{errors.skills.message}</p>
                  )}
                </div>

                {/* Professional Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-bio" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Professional Bio</Label>
                  <Textarea
                    id="edit-bio"
                    className="h-24 rounded-xl border-white/5 bg-zinc-900/50 leading-relaxed"
                    placeholder="Tell us about your professional background..."
                    {...register("bio")}
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl text-xs font-bold border-white/5">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating} className="rounded-xl text-xs font-bold">
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Outlook Card */}
        <Card className="group relative border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Outlook</CardTitle>
            <div className={`p-2 rounded-xl border ${outlookInfo.color}`}>
              <OutlookIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground font-medium">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        {/* Industry Growth Card */}
        <Card className="group relative border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry Growth</CardTitle>
            <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="h-1.5 rounded-full" />
          </CardContent>
        </Card>

        {/* Demand Level Card */}
        <Card className="group relative border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demand Level</CardTitle>
            <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
              <BriefcaseIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">{insights.demandLevel}</div>
            <div
              className={`h-1.5 w-full rounded-full ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        {/* Top Skills Card */}
        <Card className="group relative border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Skills</CardTitle>
            <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
              <Brain className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-2 rounded-lg font-semibold bg-muted/40">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">Salary Ranges by Role</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Displaying minimum, median, and maximum annual salaries (in Thousands USD)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6 md:px-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  dx={-10}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                          <div className="space-y-1">
                            {payload.map((item) => (
                              <p key={item.name} className="text-xs font-semibold flex items-center justify-between gap-4">
                                <span className="text-muted-foreground">{item.name}:</span>
                                <span className="text-primary">${item.value}K</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="rgba(255, 255, 255, 0.15)" radius={[4, 4, 0, 0]} name="Min Salary" />
                <Bar dataKey="median" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Median Salary" />
                <Bar dataKey="max" fill="rgba(255, 255, 255, 0.4)" radius={[4, 4, 0, 0]} name="Max Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Industry Trends */}
        <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <Compass className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-lg font-bold tracking-tight text-foreground">Key Industry Trends</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Current trends shaping this industry sector
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 md:px-8 flex-1">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 mt-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4 bg-zinc-950/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-lg font-bold tracking-tight text-foreground">Recommended Skills</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Skills you should consider developing next
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 md:px-8 flex-1">
            <div className="flex flex-wrap gap-2.5">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-xl border-white/5 text-xs font-semibold py-1 px-3 bg-zinc-950/20 hover:border-primary/20 hover:bg-zinc-950/50 transition-colors cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
