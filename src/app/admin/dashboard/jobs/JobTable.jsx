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
import React, { useMemo, useState } from "react";

export default function JobTable({ data, sortBy, sortOrder, onSortChange }) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // const flattenedData = data.map((item) => ({
  //   id: item.id,
  //   jobTitle: item.jobTitle || "N/A",
  //   jobLocation: item.jobLocation || "N/A",
  //   deadline: item.deadline
  //     ? new Date(item.deadline).toLocaleDateString()
  //     : "N/A",
  //   fullName:
  //     `${item.employer?.firstName || ""} ${
  //       item.employer?.lastName || ""
  //     }`.trim() || "N/A",
  //   employerEmail: item.employer?.email || "N/A",
  //   companyEmail: item.company?.companyEmail || "N/A",
  //   employerPhone: item.employer?.mobileNumber || "N/A",
  //   companyPhone: item.company?.companyPhone || "N/A",
  //   companyName: item.company?.companyName || "N/A",
  //   companyWebsite: item.company?.companyWebsite || "N/A",
  //   createdAt: item.createdAt || null,
  //   url: item.url || "#",
  // }));

  const flattenedData = useMemo(() => {
    return data?.map((item) => ({
      id: item.id,
      jobTitle: item.jobTitle || "-",
      jobLocation: item.jobLocation || "-",
      deadline: item.deadline
        ? new Date(item.deadline).toLocaleDateString()
        : "-",
      fullName:
        `${item.employer?.firstName || ""} ${
          item.employer?.lastName || ""
        }`.trim() || "-",
      employerEmail: item.employer?.email || "-",
      companyEmail: item.company?.companyEmail || "-",
      employerPhone: item.employer?.mobileNumber || "-",
      companyPhone: item.company?.companyPhone || "-",
      companyName: item.company?.companyName || "-",
      companyWebsite: item.company?.companyWebsite || "-",
      createdAt: item.createdAt || null,
      url: item.url || "#",
    }));
  }, [data]);

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
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("jobTitle")}
        >
          Job Title
          <SortIcon direction={sortBy === "jobTitle" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("jobTitle") || "-"}</div>,
    },
    {
      accessorKey: "jobLocation",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("jobLocation")}
        >
          Location
          <SortIcon direction={sortBy === "jobLocation" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("jobLocation") || "-"}</div>,
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => {
        const rawDate = row.getValue("deadline");
        const formattedDate = new Date(rawDate).toLocaleDateString("en-GB"); // dd/mm/yyyy
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "fullName",
      header: "Employer Name",
      cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "employerEmail",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("employerEmail")}
        >
          Employer Email
          <SortIcon direction={sortBy === "employerEmail" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("employerEmail") || "-"}</div>,
    },
    {
      accessorKey: "employerPhone",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("employerPhone")}
        >
          Employer Phone
          <SortIcon direction={sortBy === "employerPhone" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("employerPhone") || "-"}</div>,
    },
    {
      accessorKey: "companyName",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("companyName")}
        >
          Company
          <SortIcon direction={sortBy === "companyName" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("companyName") || "-"}</div>,
    },
    {
      accessorKey: "companyEmail",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("companyEmail")}
        >
          Company Email
          <SortIcon direction={sortBy === "companyEmail" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("companyEmail") || "-"}</div>,
    },
    {
      accessorKey: "companyPhone",
      header: () => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onSortChange("companyPhone")}
        >
          Company Phone
          <SortIcon direction={sortBy === "companyPhone" ? sortOrder : null} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("companyPhone") || "-"}</div>,
    },
    // {
    //   accessorKey: "companyWebsite",
    //   header: "Company Website",
    //   cell: ({ row }) => (
    //     <a
    //       href={row.getValue("companyWebsite")}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-blue-600 hover:underline"
    //     >
    //       {row.getValue("companyWebsite")}
    //     </a>
    //   ),
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
      cell: ({ row }) =>
        row.getValue("createdAt") ? (
          <div>
            {new Date(row.getValue("createdAt")).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ) : (
          "-"
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const url = row.original.url || "#";
        return (
          <a
            href={`/jobs/${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline cursor-pointer border rounded-md p-1 flex justify-center bg-white"
          >
            View Job Detail
          </a>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 80,
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
    manualSorting: true, // disables internal sorting
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

function SortIcon({ direction }) {
  if (!direction) {
    return <ChevronDown className="ml-1 h-3 w-3 rotate-180 opacity-50" />;
  }
  if (direction === "asc") {
    return <ChevronDown className="ml-1 h-3 w-3 rotate-180" />;
  }
  if (direction === "desc") {
    return <ChevronDown className="ml-1 h-3 w-3" />;
  }
  return null;
}
