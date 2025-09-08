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
  Boxes,
  ChartColumn,
  ChevronDown,
  Download,
  Info,
  Package,
  TrendingUp,
  CheckB
} from "lucide-react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { useGetProductsDetailsQuery } from "@/features/dataApi";
import ProductInfoCard from "./ui/productCardInfo";

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
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("productName")}
      </div>
    ),
  },
  {
    accessorKey: "quantitySold",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity Sold <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase justify-center flex items-center gap-2">
        {row.getValue("quantitySold")}{" "}
        <ChartColumn className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
    ),
  },
  {
    accessorKey: "Revenue",
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => {
      const Revenue = parseFloat(row.getValue("Revenue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Revenue);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "ordersCount",
    header: "Orders Count",
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("ordersCount")}
      </div>
    ),
  },
  {
    accessorKey: "lastOrderedDate",
    header: () => <div className="text-center">Last Ordered</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("lastOrderedDate")}
      </div>
    ),
  },
  {
    accessorKey: "productDetails",
    header: "Product Details",
    cell: ({ row }) => (
      <div className="capitalize flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <button className="cursor-pointer">
              <Info className="h-4 w-4 text-[var(--color-primary)]" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0 shadow-none">
            <ProductInfoCard data={row.original} />
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: () => (
      <div className="capitalize text-center">
        <TrendingUp className="text-green-500 h-4 w-4" />
      </div>
    ),
  },
];

export function ProductsTables() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, error } = useGetProductsDetailsQuery();

  const table = useReactTable({
    data: data || [],
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

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">
            Failed to load products:{" "}
            {error?.data?.message || error?.error || "Unknown error"}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Filters & Column Menu */}
          <div className="flex justify-between items-center py-4 gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="max-w-sm"
            />

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
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.08)]">
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
