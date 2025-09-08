"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
import { useGetOrdersByAgentsQuery } from "@/features/dataApi";

export const description = "A pie chart with a label list";

// base config for ChartContainer
const chartConfig = {
  orders: { label: "Orders" },
};

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const ChartPieLabelList = () => {
  const { data: orders, isLoading, error } = useGetOrdersByAgentsQuery();

  // map backend response into recharts data format
  const chartData =
    orders?.map((item, index) => ({
      salesAgent: item.salesAgent, // e.g. "Sales Agent3"
      orders: item.orders, // e.g. 5
      fill: colors[index % colors.length], // assign color dynamically
    })) ?? [];

  // extend chartConfig dynamically for formatter
  const dynamicConfig = chartData.reduce(
    (acc, item, i) => ({
      ...acc,
      [item.salesAgent]: {
        label: item.salesAgent,
        color: colors[i % colors.length],
      },
    }),
    chartConfig
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>Orders by Sales Agent</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading chart data</div>
        ) : (
          <ChartContainer
            config={dynamicConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
          >
            <PieChart width={400} height={300}>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="orders" hideLabel />}
              />
              <Pie data={chartData} dataKey="orders" >
                <LabelList
                  dataKey="salesAgent"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value) => dynamicConfig[value]?.label}
                />
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
          Showing total orders for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
