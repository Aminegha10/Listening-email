"use client";

import SalesOrdersBarchart from "@/components/Charts/SalesOrdersBarchart.jsx";
import { SectionCards } from "@/components/TopCards";
import { SaleAreaChart } from "@/components/Charts/SaleAreaChart.jsx";
import { OrdersAreaChart } from "@/components/Charts/OrdersAreaChart.jsx";
import { OrdersTable } from "@/components/Tables/OrdersTable.jsx";
import { TopClients } from "@/components/TopClients.jsx";
import { ThreeMidlleCards } from "@/components/ThreeMidlleCards.jsx";
import { TopProductsPieChart } from "@/components/Charts/TopProductsPieChart.jsx";
import { ShareButton } from "@/components/ShareButton.jsx";
import { TopPerformerProduct } from "@/components/TopPerformerProduct";
import { useState } from "react";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("thisMonth");

  return (
    <div className="flex flex-col gap-6">
      <SectionCards />
      {/* Header with Time Range Selector */}
      <div className="">
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          className="w-40"
        />
      </div>
      {/* order and sales Charts and Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
        <SalesOrdersBarchart timeRange={timeRange} className="col-span-2" />
        <SaleAreaChart timeRange={timeRange} />
      </div>
      {/* Three Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <ThreeMidlleCards timeRange={timeRange} />
      </div>
      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-[5fr_4fr] gap-4">
        {/* Left Column: OrdersAreaChart + TopProducts */}
        <div className="flex flex-col gap-4">
          <OrdersAreaChart timeRange={timeRange} />
          <TopProductsPieChart timeRange={timeRange} />
        </div>

        {/* Right Column: TopClients + TopPerformerProduct */}
        <div className="flex flex-col gap-4">
          <div className="overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <TopClients timeRange={timeRange} />
          </div>
          <TopPerformerProduct timeRange={timeRange} />
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable />

      {/* <ShareButton /> */}
    </div>
  );
}
