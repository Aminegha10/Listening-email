"use client";

import { useMemo, useState } from "react";
import { useGetLeadStatsQuery } from "@/features/dataApi";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Badge } from "./ui/badge";
import { ArrowUpFromLine as ChartNoAxesCombined } from "lucide-react";

export default function SalesAgentBarChart({ timeRange }) {
  // const [timeRange, setTimeRange] = useState("thisMonth");
  const [agentFilter, setAgentFilter] = useState("all");
  const [type, setType] = useState("orders");

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
      className="shadow-sm border-0 bg-gradient-to-br from-white to-slate-50/30"
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <CardHeader className="px-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {type === "orders" ? "Orders Analytics" : "Sales Analytics"}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {type === "orders"
                  ? timeRange === "last7days"
                    ? "Orders in the last 7 days"
                    : timeRange === "thisMonth"
                    ? "Orders in the last 30 days"
                    : "Orders for the current year"
                  : timeRange === "last7days"
                  ? "Sales in the last 7 days"
                  : timeRange === "thisMonth"
                  ? "Sales in the last 30 days"
                  : "Sales for the current year"}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="min-w-[120px] h-9 bg-background border-border/60 hover:border-primary/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            {/* <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="min-w-[120px] h-9 bg-background border-border/60 hover:border-primary/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">Last 7 Days</SelectItem>
                <SelectItem value="thisMonth">Last 30 Days</SelectItem>
                <SelectItem value="ytd">Current Year</SelectItem>
              </SelectContent>
            </Select> */}

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
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ThreeDot variant="pulsate" color="#00bca2" size="medium" />
          </div>
        ) : error ? (
          <div className="flex justify-center py-8 text-destructive">
            Error loading data
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
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem", // matches --radius-lg
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
                    padding: "10px 12px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--primary))",
                    fontWeight: 600,
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    color: "hsl(var(--chart-1))", // 🔹 pulled directly from your theme
                    fontSize: "13px",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#00bca2"
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
                  ? `Total Orders: ${stats.totalOrders}`
                  : `Total Sales: ${stats.totalSales}`}
              </Badge>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-12 text-muted-foreground">
            {type === "orders"
              ? "No order data available"
              : "No sales data available"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
