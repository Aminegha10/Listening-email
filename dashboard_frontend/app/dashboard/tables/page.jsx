import React from "react";
import { OrdersTable } from "@/components/OrdersTable.jsx";
import { ProductsTables } from "../../../components/ProductsTables";
import { SalesAgentTable } from "../../../components/SalesAgentTable";

const TablesPage = () => {
  return (
    <div>
      <ProductsTables />
      <SalesAgentTable />
      <OrdersTable />
    </div>
  );
};

export default TablesPage;
