"use client";

import { ChartNoAxesCombined, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  console.log("Lead Stats Data:", leadStats);
  // Map API data to chart format
  const chartData =
    leadStats?.salesByMonth.map((item) => ({
      month: item.month, // adjust based on your API
      sales: item.sales, // adjust based on your API
    })) || [];

  // Chart configuration
  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#3b82f6", // Tailwind blue-500
    },
  };

  return (
    <Card>
      <CardHeader className="px-6 border-b border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ChartNoAxesCombined className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Area Chart
              </h3>
              <p className="text-sm text-slate-500">
                Showing total sales for the last 6 months
              </p>
            </div>
          </div>

          {/* Right section - optional actions/buttons */}
          {/* <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent cursor-pointer"
                >
                  <Funnel />
                  Filter
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Last 30 Days
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Last 6 Months
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard/tables#sales" passHref>
              <Button className="px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 border border-slate-300 hover:border-slate-400">
                <Table className="h-4 w-4" />
              </Button>
            </Link>
          </div> */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-6">
            <ThreeDot
              variant="pulsate"
              color="var(--color-primary)"
              size="medium"
            />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-6 text-red-500">
            Error loading data
          </div>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="sales"
                type="natural"
                fill="var(--chart-3)"
                fillOpacity={0.4}
                stroke="var(--chart-1)"
              />
            </AreaChart>
          </ChartContainer>
        )}

        {!isLoading && !error && chartData.length === 0 && (
          <div className="flex justify-center pt-12 text-gray-500">
            No sales data available
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
