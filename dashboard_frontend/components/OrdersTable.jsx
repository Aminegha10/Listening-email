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
  Eye,
  MoreHorizontal,
  Loader2,
  Download,
  ChevronDownCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("orderNumber")}</div>
    ),
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("client")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-center font-medium">{formatted}</div>;
    },
    sortingFn: (a, b) =>
      parseFloat(a.getValue("price") || 0) -
      parseFloat(b.getValue("price") || 0),
  },
  {
    accessorKey: "salesAgent",
    header: () => <div className="text-center">Sales Agent</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("salesAgent")}
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: () => <div className="text-center">Products</div>,
    cell: ({ row }) => {
      const products = row.getValue("products") || [];
      return (
        <div className="justify-center font-medium flex items-center gap-2">
          <span className="rounded-md bg-green-50 px-1.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200 flex items-center gap-1">
            {products.length} Items
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <Eye className="text-[#8C8C8C] size-4 cursor-pointer hover:text-gray-600 transition-colors" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Products - Order #
                    <span className="text-[var(--color-primary)]">
                      {row.getValue("orderNumber")}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {products.length > 0 ? (
                    <div className="space-y-3">
                      {products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {product.name || `Product ${index + 1}`}{" "}
                            </h4>
                            <div className="flex items-center gap-1">
                              {product.barcode && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {product.barcode}
                                </p>
                              )}
                              <div>
                                {product.warehouse == "MAG" ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
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
    header: <div className="text-left">Payment Type</div>,
    cell: ({ row }) => (
      <div className="">
        <span className="rounded-md  bg-sky-50 px-1.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
          {row.getValue("typedepaiement")}
        </span>
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: () => <div className="text-center">Action</div>,
  //   cell: ({ row }) => {
  //     const order = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(order.id)}
  //           >
  //             Copy order ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View order details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function OrdersTable({ id }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [ordersDate, setOrdersDate] = React.useState("last7Days");
  const [search, setSearch] = React.useState("");
  // const [openModal, setOpenModal] = React.useState(false);

  // Pass dynamic filter to query
  const {
    data: Orders,
    isLoading,
    error,
  } = useGetOrdersTableQuery({ ordersDate, search });

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
  const dataType = "orders";

  const handleExportCSV = () =>
    exportToCSV(table.getFilteredRowModel().rows, ordersDate, "Orders");
  const handleExportJSON = () =>
    exportToJSON(table.getFilteredRowModel().rows, ordersDate, "Orders");
  const handleExportPDF = () =>
    exportToPDF(table.getFilteredRowModel().rows, ordersDate, "Orders");

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading orders...</span>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">
            Failed to load orders:{" "}
            {error?.data?.message || error?.error || "Unknown error"}
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="flex justify-between items-center py-4 gap-2">
            <div className="">
              {ordersDate === "today" && (
                <span className="text-xl text-[#8C8C8C]">
                  Today's{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    Orders
                  </span>
                </span>
              )}
              {ordersDate === "last7Days" && (
                <span>
                  Last 7 Days{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    Orders
                  </span>
                </span>
              )}
              {ordersDate === "thisMonth" && (
                <span>
                  This Month{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    Orders
                  </span>
                </span>
              )}
            </div>

            <div className="space-x-2 flex">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className=""
              />
              {/* Orders Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filter Orders <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setOrdersDate("today")}>
                    Today's Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdersDate("last7Days")}>
                    Last 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdersDate("thisMonth")}>
                    This Month
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Columns Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {table
                    .getAllColumns()
                    .filter((c) => c.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
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
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Export <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border" id={id}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
