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
  MoreHorizontal,
  Package,
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
// import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetClientsQuery } from "@/features/dataApi";

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
    accessorKey: "clientName",
    header: <div className="text-left">Client Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-left">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "ordersCount",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Orders Count <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="lowercase justify-center flex items-center gap-2">
        {row.getValue("ordersCount")}
        <Package className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
    ),
  },
  {
    accessorKey: "productsQuantity",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Products Ordered <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="lowercase justify-center flex items-center gap-2">
        {row.getValue("productsQuantity")}
        <Package className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
    ),
  },
  {
    accessorKey: "orderAverage",
    header: <div className="text-center">Order Average</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span className="rounded-md bg-green-50 px-1.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200 gap-1">
          Daily
        </span>
      </div>
    ),
  },
  // {
  //   accessorKey: "averageOrder",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Orders Count <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="lowercase justify-center flex items-center gap-2">
  //       {row.getValue("ordersCount")}
  //       <Package className="h-4 w-4 text-[var(--color-primary)]" />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revenue <ArrowUpDown />
        </Button>
        {/* <div className="text-center">Revenue</div> */}
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;

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
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function ClientsTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const {
    data: clients,
    isLoading,
    isError,
  } = useGetClientsQuery({ filter: "all" });
  console.log(clients);

  const table = useReactTable({
    data: clients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {isLoading ? (
        <>...isloading</>
      ) : isError ? (
        <>....errors</>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
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

          {/* footer */}
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
