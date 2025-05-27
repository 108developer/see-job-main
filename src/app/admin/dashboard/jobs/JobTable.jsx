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
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function JobTable({ data }) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const flattenedData = data.map((item) => ({
    id: item.id,
    jobTitle: item.jobTitle || "N/A",
    jobLocation: item.jobLocation || "N/A",
    deadline: item.deadline
      ? new Date(item.deadline).toLocaleDateString()
      : "N/A",
    fullName:
      `${item.employer.firstName || ""} ${
        item.employer.lastName || ""
      }`.trim() || "N/A",
    employerEmail: item.employer.email || "N/A",
    companyEmail: item.company.companyEmail || "N/A",
    employerPhone: item.employer.mobileNumber || "N/A",
    companyPhone: item.company.companyPhone || "N/A",
    companyName: item.company.companyName || "N/A",
    companyWebsite: item.company.companyWebsite || "N/A",
  }));

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      cell: ({ row }) => <div>{row.getValue("jobTitle")}</div>,
    },
    {
      accessorKey: "jobLocation",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("jobLocation")}</div>,
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => <div>{row.getValue("deadline")}</div>,
    },

    {
      accessorKey: "fullName",
      header: "Employer Name",
      cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "employerEmail",
      header: "Employer Email",
      cell: ({ row }) => <div>{row.getValue("employerEmail")}</div>,
    },
    {
      accessorKey: "employerPhone",
      header: "Employer Phone",
      cell: ({ row }) => <div>{row.getValue("employerPhone")}</div>,
    },

    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    },
    {
      accessorKey: "companyEmail",
      header: "Company Email",
      cell: ({ row }) => <div>{row.getValue("companyEmail")}</div>,
    },
    {
      accessorKey: "companyPhone",
      header: "Company Phone",
      cell: ({ row }) => <div>{row.getValue("companyPhone")}</div>, 
    },
    {
      accessorKey: "companyWebsite",
      header: "Company Website",
      cell: ({ row }) => (
        <a
          href={row.getValue("companyWebsite")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.getValue("companyWebsite")}
        </a>
      ),
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
    },
  ];

  const table = useReactTable({
    data: flattenedData,
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
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
                  {col.columnDef.header}
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
                <TableRow key={row.id}>
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
