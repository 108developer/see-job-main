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
import Link from "next/link";
import { useState } from "react";

export default function JobSeekerTable({
  data,
  sortBy,
  sortOrder,
  onSortChange,
}) {
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
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("fullName")}
        >
          Name
          <SortIcon direction={sortBy === "fullName" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("fullName") || "-"}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div>{row.getValue("gender") || "-"}</div>,
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => <div>{row.getValue("age") || "-"}</div>,
    },
    {
      accessorKey: "email",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("email")}
        >
          Email
          <SortIcon direction={sortBy === "email" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("email") || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("phone")}
        >
          Phone
          <SortIcon direction={sortBy === "phone" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
    },
    {
      accessorKey: "location",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("location")}
        >
          Location
          <SortIcon direction={sortBy === "location" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("location") || "-"}</div>,
    },

    // {
    //   accessorKey: "permanentAddress",
    //   header: ({ column }) => (
    //     <div
    //       className="flex items-center cursor-pointer select-none"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Address
    //       <SortIcon direction={column.getIsSorted()} />
    //     </div>
    //   ),
    //   cell: ({ row }) => <div>{row.getValue("permanentAddress") || "-"}</div>,
    // },
    // {
    //   accessorKey: "companyName",
    //   header: "Company",
    //   cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    // },
    {
      accessorKey: "createdAt",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("createdAt")}
        >
          Created
          <SortIcon direction={sortBy === "createdAt" ? sortOrder : null} />
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
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("updatedAt")}
        >
          Updated
          <SortIcon direction={sortBy === "updatedAt" ? sortOrder : null} />
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
      cell: ({ row }) => <div>{row.getValue("profileID") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const candidateId = row.original.candidateId;
        return (
          <a
            href={`/find-cv/${candidateId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline cursor-pointer border rounded-md p-1 flex justify-center bg-white"
          >
            View
          </a>
        );
      },
      // cell: () => (
      //   <DropdownMenu>
      //     <DropdownMenuTrigger asChild>
      //       <Button variant="outline" size="sm">
      //         <MoreHorizontal className="h-4 w-4" />
      //       </Button>
      //     </DropdownMenuTrigger>
      //     <DropdownMenuContent align="end">
      //       <DropdownMenuCheckboxItem>Verify</DropdownMenuCheckboxItem>
      //       <DropdownMenuCheckboxItem>Suspend</DropdownMenuCheckboxItem>
      //     </DropdownMenuContent>
      //   </DropdownMenu>
      // ),
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
