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
  const [timeRange, setTimeRange] = useState("thisWeek");

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          className="w-40"
        />
      </div>

      <SectionCards timeRange={timeRange} />

      <div className="grid grid-cols-2 gap-4">
        <SalesAgentBarChart timeRange={timeRange} className="col-span-2" />
        <SalesCounter timeRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ThreeCardSection timeRange={timeRange} />
      </div>

      <div
        className="grid grid-cols-9 grid-rows-9 gap-4"
        style={{ gridTemplateRows: "repeat(9, auto)" }}
      >
        <div className="col-span-5 row-span-3">
          <OrdersCounter timeRange={timeRange} />
        </div>
        <div className="col-span-4 row-span-6 col-start-6 overflow-auto">
          <TopClients timeRange={timeRange} />
        </div>
        <div className="col-span-5 row-span-3 row-start-4">
          <TopProducts timeRange={timeRange} />
        </div>
        <div className="col-span-9 row-span-2 row-start-7 h-32 w-full">
          <TopPerformerProduct timeRange={timeRange} />
        </div>
      </div>

      <OrdersTable />
      <ShareButton />
    </div>
  );
}
