import React from "react";
import { OrdersTable } from "@/components/OrdersTable.jsx";
import { ProductsTables } from "../../../components/ProductsTables";
import { SalesAgentTable } from "../../../components/SalesAgentTable";

const TablesPage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ProductsTables />
        <SalesAgentTable />
      </div>
      <OrdersTable />
    </div>
  );
};

export default TablesPage;
