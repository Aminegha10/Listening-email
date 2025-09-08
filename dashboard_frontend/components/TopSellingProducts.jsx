"use client";

import { TrendingUp } from "lucide-react";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useGetTopProductsQuery } from "@/features/dataApi";

export const description = "A pie chart showing top-selling products";

// Up to 20 colors
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

export function TopSellingProducts() {
  const { data: TopProducts, isLoading, isError } = useGetTopProductsQuery();

  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p>Error loading data</p>;
  if (!TopProducts || TopProducts.length === 0) return <p>No data available</p>;

  // Create dynamic chartConfig for ChartContainer
  const dynamicChartConfig = TopProducts.reduce((acc, product, index) => {
    acc[product.product] = { color: COLORS[index % COLORS.length] };
    return acc;
  }, {}); // Remove TypeScript annotation

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top-Selling Products</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 justify-center items-center pb-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading chart data</div>
        ) : (
          <ChartContainer
            config={dynamicChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart width={400} height={300}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={TopProducts}
                dataKey="quantity"
                nameKey="product"
                stroke="0"
                label={false} // remove slice labels
              >
                {TopProducts.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={dynamicChartConfig[entry.product].color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total products sold for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
