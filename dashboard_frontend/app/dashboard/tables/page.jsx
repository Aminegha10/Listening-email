"use client";
import { OrdersTable } from "@/components/Tables/OrdersTable";
import { ProductsTable } from "@/components/Tables/ProductsTable";
import { ClientsTable } from "@/components/Tables/ClientsTable";
import { useEffect } from "react";
import { SepararorTables } from "@/components/SepararorTables";
import { Database, Package, ShoppingCart, Users } from "lucide-react";

const TablesPage = () => {
  return (
    <div>
      <SepararorTables
        title="Clients Overview"
        subtitle="Key insights and engagement tracking for your customers"
        icon={<Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
      />
      <ClientsTable />
      {/* Between client and orders for order */}
      <SepararorTables
        title="Orders & Transactions"
        subtitle="Monitor sales, revenue trends, and fulfillment status"
        icon={
          <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        }
      />
      <OrdersTable id="clients" />
      {/* Between Orders and Product for products */}
      <SepararorTables
        title="Product Performance"
        subtitle="Analyze top-selling items and inventory statistics"
        icon={<Package className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />}
      />
      <ProductsTable id="products" />
    </div>
  );
};

export default TablesPage;
