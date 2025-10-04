"use client";

import {
  ChevronDown,
  Crown,
  Download,
  FileJson,
  FileText,
  Fuel as Funnel,
  Package,
  Settings2,
  Sheet,
  ShoppingBasket,
  Table,
  Tablets as TableOfContents,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { Badge } from "../ui/badge";
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
import { Button } from "../ui/button";
import { exportToPDF, exportToCSV, exportToJSON } from "@/utils/exportUtils";
import { useRef, useState } from "react";
import { Riple } from "react-loading-indicators";
import Link from "next/link";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

export const description = "A pie chart showing top-selling products";

// Up to 20 colors (for dynamic data)
const COLORS = [
  "#e72f0b", // chart-1 / primary (bright red)
  "#b71c1c", // chart-2 / dark red
  "#ff7043", // chart-3 / orange-red
  "#ffb74d", // chart-4 / light orange
  "#f4511e", // chart-5 / deep orange
  "#d32f2f", // primary-alt / secondary red
  "#ff8a65", // accent / warm salmon
  "#43a047", // success / green (clearly different)
  "#0288d1", // destructive / blue (contrasting)
  "#fff3f0", // muted background / very light
  "#c62828", // sidebar-primary / strong dark red
  "#ef6c00", // sidebar-accent / orange
  "#8d2300", // sidebar-border / deep brown-red
  "#ffffff", // primary-foreground / text on primary
  "#ffe0b2", // secondary-foreground / light contrast
  "#ffffff", // accent-foreground
  "#ffffff", // destructive-foreground
  "#ffccbc", // muted-foreground / soft light
  "#fff8f5", // card background / very light
  "#ffffff", // popover background
];

// export functions with date suffix
// const handleExportCSV = () =>
//   exportToCSV();
// const handleExportJSON = () =>
//   exportToJSON();

export function TopProductsPieChart({ timeRange }) {
  // Select chart
  const chartRef = useRef(null);
  const [filter, setFilter] = useState("unitsSold"); // default filter
  const { data, isLoading, isError } = useGetTopProductsQuery({
    filter,
    timeRange,
  });
  console.log(data);
  const TopProducts = data?.topProducts;

  const handleExportPDF = () =>
    exportToPDF(
      TopProducts,
      timeRange,
      "TopSellingProducts",
      filter,
      chartRef.current,
      filter
    );

  // Create a chartConfig dynamically (like chartConfig in ChartPieLabel)
  const chartConfig = TopProducts?.reduce((acc, product, index) => {
    acc[product.product] = {
      label: product.product,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {});

  // Helper function to get filter display info
  const getFilterInfo = () => {
    switch (filter) {
      case "revenue":
        return { label: "Revenue", icon: "💰", unit: "$" };
      case "unitsSold":
        return { label: "Units Sold", icon: "📦", unit: " units" };
      case "ordersCount":
        return { label: "Orders", icon: "📋", unit: " orders" };
      default:
        return { label: "Value", icon: "📊", unit: "" };
    }
  };

  const filterInfo = getFilterInfo();

  // Add these handlers before the return statement
  const handleExportCSV = () =>
    exportToCSV(TopProducts, timeRange, "TopProducts", null, null, filter);

  const handleExportJSON = () =>
    exportToJSON(TopProducts, timeRange, "TopProducts", null, null, filter);

  return (
    <>
      <Card
        className="flex flex-col py-0 dark:border-2 rounded-xl"
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
        ref={chartRef}
      >
        {/* Header */}
        <CardHeader>
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Left side — Title */}
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
                <Package className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-foreground">
                  Top 10 Products
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Showing {TopProducts?.length} of {data?.totalOrderedProducts}{" "}
                  products
                </p>
              </div>
            </div>

            {/* Right side — Controls */}
            <div className="flex flex-wrap justify-start md:justify-end gap-2 sm:gap-3">
              {/* Filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
                  >
                    <Settings2 className="h-4 w-4" />
                    {filter === "unitsSold"
                      ? "Most Sold"
                      : filter === "revenue"
                      ? "Top Revenue"
                      : "Most Orders Count"}
                    <ChevronDown className="h-4 w-4" />
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

              {/* Export dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
                  >
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Export as CSV{" "}
                    <Sheet className="text-green-500 stroke-[2px]" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON}>
                    Export as JSON{" "}
                    <FileJson className="text-yellow-500 stroke-[2px]" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    Export as PDF{" "}
                    <FileText className="text-[#f32b2b] stroke-[2px]" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Table link button */}
              <Link href="/dashboard/tables#products" passHref>
                <Button className="px-3 py-2 bg-white dark: hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 hover:border-slate-400 flex items-center gap-2 text-sm sm:text-base">
                  <Table className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        {/* Chart */}
        <CardContent className="flex-1 pb-4">
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
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-red-600 font-medium">
                  Error loading products data
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !TopProducts || TopProducts.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  No products data available
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Data will appear here once available
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer
              ref={chartRef}
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square  max-h-[300px] pb-6 w-[350px]"
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
              <div className="mt-4 text-center font-medium">
                <Badge variant="secondary">
                  Total Products{" "}
                  {timeRange === "thisWeek"
                    ? "This Week : "
                    : timeRange === "thisMonth"
                    ? "This Month : "
                    : "This Year : "}
                  {data?.totalOrderedProducts}
                </Badge>
              </div>
            </ChartContainer>
          )}
        </CardContent>

        {/* Top Product Performance Section */}
        {TopProducts && TopProducts.length > 0 && (
          <CardFooter className="border-t dark:bg-secondary bg-slate-50/50 p-0">
            <div className="w-full p-4 sm:p-6">
              <div className="bg-white dark:bg-secondary  border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                {/* Responsive layout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                  {/* Left: Icon + Info */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-indigo-300 dark:to-secondary rounded-xl shadow-lg flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>

                    <div className="space-y-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-2 py-1"
                        >
                          TOP PRODUCT
                        </Badge>
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                          by {filterInfo.label}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                        {TopProducts[0].product}
                      </h4>
                    </div>
                  </div>

                  {/* Right: Value + Trend */}
                  <div className="w-full sm:w-auto text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 mb-1">
                      {filterInfo.unit === "$"
                        ? `${TopProducts[0][filter]} DH`
                        : `${TopProducts[0][filter]}${filterInfo.unit}`}
                    </div>

                    <div className="flex sm:justify-end items-center gap-1 text-sm dark:text-gray-500 text-green-600">
                      <TrendingUp className="w-4 h-4 flex-shrink-0 dark:text-green-500" />
                      <span className="text-xs sm:text-sm">
                        Leading performance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
