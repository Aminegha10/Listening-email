"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  FileJson,
  FileText,
  Package,
  Sheet,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetClientsQuery } from "@/features/dataApi";
import { Input } from "../ui/input";
import { exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="capitalize text-center font-medium text-foreground">
        {row.getValue("clientName")}
      </div>
    ),
  },
  {
    accessorKey: "ordersCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/5 hover:text-primary font-semibold"
      >
        Orders Count <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="justify-center flex items-center gap-2 font-medium">
        {row.getValue("ordersCount")}
        <ShoppingCart className="h-4 w-4 text-primary" />
      </div>
    ),
  },
  {
    accessorKey: "productsQuantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/5 hover:text-primary font-semibold"
      >
        Products Ordered <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="justify-center flex items-center gap-2 font-medium">
        {row.getValue("productsQuantity")}
        <Package className="h-4 w-4 text-primary" />
      </div>
    ),
  },
  {
    accessorKey: "orderAverage",
    header: "Order Average",
    cell: () => (
      <div className="flex justify-center">
        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
          Daily
        </span>
      </div>
    ),
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/5 hover:text-primary font-semibold"
      >
        Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return (
        <div className="text-center font-semibold text-primary">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "firstOrderDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/5 hover:text-primary font-semibold"
      >
        First Order Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("revenue"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);
      return (
        <div className="capitalize text-center font-medium text-muted-foreground">
          {row.getValue("firstOrderDate")}
        </div>
      );
    },
  },
];

export function ClientsTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [timeRange, setTimeRange] = React.useState("all");

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useGetClientsQuery({
    filter: "all",
    timeRange,
  });

  const table = useReactTable({
    data: clients.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  // exporting
  const handleExportCSV = () =>
    exportToCSV(
      table.getFilteredRowModel().rows,
      timeRange,
      "Clients",
      null,
      null,
      clients.data.length
    );
  const handleExportJSON = () =>
    exportToJSON(
      table.getFilteredRowModel().rows,
      timeRange,
      "Clients",
      null,
      null,
      clients.data.length
    );
  const handleExportPDF = () =>
    exportToPDF(
      table.getFilteredRowModel().rows,
      timeRange,
      "Clients",
      null,
      null,
      clients.data.length
    );

  return (
    <div className="w-full space-y-3 max-w-full overflow-hidden">
      {/* Top bar with Export + Columns */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-card rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Input
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search orders..."
              className="pl-8 border border-border focus:border-primary transition-colors bg-background text-sm h-8"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/*time range dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                <Calendar className="h-3 w-3" />
                {timeRange === "today"
                  ? "Today"
                  : timeRange === "thisWeek"
                  ? "This Week"
                  : timeRange === "thisMonth"
                  ? "This Month"
                  : "All Time"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-lg shadow-lg border border-border"
            >
              <DropdownMenuItem
                onClick={() => setTimeRange("all")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeRange("today")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeRange("thisWeek")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeRange("thisMonth")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Columns Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                Columns <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-lg shadow-lg border border-border"
            >
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                <Download className="h-3 w-3" />
                Export <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-lg shadow-lg border border-border"
            >
              <DropdownMenuItem
                onClick={handleExportCSV}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Export as CSV <Sheet className="text-green-500 stroke-[2px]" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportJSON}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Export as JSON{" "}
                <FileJson className="text-yellow-500 stroke-[2px]" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Export as PDF{" "}
                <FileText className="text-[#f32b2b] stroke-[2px]" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-bold text-foreground py-2 px-3 border-r border-border/50 last:border-r-0 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  Error loading clients.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`hover:bg-primary/5 transition-all duration-200 border-b border-border/50 ${
                    idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                  } ${
                    row.getIsSelected() ? "bg-primary/10 border-primary/20" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 px-3 border-r border-border/30 last:border-r-0 text-xs"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground py-6"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-muted-foreground/50" />
                    <span className="text-sm font-medium">
                      No client found.
                    </span>
                    <span className="text-xs">Try adjusting your filters</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-card rounded-lg border border-border">
        <div className="text-xs text-muted-foreground font-medium">
          <span className="text-primary font-semibold">
            {table.getFilteredSelectedRowModel().rows.length}
          </span>{" "}
          of{" "}
          <span className="text-primary font-semibold">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-xs">
            <span className="font-medium text-primary">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
