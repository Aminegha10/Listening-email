"use client";

import {
  ChevronDown,
  Crown,
  Download,
  FileJson,
  FileText,
  Sheet,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { Badge } from "./ui/badge";
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
import { exportToPDF } from "@/utils/exportUtils";
import { useState } from "react";
import { Riple } from "react-loading-indicators";

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
//   exportToCSV();
// const handleExportJSON = () =>
//   exportToJSON();

export function TopSellingProducts() {
  const [filter, setFilter] = useState("revenue"); // default filter
  const { data, isLoading, isError } = useGetTopProductsQuery({ filter });
  console.log(data);
  const TopProducts = data?.topProducts;

  const handleExportPDF = () =>
    exportToPDF(TopProducts, null, "TopSellingProducts", filter);

  // ✅ Create a chartConfig dynamically (like chartConfig in ChartPieLabel)
  const chartConfig = TopProducts?.reduce((acc, product, index) => {
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
        <div className="flex items-center gap-2">
          {/* by existing in order or by revenue */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Filter Products <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("revenue")}>
                Top Revenue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unitsSold")}>
                Most Sold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("ordersCount")}>
                Most Orders Count
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem>
                Export as CSV <Sheet />
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as JSON <FileJson />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                Export as PDF <FileText />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className=" flex-1 pb-0">
        {isLoading ? (
          <div className=" h-full w-full flex justify-center items-center">
            <Riple
              color="var(--color-primary)"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading chart data
          </div>
        ) : !TopProducts || TopProducts.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={TopProducts}
                dataKey={filter}
                nameKey="product"
                label
                stroke="0"
              >
                {TopProducts.map((entry, index) => (
                  <Cell key={index} fill={chartConfig[entry.product].color} />
                ))}
              </Pie>
            </PieChart>
            {/* <div className="mt-4 text-center font-medium">
              <Badge variant="secondary">
                Total Products: {data?.productTotals[0].totalProducts}
              </Badge>
            </div> */}
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
                  {TopProducts?.[0].product}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <span
                    className="text-xl font-extrabold"
                    style={{ color: "#00bca2" }}
                  >
                    {TopProducts?.[0][filter]}
                  </span>
                  <span className="text-gray-600">{filter}</span>
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
