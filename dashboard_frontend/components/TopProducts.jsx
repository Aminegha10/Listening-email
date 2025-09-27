"use client";

import {
  ChevronDown,
  Crown,
  Download,
  FileJson,
  FileText,
  Fuel as Funnel,
  Sheet,
  ShoppingBasket,
  Table,
  Tablets as TableOfContents,
  TrendingUp,
  Trophy,
  Users,
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
import { useRef, useState } from "react";
import { Riple } from "react-loading-indicators";
import Link from "next/link";

export const description = "A pie chart showing top-selling products";

// Up to 20 colors (for dynamic data)
const COLORS = [
  "#00bca2", // chart-1 (teal)
  "#3b82f6", // chart-2 (blue)
  "#10b981", // chart-3 (green)
  "#f59e0b", // chart-4 (orange)
  "#8b5cf6", // chart-5 (purple)
  "#00bca2", // primary
  "#ffff00", // yellow
  "#00bca2", // accent
  "#ff4d4f", // destructive (red)
  "#f5f5f5", // muted
  "#00bca2", // sidebar-primary
  "#f0f0f0", // sidebar-accent
  "#e0e0e0", // sidebar-border
  "#ffffff", // primary-foreground
  "#333333", // secondary-foreground
  "#ffffff", // accent-foreground
  "#ffffff", // destructive-foreground
  "#666666", // muted-foreground
  "#ffffff", // card
  "#ffffff", // popover
];

// export functions with date suffix
// const handleExportCSV = () =>
//   exportToCSV();
// const handleExportJSON = () =>
//   exportToJSON();

export function TopProducts({ timeRange }) {
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
      null,
      "TopSellingProducts",
      filter,
      chartRef.current
    );

  // ✅ Create a chartConfig dynamically (like chartConfig in ChartPieLabel)
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

  return (
    <>
      <Card className="flex flex-col py-0" ref={chartRef}>
        {/* Header */}
        <CardHeader className=" ">
          {/* <div> */}
          {/* <CardTitle>
            <span className="py-1 px-2.5 border-none rounded bg-green-100 text-xl text-green-800 font-medium">
              Top 10-Selling Products
            </span>
          </CardTitle> */}
          {/* <CardDescription>January - June 2024</CardDescription> */}
          {/* </div> */}
          <div className="p-6 border-b flex justify-between items-center border-slate-200">
            <div className="flex gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ShoppingBasket className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Top 10 Products
                  </h3>
                  <p className="text-sm text-slate-500">
                    Showing 10 of 22 clients
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent cursor-pointer "
                  >
                    <Funnel />
                    Filter Products <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setFilter("revenue")}
                  >
                    Top Revenue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setFilter("unitsSold")}
                  >
                    Most Sold
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setFilter("ordersCount")}
                  >
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
                  <DropdownMenuItem className="cursor-pointer">
                    Export as CSV <Sheet />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Export as JSON <FileJson />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleExportPDF}
                  >
                    Export as PDF <FileText />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div>
                <Link href="/dashboard/tables#products" passHref>
                  <Button className="px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 border border-slate-300 hover:border-slate-400">
                    <Table className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2"> */}
          {/* by existing in order or by revenue */}
          {/* </div> */}
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
              ref={chartRef}
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

        {/* Top Product Performance Section */}
        {TopProducts && TopProducts.length > 0 && (
          <CardFooter className="border-t bg-slate-50/50 p-0">
            <div className="w-full p-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-2 py-1"
                        >
                          TOP PRODUCT
                        </Badge>
                        <span className="text-sm text-slate-500">
                          by {filterInfo.label}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 max-w-md truncate">
                        {TopProducts[0].product}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      {filterInfo.unit === "$"
                        ? `$${TopProducts[0][filter]}`
                        : `${TopProducts[0][filter]}${filterInfo.unit}`}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Leading performance</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Performance metric</span>
                    <span className="font-medium">{filterInfo.label}</span>
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
