import SalesAgentBarChart from "@/components/chart-area-interactive.jsx";
import { SectionCards } from "@/components/section-cards";
import { SalesCounter } from "@/components/SalesCounter.jsx";
import { OrdersTable } from "@/components/OrdersTable.jsx";
// import { ChartPieLabelList } from "@/components/ChartPieLabelList.jsx";
import { TopClients } from "@/components/TopClients.jsx";
// import { ChartTopProducts } from "@/components/ChartTopProducts.jsx";
import { TopProducts } from "@/components/TopProducts.jsx";
import { ShareButton } from "@/components/ShareButton.jsx";
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCards />
      <div className="grid grid-cols-2 gap-4">
        <SalesAgentBarChart className="col-span-2" />
        <SalesCounter />
        {/* <ChartPieLabelList /> */}
      </div>
      <div className="grid grid-cols-9 grid-rows-6 gap-4 h-[1200px]">
        <div className="col-span-5 row-span-3">
          <TopProducts />
        </div>
        <div className="col-span-4 row-span-6 col-start-6 overflow-auto">
          <TopClients />
        </div>
        <div className="col-span-5 row-span-3 row-start-4 ">
          <TopProducts />
        </div>
      </div>
      {/* <ChartTopProducts /> */}
      <OrdersTable />
      <ShareButton />
    </div>
  );
}
