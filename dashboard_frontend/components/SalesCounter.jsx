"use client";

import {
  ArrowUpFromLine as ChartNoAxesCombined,
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

export const description = "A simple area chart";

export function SalesCounter() {
  // API request
  const { data: leadStats, isLoading, error } = useGetLeadStatsQuery();

  // Map API data to chart format
  const chartData =
    leadStats?.salesByMonth.map((item) => ({
      month: item.month,
      sales: item.sales,
    })) || [];

  const chartConfig = {
    sales: {
      label: "Sales",
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
                Sales Analytics
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Monthly sales performance overview
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <ThreeDot
                variant="pulsate"
                color="hsl(var(--primary))"
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
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "hsl(var(--secondary))",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="bg-muted/80 text-foreground backdrop-blur-sm border border-border shadow-md"
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
                    <stop offset="0%" stopColor="#00bca2" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#00bca2" stopOpacity="0.2" />
                    <stop
                      offset="100%"
                      stopColor="#00bca2"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="sales"
                  type="monotone"
                  fill="url(#salesGradient)"
                  fillOpacity={0.8}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ fill: "teal", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "teal",
                    strokeWidth: 2,
                    fill: "teal",
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
