"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { BarChart3 } from "lucide-react";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      // Reversing assessments array so chronologically early quizzes are on the left side
      const formattedData = [...assessments].reverse().map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="border-b border-white/5 pb-4 bg-slate-950/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Performance Trend
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Your mock quiz scores over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6 md:px-8">
        {!chartData?.length ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Not enough assessment data to generate trend.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  dx={-10} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-slate-950 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {payload[0].payload.date}
                          </p>
                          <p className="text-sm font-extrabold text-primary">
                            Score: {payload[0].value.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "hsl(var(--background))", strokeWidth: 2, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
