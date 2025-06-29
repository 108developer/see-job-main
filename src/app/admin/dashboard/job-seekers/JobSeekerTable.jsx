import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function JobSeekerTable({ data }) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select row ${row.index + 1}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("location") || "-"}</div>,
    },
    // {
    //   accessorKey: "companyName",
    //   header: "Company",
    //   cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    // },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("updatedAt")).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    // {
    //   accessorKey: "candidateId",
    //   header: "Candidate ID",
    //   cell: ({ row }) => <div>{row.getValue("candidateId")}</div>,
    // },
    {
      accessorKey: "profileID",
      header: "Profile ID",
      cell: ({ row }) => <div>{row.getValue("profileID")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem>Verify</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Suspend</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={() => col.toggleVisibility()}
                >
                  {col.columnDef.header?.toString() || col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.candidateId}>
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
                <TableCell colSpan={columns.length}>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortIcon({ direction }) {
  if (!direction) {
    return <ChevronDown className="ml-1 h-3 w-3 rotate-180" />;
  }
  if (direction === "asc") {
    return <ChevronDown className="ml-1 h-3 w-3 rotate-180" />;
  }
  if (direction === "desc") {
    return <ChevronDown className="ml-1 h-3 w-3" />;
  }
  return null;
}
