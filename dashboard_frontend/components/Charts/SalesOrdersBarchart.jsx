"use client";

import { useMemo, useState } from "react";
import { useGetLeadStatsQuery } from "@/features/dataApi";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ThreeDot } from "react-loading-indicators";
import { Badge } from "../ui/badge";
import {
  ChartColumnIncreasing,
  ArrowUpFromLine as ChartNoAxesCombined,
  ChevronDown,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";

export default function SalesOrdersBarchart({ timeRange }) {
  // const [timeRange, setTimeRange] = useState("thisMonth");
  const [agentFilter, setAgentFilter] = useState("all");
  const [type, setType] = useState("sales");

  const {
    data: stats,
    isLoading,
    error,
  } = useGetLeadStatsQuery({
    salesAgent: agentFilter !== "all" ? agentFilter : undefined,
    timeRange,
    type,
  });
  console.log(stats);

  // 📊 Chart data
  const chartData = useMemo(() => {
    if (!stats?.agents) return [];
    return stats.agents.map((agent) => ({
      name: agent.name,
      value: agent[type === "orders" ? "totalOrders" : "totalSales"],
    }));
  }, [stats, type]);

  return (
    <Card
      className="dark:border-2 shadow-sm border-0 dark:bg-[var(--card)]"
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <CardHeader className="px-6 pb-4 border-b border-gray-100">
        <div className="sm:flex items-center justify-between    sm:gap-4">
          {/* Left section */}
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              <ChartColumnIncreasing className="h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-white" />
            </div>
            <div>
              <h3 className=" sm:text-lg font-semibold text-slate-900 dark:text-white ">
                {type === "orders" ? "Orders Analytics" : "Sales Analytics"}
              </h3>
              <p className=" sm:text-sm text-gray-500 font-medium ">
                {type === "orders"
                  ? timeRange === "thisWeek"
                    ? "Orders performance this Week"
                    : timeRange === "thisMonth"
                    ? "Orders performance this Month"
                    : "Orders performance this Year"
                  : timeRange === "thisWeek"
                  ? "Sales performance this Week"
                  : timeRange === "thisMonth"
                  ? "Sales performance this Month"
                  : "Sales performance this Year"}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex sm:justify-end sm:mt-0 mt-4 justify-center  items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
                >
                  {type == "orders" ? (
                    <ShoppingCart className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  <span className="">
                    {type === "orders" ? "Orders" : "Sales"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setType("orders")}
                >
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setType("sales")}
                >
                  Sales
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
                >
                  <Users className="h-4 w-4" />
                  <span className="">
                    {agentFilter === "all" ? "All Agents" : agentFilter}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["all", ...(stats?.allAgents || [])].map((agent) => (
                  <DropdownMenuItem
                    key={agent}
                    className="cursor-pointer"
                    onClick={() => setAgentFilter(agent)}
                  >
                    {agent === "all" ? "All Agents" : agent}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
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
        ) : error ? (
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
        ) : chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--foreground)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted-foreground)", opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "var(--secondary)",
                    borderRadius: "0.75rem", // matches --radius-lg
                  }}
                  labelStyle={{
                    color: "var(--foreground)",
                    fontWeight: 600,
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    color: "var(--foreground)", // 🔹 pulled directly from your theme
                    fontSize: "11px",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 flex justify-center">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-medium"
              >
                {type === "orders"
                  ? `Total Orders ${
                      timeRange === "thisWeek"
                        ? "This Week :"
                        : timeRange === "thisMonth"
                        ? "This Month :"
                        : "This Year :"
                    } ${stats.totalOrdersByTimeRange}`
                  : `Total Sales ${
                      timeRange === "thisWeek"
                        ? "This Week :"
                        : timeRange === "thisMonth"
                        ? "This Month :"
                        : "This Year :"
                    } ${stats.totalSalesByTimeRange} DH`}
              </Badge>
            </div>
          </>
        ) : (
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
    </Card>
  );
}
