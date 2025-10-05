"use client";

import {
  ArrowUpFromLine as ChartNoAxesCombined,
  ChevronDown,
  Download,
  FileJson,
  FileText,
  Funnel,
  Sheet,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetLeadStatsQuery } from "@/features/dataApi";
import { ThreeDot } from "react-loading-indicators";
import { useState } from "react";
import { useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { exportChartPDF, exportToPDF } from "@/utils/exportUtils";

// Weekday abbreviations (two-letter)
const weekDayAbbr = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

// Month abbreviations (two-letter)
const monthAbbr = {
  January: "Ja",
  February: "Fe",
  March: "Ma",
  April: "Ap",
  May: "My",
  June: "Ju",
  July: "Jl",
  August: "Au",
  September: "Se",
  October: "Oc",
  November: "No",
  December: "De",
};

// Week number abbreviations for "thisMonth" range
const weekAbbr = {
  week1: "W1",
  week2: "W2",
  week3: "W3",
  week4: "W4",
  week5: "W5",
};

export function SaleAreaChart({ timeRange }) {
  const chartRef = useRef(null); // <-- add this
  const [agentFilter, setAgentFilter] = useState("all");

  // Function to format X-axis ticks based on screen size
  const formatTick = (value) => {
    if (typeof window !== "undefined") {
      // Only abbreviate for small screens
      if (timeRange === "thisWeek") {
        return weekDayAbbr[value] || value;
      } else if (timeRange === "thisMonth") {
        return weekAbbr[value] || value;
      } else if (timeRange === "currentYear" && window.innerWidth > 640) {
        return monthAbbr[value] || value;
      }
    }
    return value; // For larger screens, show full label
  };
  const {
    data: leadStats,
    isLoading,
    error,
  } = useGetLeadStatsQuery({
    salesAgent: agentFilter !== "all" ? agentFilter : undefined,
    timeRange,
    type: "orders",
  });

  console.log(leadStats);
  // Determine chart data based on timeRange
  let chartData = [];
  if (timeRange === "thisWeek") {
    chartData =
      leadStats?.salesData?.map((item) => ({
        label: item.day,
        sales: item.sales,
      })) || [];
  } else if (timeRange === "thisMonth") {
    chartData =
      leadStats?.salesData?.map((item) => ({
        label: item.week,
        sales: item.sales,
      })) || [];
  } else if (timeRange === "currentYear") {
    chartData =
      leadStats?.salesData?.map((item) => ({
        label: item.month,
        sales: item.sales,
      })) || [];
  }
  console.log(chartData);
  const chartConfig = {
    sales: {
      label: "Sales",
      color: "var(--primary)",
    },
  };
  // Handler for export options
  const handleExportPDF = () => {
    if (!chartData || chartData.length === 0) return;

    exportToPDF(chartData, timeRange, "Sales", null, chartRef.current);
  };
  // export as canva
  // const handleExportChartPDF = () => {
  //   if (!chartData || chartData.length === 0) return;

  //   exportChartPDF(chartRef);
  // };

  return (
    <Card
      className="dark:border-2 border-0 shadow:sm  dark:bg-[var(--card)] bg-white/50 backdrop-blur-sm"
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <CardHeader className="px-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              <ChartNoAxesCombined className="h-5 w-5 text-primary dark:text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground tracking-tight">
                Sales Analytics
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {timeRange === "thisWeek"
                  ? "Sales performance this Week"
                  : timeRange === "thisMonth"
                  ? "Sales performance this Month"
                  : "Sales performance this Year"}
              </p>
            </div>
            {/* Export dropdown */}
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
                >
                  <Download className="h-4 w-4" />
                  <span className="sm:inline hidden">Export</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem onClick={handleExportCSV}>
                  Export as CSV{" "}
                  <Sheet className="text-green-500 stroke-[2px]" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  Export as JSON{" "}
                  <FileJson className="text-yellow-500 stroke-[2px]" />
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleExportPDF}>
                  Export as PDF
                  <FileText className="text-[#f32b2b] stroke-[2px]" />
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleExportChartPDF}>
                  Export Chart as PDF
                  <FileText className="text-[#f32b2b] stroke-[2px]" />
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <ThreeDot
                variant="pulsate"
                color="var(--primary)"
                size="medium"
              />
              <p className="text-sm text-gray-500">Loading sales data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChartNoAxesCombined className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">
                Error loading sales data
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <div className="mt-2" ref={chartRef}>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--foreground)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  interval={0}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={formatTick} //this is the format of the value
                />
                <ChartTooltip
                  cursor={{
                    stroke: "var(--secondary)",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="bg-white text-black dark:bg-gray-800 dark:text-white backdrop-blur-sm border border-border shadow-md"
                    />
                  }
                />
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--chart-1)"
                      stopOpacity="0.4"
                    />
                    <stop
                      offset="60%"
                      stopColor="var(--chart-1)"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-1)"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="sales"
                  type="monotone"
                  fill="url(#salesGradient)"
                  fillOpacity={0.8}
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "var(--primary)",
                    strokeWidth: 2,
                    fill: "var(--primary)",
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {!isLoading && !error && chartData.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChartNoAxesCombined className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">
                No sales data available
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Data will appear here once available
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pt-0 pb-6">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium text-gray-900">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-700 font-semibold">+5.2%</span>
              </div>
              <span>growth this month</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              <Users className="h-3.5 w-3.5" />
              <span>January - June 2024</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
