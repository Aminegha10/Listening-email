"use client";

import SalesAgentBarChart from "@/components/chart-area-interactive.jsx";
import { SectionCards } from "@/components/section-cards";
import { SalesCounter } from "@/components/SalesCounter.jsx";
import { OrdersCounter } from "@/components/OrdersCounter.jsx";
import { OrdersTable } from "@/components/OrdersTable.jsx";
import { TopClients } from "@/components/TopClients.jsx";
import { ThreeCardSection } from "@/components/ThreeCardSection.jsx";
import { TopProducts } from "@/components/TopProducts.jsx";
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
      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
        <SalesAgentBarChart timeRange={timeRange} className="col-span-2" />
        <SalesCounter timeRange={timeRange} />
      </div>
      {/* Three Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <ThreeCardSection timeRange={timeRange} />
      </div>
      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-4">
        {/* Left Column: OrdersCounter + TopProducts */}
        <div className="flex flex-col gap-4">
          <OrdersCounter timeRange={timeRange} />
          <TopProducts timeRange={timeRange} />
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
