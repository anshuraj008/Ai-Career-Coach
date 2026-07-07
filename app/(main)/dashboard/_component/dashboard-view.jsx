"use client";

import React from "react";
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

const DashboardView = ({ insights }) => {
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
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Decorative gradient glow top background */}
      <div className="absolute top-0 right-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Market Insights</h2>
          <p className="text-xs text-muted-foreground">Real-time industry overview and salary analytics.</p>
        </div>
        <Badge variant="outline" className="rounded-xl border-white/5 text-[10px] font-bold px-3 py-1 flex items-center gap-1">
          <Calendar className="h-3 w-3 text-primary/60" />
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Outlook Card */}
        <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
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
        <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
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
        <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
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
        <Card className="group relative border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
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
      <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
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
                        <div className="bg-slate-950 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
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
        <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
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
        <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
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
                <Badge key={skill} variant="outline" className="rounded-xl border-white/5 text-xs font-semibold py-1 px-3 bg-slate-950/20 hover:border-primary/20 hover:bg-slate-950/50 transition-colors cursor-default">
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
