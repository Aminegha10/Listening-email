import SalesAgentBarChart from "@/components/chart-area-interactive.jsx";
import { SectionCards } from "@/components/section-cards";
import { SalesCounter } from "@/components/SalesCounter.jsx";
import { OrdersTable } from "@/components/OrdersTable.jsx";
import { ChartPieLabelList } from "@/components/ChartPieLabelList.jsx";
import { ChartTopProducts } from "@/components/ChartTopProducts.jsx";
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCards />
      <div className="grid grid-cols-2 gap-4">
        <SalesAgentBarChart className="col-span-2" />
        <SalesCounter />
        <ChartPieLabelList />
      </div>
      <ChartTopProducts />
      <OrdersTable />
    </div>
  );
}
