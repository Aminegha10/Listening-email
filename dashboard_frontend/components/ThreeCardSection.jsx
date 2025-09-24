"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  Tooltip as RechartsTooltip, // ✅ rename Tooltip from recharts
} from "recharts";
import {
  ShoppingCart,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  ArrowUpRight,
  Users,
  Target,
} from "lucide-react";

import { Label, PolarRadiusAxis } from "recharts";

export const description = "A radial chart with text";

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
};

const weeklyRevenueData = [
  { day: "Monday", revenue: 1200, shortDay: "Mon" },
  { day: "Tuesday", revenue: 1800, shortDay: "Tue" },
  { day: "Wednesday", revenue: 1600, shortDay: "Wed" },
  { day: "Thursday", revenue: 2100, shortDay: "Thu" },
  { day: "Friday", revenue: 2400, shortDay: "Fri" },
  { day: "Saturday", revenue: 1900, shortDay: "Sat" },
  { day: "Sunday", revenue: 1500, shortDay: "Sun" },
];

const agentOrdersData = [
  { name: "Sales Agent1", orders: 2.1 },
  { name: "Sales Agent2", orders: 1.8 },
  { name: "Sales Agent3", orders: 1.5 },
];

const areaChartData = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 300 },
  { month: "Mar", sales: 600 },
  { month: "Apr", sales: 800 },
  { month: "May", sales: 500 },
  { month: "Jun", sales: 900 },
];

const revenueData = [
  { metric: "revenue", value: 85, fill: "var(--color-revenue)" },
];

const revenueConfig = {
  value: {
    label: "Revenue",
  },
  revenue: {
    label: "Weekly Revenue",
    color: "hsl(var(--chart-1))",
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{data.day}</p>
        <p className="text-sm text-blue-600">
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const customerData = [
  { month: "Jan", new: 45, returning: 78 },
  { month: "Feb", new: 52, returning: 85 },
  { month: "Mar", new: 48, returning: 92 },
  { month: "Apr", new: 61, returning: 88 },
  { month: "May", new: 55, returning: 95 },
  { month: "Jun", new: 67, returning: 102 },
];

const performanceData = [
  { name: "Completion Rate", value: 85, fill: "#10b981" },
  { name: "Remaining", value: 15, fill: "#e5e7eb" },
];

const pieChartData = [
  { name: "Product A", value: 35, color: "#10b981" },
  { name: "Product B", value: 25, color: "#3b82f6" },
  { name: "Product C", value: 15, color: "#f59e0b" },
  { name: "Product D", value: 10, color: "#ef4444" },
  { name: "Product E", value: 8, color: "#8b5cf6" },
  { name: "Others", value: 7, color: "#6b7280" },
];

const topClients = [
  { name: "Maitre meunier", revenue: "$0", avatar: "MM", badge: "Daily" },
  { name: "Anir pro", revenue: "$0", avatar: "AP", badge: "Daily" },
  { name: "Tech Solutions", revenue: "$1,250", avatar: "TS", badge: "Weekly" },
  { name: "Global Corp", revenue: "$2,100", avatar: "GC", badge: "Monthly" },
];

const recentOrders = [
  {
    id: "1442",
    client: "maitre meunier",
    price: "$0.00",
    agent: "Sales Agent1",
    products: "5 Items",
    status: "Viewent",
  },
  {
    id: "1446",
    client: "anir pro",
    price: "$0.00",
    agent: "Sales Agent1",
    products: "3 Items",
    status: "unknown",
  },
  {
    id: "1448",
    client: "tech solutions",
    price: "$1,250.00",
    agent: "Sales Agent2",
    products: "8 Items",
    status: "Completed",
  },
];

const totalVisitors = chartData[0].desktop + chartData[0].mobile;

const ThreeCardSection = () => {
  return (
    <>
      {/* Weekly Revenue Trends */}
      <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Weekly Revenue
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-3 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="text-3xl font-extrabold">$14.2K</div>
            <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% this week</span>
            </div>
          </div>

          <div className="w-full h-24 max-w-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyRevenueData}
                margin={{ top: 5, right: 8, left: 8, bottom: 5 }}
              >
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: "#3b82f6" }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Goal Progress
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[180px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={60}
              outerRadius={85}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[70, 60]}
              />
              <RadialBar dataKey="visitors" background cornerRadius={8} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {chartData[0].visitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-xs"
                          >
                            Client
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};


export { ThreeCardSection };
