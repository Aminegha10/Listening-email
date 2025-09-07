"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import { useGetTopProductsQuery } from "@/features/dataApi"; // backend hook

export const description = "Top Products Sold";

const chartConfig = {
  quantity: {
    label: "Quantity Sold",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
};

export function ChartTopProducts() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products Sold</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading data</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={products}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey="quantity" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="quantity"
                layout="vertical"
                fill="var(--chart-2)"
                radius={4}
              >
                <LabelList
                  dataKey="product"
                  position="insideLeft"
                  offset={8}
                  className="fill-background"
                  fontSize={12}
                />
                <LabelList
                  dataKey="quantity"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing most sold products
        </div>
      </CardFooter>
    </Card>
  );
}
