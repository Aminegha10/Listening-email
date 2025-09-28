"use client";
import React, { useState } from "react";
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
  PolarAngleAxis,
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
  Crown,
  User,
  ArrowDownRight,
} from "lucide-react";

import { Label, PolarRadiusAxis } from "recharts";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "./ui/tooltip";
import { useGetClientsQuery } from "@/features/dataApi";
import { useGetTopSalesAgentQuery } from "@/features/dataApi";
import { Riple } from "react-loading-indicators";

export const description = "A radial chart with text";

// const weeklyRevenueData = [
//   { day: "Monday", revenue: 1200, shortDay: "Mon" },
//   { day: "Tuesday", revenue: 1800, shortDay: "Tue" },
//   { day: "Wednesday", revenue: 1600, shortDay: "Wed" },
//   { day: "Thursday", revenue: 2100, shortDay: "Thu" },
//   { day: "Friday", revenue: 2400, shortDay: "Fri" },
//   { day: "Saturday", revenue: 1900, shortDay: "Sat" },
//   { day: "Sunday", revenue: 1500, shortDay: "Sun" },
// ];

// const agentOrdersData = [
//   { name: "Sales Agent1", orders: 2.1 },
//   { name: "Sales Agent2", orders: 1.8 },
//   { name: "Sales Agent3", orders: 1.5 },
// ];

// const areaChartData = [
//   { month: "Jan", sales: 400 },
//   { month: "Feb", sales: 300 },
//   { month: "Mar", sales: 600 },
//   { month: "Apr", sales: 800 },
//   { month: "May", sales: 500 },
//   { month: "Jun", sales: 900 },
// ];

// const revenueData = [
//   { metric: "revenue", value: 85, fill: "var(--color-revenue)" },
// ];

// const revenueConfig = {
//   value: {
//     label: "Revenue",
//   },
//   revenue: {
//     label: "Weekly Revenue",
//     color: "var(--chart-3)",
//   },
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-background border border-border rounded-lg shadow-lg p-3">
//         <p className="text-sm font-medium">{data.day}</p>
//         <p className="text-sm text-blue-600">
//           Revenue: ${payload[0].value.toLocaleString()}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const customerData = [
//   { month: "Jan", new: 45, returning: 78 },
//   { month: "Feb", new: 52, returning: 85 },
//   { month: "Mar", new: 48, returning: 92 },
//   { month: "Apr", new: 61, returning: 88 },
//   { month: "May", new: 55, returning: 95 },
//   { month: "Jun", new: 67, returning: 102 },
// ];

// const performanceData = [
//   { name: "Completion Rate", value: 85, fill: "#10b981" },
//   { name: "Remaining", value: 15, fill: "#e5e7eb" },
// ];

// const pieChartData = [
//   { name: "Product A", value: 35, color: "#10b981" },
//   { name: "Product B", value: 25, color: "#3b82f6" },
//   { name: "Product C", value: 15, color: "#f59e0b" },
//   { name: "Product D", value: 10, color: "#ef4444" },
//   { name: "Product E", value: 8, color: "#8b5cf6" },
//   { name: "Others", value: 7, color: "#6b7280" },
// ];

// const topClients = [
//   { name: "Maitre meunier", revenue: "$0", avatar: "MM", badge: "Daily" },
//   { name: "Anir pro", revenue: "$0", avatar: "AP", badge: "Daily" },
//   { name: "Tech Solutions", revenue: "$1,250", avatar: "TS", badge: "Weekly" },
//   { name: "Global Corp", revenue: "$2,100", avatar: "GC", badge: "Monthly" },
// ];

// const recentOrders = [
//   {
//     id: "1442",
//     client: "maitre meunier",
//     price: "$0.00",
//     agent: "Sales Agent1",
//     products: "5 Items",
//     status: "Viewent",
//   },
//   {
//     id: "1446",
//     client: "anir pro",
//     price: "$0.00",
//     agent: "Sales Agent1",
//     products: "3 Items",
//     status: "unknown",
//   },
//   {
//     id: "1448",
//     client: "tech solutions",
//     price: "$1,250.00",
//     agent: "Sales Agent2",
//     products: "8 Items",
//     status: "Completed",
//   },
// ];

// Mock data - replace with your actual API call topSalesAgents
// Fetch top sales agent

// const totalVisitors = chartData[0].desktop + chartData[0].mobile;

const ThreeCardSection = () => {
  const [goal, setGoal] = useState(120);

  const {
    data: clients,
    isLoading,
    isError,
  } = useGetClientsQuery({ filter: "revenue", goal });
  const {
    data: topAgentData,
    isLoading: topAgentLoading,
    isError: topAgentError,
  } = useGetTopSalesAgentQuery();
  const topAgent = topAgentData?.topAgent;
  console.log(clients);
  const chartClientData = [
    {
      name: "Progress",
      value: clients?.progress,
      fill: "var(--chart-5)", // main progress color
    },
  ];
  const chartClientConfig = {
    Progress: {
      label: "Progress",
      color: "var(--chart-5)",
    },
  };

  // SalesAgentCharts
  const chartSalesAgentData = [
    { agent: "contribution", percentage: topAgent?.percentage ?? 0 },
  ];

  const chartSalesAgentConfig = {
    percentage: {
      label: "Contribution",
      color: "var(--chart-3)",
    },
  };
  return (
    <>
      {/* Weekly Revenue card of threecards */}
      {/* <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Weekly Revenue
            </CardTitle>
          </div>
          <DollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="pb-3 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="text-3xl font-extrabold">
              ${(20000 / 1000).toFixed(1)}K
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-2 text-xs mt-1 cursor-help ${
                      false ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      {false ? "+" : ""}
                      20% this week
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Based on last week</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
      </Card> */}

      {/* Performance Metrics */}
      <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--chart-5)] rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Goal Progress
            </CardTitle>
          </div>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Riple
                color="var(--color-primary)"
                size="medium"
                text=""
                textColor=""
              />
            </div>
          ) : isError ? (
            <>errors</>
          ) : (
            <>
              <ChartContainer
                config={chartClientConfig}
                className="mx-auto aspect-square max-h-[180px]"
              >
                <RadialBarChart
                  data={chartClientData}
                  startAngle={90}
                  endAngle={450}
                  innerRadius={60}
                  outerRadius={85}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[70, 60]}
                  />
                  <RadialBar
                    dataKey="value"
                    background
                    clockWise
                    cornerRadius={8}
                    fill={chartClientConfig.Progress.color}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
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
                                {clients.progress}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 18}
                                className="fill-muted-foreground text-xs"
                              >
                                Complete
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
              {/* Client Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Current Clients</span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium">
                    {clients?.totalClients} / {goal}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Remaining to goal</span>
                  <span className="font-medium">
                    {goal - clients?.totalClients} clients
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--chart-3)] rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Top Sales Agent
            </CardTitle>
          </div>
          <Crown className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {topAgentLoading ? (
            <div className="flex justify-center items-center py-12">
              <Riple
                color="var(--color-primary)"
                size="medium"
                text=""
                textColor=""
              />
            </div>
          ) : topAgentError ? (
            <div className="flex items-center justify-center h-[180px]">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-sm text-muted-foreground">
                  Failed to load data
                </p>
              </div>
            </div>
          ) : (
            <>
              <ChartContainer
                config={chartSalesAgentConfig}
                className="mx-auto aspect-square max-h-[180px]"
              >
                <RadialBarChart
                  data={chartSalesAgentData}
                  startAngle={90}
                  endAngle={450}
                  innerRadius={60}
                  outerRadius={85}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[70, 60]}
                  />
                  <RadialBar
                    dataKey="percentage"
                    background
                    clockWise
                    cornerRadius={8}
                    fill={chartSalesAgentConfig.percentage.color} // <-- dynamically from config
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
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
                                {topAgent?.percentage ?? 0}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 18}
                                className="fill-muted-foreground text-xs"
                              >
                                Contribution
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {topAgent?.name || "N/A"}
                    </span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total Sales</span>
                  <span className="font-medium">
                    ${topAgent?.totalSales?.toLocaleString?.() || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Out of {topAgent?.totalAgents ?? 0} agents</span>
                  <span className="font-medium">#{1}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm mx-auto p-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--chart-4)] rounded-full"></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              New Clients Today
            </CardTitle>
          </div>
          <Users className="h-4 w-4 text-emerald-500" />
        </CardHeader>

        <CardContent className="flex flex-col flex-1 items-center justify-center text-center">
          {/* You can replace this with your API data */}
          <div className="text-3xl font-extrabold text-emerald-600">
            {clients?.newClientsToday ?? 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            New clients registered today
          </p>

          {/* growth indicator */}
          <div className="flex items-center gap-1 mt-2">
            {clients?.growthRate >= 0 ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">
                  +{clients?.growthRate ?? 0}% vs yesterday
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-rose-500" />
                <span className="text-xs text-rose-500">
                  {clients?.growthRate ?? 0}% vs yesterday
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { ThreeCardSection };
