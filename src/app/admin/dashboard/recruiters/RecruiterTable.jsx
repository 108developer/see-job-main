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
import { useUpdatePlanMutation } from "@/redux/api/admin";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { PlanUpdateModal } from "./PlanUpdateModal";
import TextEditorModal from "@/components/text-editor/TextEditorModal";

export default function RecruiterTable({ data, refetch }) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const plans = ["Free", "Basic", "Premium"];
  const [sorting, setSorting] = useState([]);

  const [updatePlan] = useUpdatePlanMutation();

  // const handlePlanChange = async (recruiterId, selectedPlan) => {
  //   const startDate = new Date();
  //   const endDate = new Date();
  //   endDate.setDate(startDate.getDate() + 30);

  //   try {
  //     await updatePlan({
  //       id: recruiterId,
  //       body: {
  //         plan: selectedPlan,
  //         startDate,
  //         endDate,
  //       },
  //     }).unwrap();

  //     toast.success("Plan updated successfully");
  //     refetch();
  //   } catch (error) {
  //     console.log("Plan update failed:", error);
  //     toast.error("Plan update failed");
  //   }
  // };

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
      accessorKey: "gender",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("gender") || "-"}</div>,
    },
    // {
    //   accessorKey: "age",
    //   header: ({ column }) => (
    //     <div
    //       className="flex items-center cursor-pointer select-none"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Age
    //       <SortIcon direction={column.getIsSorted()} />
    //     </div>
    //   ),
    //   cell: ({ row }) => <div>{row.getValue("age") ?? "-"}</div>,
    // },
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
      accessorKey: "mobileNumber",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <SortIcon direction={column.getIsSorted()} />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("mobileNumber")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    },
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
    //   id: "subscription",
    //   header: "Subscription",
    //   cell: ({ row }) => {
    //     const recruiterId = row.original.id;
    //     const currentPlan = row.original.plan || "Free";

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="outline" size="sm">
    //             {currentPlan}
    //             <ChevronDown className="ml-2 h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           {plans.map((plan) => (
    //             <DropdownMenuCheckboxItem
    //               key={plan}
    //               checked={currentPlan === plan}
    //               onCheckedChange={() => handlePlanChange(recruiterId, plan)}
    //             >
    //               {plan}
    //             </DropdownMenuCheckboxItem>
    //           ))}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
    {
      id: "subscription",
      header: "Subscription",
      cell: ({ row }) => {
        const recruiter = row.original;
        return (
          <PlanUpdateModal
            recruiter={recruiter}
            onSubmit={async (
              id,
              { plan, startDate, endDate, allowedResume, status }
            ) => {
              await updatePlan({
                id,
                body: {
                  plan,
                  startDate,
                  endDate,
                  allowedResume,
                  status,
                },
              }).unwrap();

              toast.success("Plan updated successfully");
              refetch();
            }}
          />
        );
      },
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

  const selectedRecruiters = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <TextEditorModal selectedRecruiters={selectedRecruiters} />

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

      <div className="w-full max-w-full rounded-md border overflow-x-auto">
        <div className="min-w-[900px]">
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
