"use client";

import { ChevronDown, Crown, Download, TrendingUp, Trophy } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useGetTopProductsQuery } from "@/features/dataApi";
import { Button } from "./ui/button";
// import {
//   handleExportCSV,
//   handleExportJSON,
//   handleExportPDF,
// } from "@/utils/exportUtils";

export const description = "A pie chart showing top-selling products";

// Up to 20 colors (for dynamic data)
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
  "#ffff00",
  "var(--accent)",
  "var(--destructive)",
  "var(--muted)",
  "var(--sidebar-primary)",
  "var(--sidebar-accent)",
  "var(--sidebar-border)",
  "var(--primary-foreground)",
  "var(--secondary-foreground)",
  "var(--accent-foreground)",
  "var(--destructive-foreground)",
  "var(--muted-foreground)",
  "var(--card)",
  "var(--popover)",
];

// export functions with date suffix
// const handleExportCSV = () =>
//   exportToCSV(table.getFilteredRowModel().rows, ordersDate);
// const handleExportJSON = () =>
//   exportToJSON(table.getFilteredRowModel().rows, ordersDate);
// const handleExportPDF = () =>
//   exportToPDF(table.getFilteredRowModel().rows, ordersDate);

export function TopSellingProducts() {
  const { data: TopProducts, isLoading, isError } = useGetTopProductsQuery();

  if (!TopProducts || TopProducts.length === 0)
    return <p className="text-center text-gray-500">No data available</p>;

  // ✅ Create a chartConfig dynamically (like chartConfig in ChartPieLabel)
  const chartConfig = TopProducts.reduce((acc, product, index) => {
    acc[product.product] = {
      label: product.product,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {});

  return (
    <Card className="flex flex-col">
      {/* Header */}
      <CardHeader className="flex items-center justify-between pb-0">
        <div>
          <CardTitle>
            <span className="py-1 px-2.5 border-none rounded bg-green-100 text-xl text-green-800 font-medium">
              Top 10-Selling Products
            </span>
          </CardTitle>
          {/* <CardDescription>January - June 2024</CardDescription> */}
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading chart data
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={TopProducts}
                dataKey="quantity"
                nameKey="product"
                label
                stroke="0"
              >
                {TopProducts.map((entry, index) => (
                  <Cell key={index} fill={chartConfig[entry.product].color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      {/* Footer with Top Performer */}
      <CardFooter className="flex-col gap-3 text-sm border-t bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-b-lg">
        <div className="w-full">
          <div
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            style={{ borderColor: "#00bca2" }}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className="p-2 rounded-full shadow-lg"
                style={{ backgroundColor: "#00bca2" }}
              >
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-4 h-4" style={{ color: "#00bca2" }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#00bca2" }}
                  >
                    Top Performer
                  </span>
                </div>
                <div className="text-base font-bold text-gray-800">
                  {TopProducts[0].product}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <span
                    className="text-xl font-extrabold"
                    style={{ color: "#00bca2" }}
                  >
                    {TopProducts[0].quantity}
                  </span>
                  <span className="text-gray-600">orders</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Leading the team with exceptional performance</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
