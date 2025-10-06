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
  ChevronDown,
  Download,
  Eye,
  FileJson,
  FileText,
  Loader2,
  Package,
  Sheet,
  ShoppingCart,
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
import { Input } from "@/components/ui/input";
import { useGetOrdersTableQuery } from "@/features/dataApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";
import { Calendar } from "lucide-react";

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
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <div className="capitalize text-md text-center font-medium">
        {row.getValue("orderNumber")}
      </div>
    ),
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/5  text-md hover:text-primary font-semibold"
        >
          Client <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="lowercase justify-center flex items-center font-medium text-center">
        {row.getValue("client")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-center font-semibold">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/5 text-md hover:text-primary font-semibold"
        >
          Price <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || 0);
      const formatted = new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
      }).format(price);
      return (
        <div className="text-right font-semibold text-primary">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "salesAgent",
    header: () => <div className="text-center text-md">Sales Agent</div>,

    cell: ({ row }) => (
      <div className="capitalize text-center font-medium">
        {row.getValue("salesAgent")}
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: () => <div className="text-center text-md">Products</div>,
    cell: ({ row }) => {
      const products = row.getValue("products") || [];
      return (
        <div className="justify-center font-medium flex items-center gap-2">
          <span className="rounded-md bg-[var(--color-primary)]/10 px-1.5 py-1 text-xs font-medium text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-muted)] flex items-center gap-1">
            {products.length} Items
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <Eye className="text-[var(--color-primary)] h-4 w-4 cursor-pointer hover:text-gray-600 transition-colors" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogTitle className="text-lg font-semibold">
                  Products - Order #
                  <span className="text-[var(--color-primary)]">
                    {row.getValue("orderNumber")}
                  </span>
                </DialogTitle>
                <div className="mt-4">
                  {products.length > 0 ? (
                    <div className="space-y-3">
                      {products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 dark:bg-accent/20 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium dark:text-foreground text-sm">
                              {product.name || `Product ${index + 1}`}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              {product.barcode && (
                                <p className="text-xs text-gray-600">
                                  {product.barcode}
                                </p>
                              )}
                              <div>
                                {product.warehouse === "MAG" ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs bg-red-500"
                                  >
                                    {product.warehouse}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-500 text-white"
                                  >
                                    {product.warehouse}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {product.quantity && (
                              <p className="text-xs text-gray-500">
                                Qty: {product.quantity}
                              </p>
                            )}
                            {product.price && (
                              <p className="font-medium text-sm">
                                ${product.price}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No products found for this order.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "typedepaiement",
    header: () => <div className="text-center text-md">Payment Type</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="rounded-md bg-sky-50 px-1.5 py-1 text-xs dark:bg-sky-500/20 font-medium dark:text-white dark:ring-muted-foreground text-sky-700 ring-1 ring-inset ring-sky-200">
          {row.getValue("typedepaiement")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/5 text-md hover:text-primary font-semibold"
        >
          Order Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center font-medium text-muted-foreground">
        {row.getValue("createdAt")}
      </div>
    ),
  },
];

export function OrdersTable({ id }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [timeRange, setTimeRange] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const {
    data: Orders,
    isLoading,
    error,
  } = useGetOrdersTableQuery({
    timeRange,
    search,
  });

  const table = useReactTable({
    data: Orders || [],
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

  const handleExportCSV = () =>
    exportToCSV(
      table.getFilteredRowModel().rows,
      timeRange,
      "Orders",
      null,
      null,
      Orders.length
    );
  const handleExportJSON = () =>
    exportToJSON(
      table.getFilteredRowModel().rows,
      timeRange,
      "Orders",
      null,
      null,
      Orders.length
    );
  const handleExportPDF = () =>
    exportToPDF(
      table.getFilteredRowModel().rows,
      timeRange,
      "Orders",
      null,
      null,
      Orders.length
    );

  return (
    <div className="w-full space-y-3 max-w-full overflow-hidden">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-card rounded-lg border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-8 border border-border focus:border-primary transition-colors bg-background text-sm h-8"
          />
        </div>

        <div className="flex items-center gap-2 sm:flex-wrap">
          {/* Orders Filter */}
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
                Export as JSON
                <FileJson className="text-yellow-500 stroke-[2px]" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Export as PDF
                <FileText className="text-[#f32b2b] stroke-[2px]" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-auto rounded-lg border border-border bg-card shadow-sm"
        id={id}
      >
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border sticky top-0 z-0">
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
            {table.getRowModel().rows.length ? (
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
                    <ShoppingCart className="h-6 w-6 text-muted-foreground/50" />
                    <span className="text-sm font-medium">No order found.</span>
                    <span className="text-xs">
                      Try adjusting your search or filters
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
