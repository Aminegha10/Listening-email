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
  MoreHorizontal,
  UserPlus,
  Users,
  Download,
  Sheet,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

import { useRegisterMutation } from "../../features/authApi";
import { useGetAllUsersQuery } from "../../features/dataApi";
import AddUserForm from "./addUserForm";

// Update the columns array - modify the header and cell styles
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
        className="border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/5 hover:text-primary font-semibold"
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center font-medium">
        {row.getValue("name")}
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="capitalize">
        <Badge
          className={`text-xs ${
            row.getValue("role") === "user" ? "bg-gray-500" : "bg-blue-500"
          }`}
        >
          {row.getValue("role")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="capitalize text-center font-medium text-muted-foreground">
        {row.getValue("createdAt")}
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: "Action",

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

export default function tableUsers() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [addUser] = useRegisterMutation();
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const { data = [], isLoading, isError } = useGetAllUsersQuery();
  console.log(data);

  const table = useReactTable({
    data: data || [], // Provide fallback empty array
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

  const handleExportCSV = () => {
    const csvContent = [
      ["Name", "Email", "Role"],
      ...table
        .getFilteredRowModel()
        .rows.map((row) => [
          row.getValue("name"),
          row.getValue("email"),
          row.getValue("role"),
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  if (isLoading) {
    return <div className="w-full p-4 text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        Error loading users
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-card rounded-lg border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search users..."
            className="pl-8 border border-border focus:border-primary transition-colors bg-background text-sm h-8"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
              >
                <Users className="h-3 w-3" />
                {roleFilter === "admin"
                  ? "Admin"
                  : roleFilter === "user"
                  ? "User"
                  : "All Roles"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-lg shadow-lg border border-border"
            >
              <DropdownMenuItem
                onClick={() => setRoleFilter("all")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setRoleFilter("admin")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setRoleFilter("user")}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer text-sm"
              >
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 font-medium bg-transparent text-xs"
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
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
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
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu> */}

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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add User Form */}
          <AddUserForm />
        </div>
      </div>

      {/* Table section with updated styling */}
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
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Updated pagination section */}
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
