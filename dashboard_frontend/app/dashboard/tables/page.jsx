"use client";
import { OrdersTable } from "@/components/OrdersTable.jsx";
import { ProductsTables } from "../../../components/ProductsTables";
import { ClientsTable } from "../../../components/ClientsTable";
import { useEffect } from "react";

const TablesPage = () => {
  return (
    <div>
      <ClientsTable />
      <OrdersTable id="clients" />
      <ProductsTables id="products" />
    </div>
  );
};

export default TablesPage;
