"use client";
import { useState, useMemo } from "react";
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Filter,
  Star,
  Download,
  ChevronDown,
  ShoppingCartIcon,
  Funnel,
  Table,
  ShoppingBasket,
  Wallet,
  FileText,
  Settings2,
  Package,
  ChartNoAxesCombined,
  Sheet,
  FileJson,
} from "lucide-react";
import { useGetLeadStatsQuery, useGetClientsQuery } from "@/features/dataApi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Riple } from "react-loading-indicators";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

function TopClients({ timeRange }) {
  const [filter, setFilter] = useState("revenue");
  const {
    data: topClients,
    isLoading,
    isError,
  } = useGetClientsQuery({ filter, goal: 120, timeRange });
  console.log(topClients);



  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case "Daily":
        return "bg-green-100 text-green-800";
      case "Weekly":
        return "bg-blue-100 text-blue-800";
      case "Monthly":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  console.log(topClients);

  // exporting
  const handleExportCSV = () =>
    exportToCSV(topClients.data, timeRange, "TopClients", null, null, filter);
  const handleExportJSON = () =>
    exportToJSON(topClients.data, timeRange, "TopClients", null, null, filter);
  const handleExportPDF = () =>
    exportToPDF(topClients.data, timeRange, "TopClients", null, null, filter);

  return (
    <div
      className="max-w-6xl mx-auto dark:bg-[var(--card)]  "
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      {/* Clients Card */}
      <div className="p-6 border-b border-slate-200   dark:border-white dark:border-b-1 sm:flex flex-row justify-between items-center sm:items-center sm:gap-1">
        {/* Left: Title + Icon */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
            <Users className="h-5 w-5 text-primary dark:text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white ">
              Top 10 Clients
            </h3>
            <p className="text-sm text-gray-500 font-medium ">
              Showing {topClients?.data.length} of {topClients?.totalClients}{" "}
              clients
            </p>
          </div>
        </div>

        {/* Right: Filters & Export */}
        <div className="flex  gap-2 w-full sm:w-auto justify-center sm:mt-0 mt-4 sm:justify-end">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                <Settings2 className="h-4 w-4" />
                <span className="">
                  {filter === "revenue"
                    ? "Revenue"
                    : filter === "productsQuantity"
                      ? "Products"
                      : "Orders"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("revenue")}>
                Top Revenue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("ordersCount")}>
                Total Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("productsQuantity")}>
                Products Quantity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                <Download className="h-4 w-4" />
                <span className="">Export</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                Export as CSV <Sheet className="text-green-500 stroke-[2px]" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                Export as JSON{" "}
                <FileJson className="text-yellow-500 stroke-[2px]" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                Export as PDF{" "}
                <FileText className="text-[#f32b2b] stroke-[2px]" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Container */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className=" h-full w-full flex justify-center items-center">
            <Riple
              color="var(--color-primary)"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">
                Error loading clients data
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please try again later
              </p>
            </div>
          </div>
        ) : !topClients.data || topClients.data.length === 0 ? (
          <>
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  No Clients data available
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Data will appear here once available
                </p>
              </div>
            </div>
          </>
        ) : (
          topClients.data.map((client, index) => (
            <div
              key={client.clientName}
              className="p-6 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all duration-200 border-b border-border/50 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                        ? "bg-slate-200 text-slate-600"
                        : index === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-slate-50 text-slate-500"
                      }`}
                  >
                    {index + 1}
                  </div>
                </div>

                <Avatar className="w-12 h-12">
                  <AvatarFallback className="dark:text-white bg-[var(--color-destructive)] text-[var(--color-primary)] text-xs">
                    {client?.clientName
                      ? client.clientName
                        .split(" ")
                        .map(word => word[0]) // Take the first letter of each word
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) // Only first 2 letters (optional)
                      : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold text-slate-900 truncate dark:text-white">
                      {client.clientName}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getFrequencyColor(
                        "Daily"
                      )}`}
                    >
                      Daily
                    </span>
                  </div>
                  {/* <p className="text-slate-600 text-sm truncate">
                    {client.company}
                  </p> */}
                </div>

                <div className="flex items-center gap-8 text-right">
                  <div className="min-w-0 flex gap-3 items-center">
                    <div className="text-lg font-bold text-slate-900">
                      {filter == "revenue" ? (
                        <div className="flex gap-2 items-center dark:text-white">
                          {client.revenue} DH
                          <Wallet className="text-[var(--color-primary)]" />
                        </div>
                      ) : filter == "productsQuantity" ? (
                        <div className="flex gap-2 items-center dark:text-white">
                          {client.productsQuantity}
                          <Package className="text-[var(--color-primary)]" />
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center dark:text-white">
                          {client.ordersCount}
                          <ShoppingCartIcon className="text-[var(--color-primary)]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="min-w-0">
                      <div className="flex items-center gap-1 text-slate-500 mb-1">
                        <ShoppingCart className="h-3 w-3" />
                        <span className="text-xs font-medium">Avg Order</span>
                      </div>
                      <p className="text-lg font-bold text-slate-700">{formatCurrency(client.averageOrderValue)}</p>
                    </div> */}

                  {/* <div className="min-w-0">
                      <div className="flex items-center gap-1 text-slate-500 mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-medium">Orders</span>
                      </div>
                      <p className="text-lg font-bold text-slate-700">{client.totalOrders}</p>
                    </div> */}
                </div>
              </div>

              {/* <div className="mt-4 ml-24">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 group-hover:from-indigo-600 group-hover:to-indigo-700"
                    style={{
                      width: `${Math.min(
                        (client.revenue / 250000) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { TopClients };
