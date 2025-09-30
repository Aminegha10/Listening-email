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

export const description = "A simple area chart";

export function OrdersAreaChart({ timeRange }) {
  // Filters
  // const [timeRange, setTimeRange] = useState("thisMonth");
  const [agentFilter, setAgentFilter] = useState("all");

  // API request with filters
  const {
    data: leadStats,
    isLoading,
    error,
  } = useGetLeadStatsQuery({
    salesAgent: agentFilter !== "all" ? agentFilter : undefined,
    timeRange,
    type: "orders",
  });

  // Map API data to chart format
  let chartData = [];
  if (timeRange === "currentYear") {
    chartData =
      leadStats?.ordersData?.map((item) => ({
        label: item.month,
        orders: item.orders,
      })) || [];
  } else if (timeRange === "thisMonth") {
    chartData =
      leadStats?.ordersData?.map((item) => ({
        label: item.week,
        orders: item.orders,
      })) || [];
  } else if (timeRange === "thisWeek") {
    chartData =
      leadStats?.ordersData?.map((item) => ({
        label: item.day,
        orders: item.orders,
      })) || [];
  }

  const chartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card
      className="border-0 shadow-sm bg-white/50 backdrop-blur-sm"
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <CardHeader className="px-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                Orders Analytics
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {timeRange === "thisWeek"
                  ? "Orders performance this Week"
                  : timeRange === "thisMonth"
                  ? "Orders performance this Month"
                  : "Orders performance this Year"}{" "}
              </p>
            </div>
          </div>
          {/* Right section */}
          {/* <div className="flex items-center gap-2 flex-wrap">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="min-w-[120px] h-9 bg-background border-border/60 hover:border-primary/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="min-w-[120px] h-9 bg-background border-border/60 hover:border-primary/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">Last 7 Days</SelectItem>
                <SelectItem value="thisMonth">Last 30 Days</SelectItem>
                <SelectItem value="ytd">Current Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="min-w-[140px] h-9 bg-background border-border/60 hover:border-primary/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["all", ...(stats?.allAgents || [])].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a === "all" ? "All Agents" : a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
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
              <p className="text-sm text-gray-500">Loading orders data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChartNoAxesCombined className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">
                Error loading Orders data
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <div className="mt-2">
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
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => value}
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
                      className="bg-white text-foreground backdrop-blur-sm border border-border shadow-md"
                    />
                  }
                />
                <defs>
                  <linearGradient
                    id="ordersGradient"
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
                  dataKey="orders"
                  type="monotone"
                  fill="url(#ordersGradient)"
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
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChartNoAxesCombined className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">
                No Orders data available
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
