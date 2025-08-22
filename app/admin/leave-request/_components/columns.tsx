"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTable, CardToolbar } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import {
   DataGridTable,
   DataGridTableRowSelect,
   DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
   ColumnDef,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   PaginationState,
   SortingState,
   useReactTable,
} from "@tanstack/react-table";
import { CheckCircle, Clock, Eye, Settings2, X, XCircle } from "lucide-react";

import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { leaveRequest } from "@/types/leave";
import { calculateDays, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DetailsDialog } from "./leave-details-dialog";
import { LeaveRequestStatus } from "@/lib/generated/prisma";

interface LeaveProps {
   leaveData: leaveRequest[];
}

interface ActionCellProps {
   row: any;
   onStatusChange?: (id: string, newStatus: LeaveRequestStatus) => void;
}

export const ActionCell = ({ row, onStatusChange }: ActionCellProps) => {
   const [open, setOpen] = useState(false);
   const data = row.original;

   const handleStatusUpdate = (newStatus: LeaveRequestStatus) => {
      if (row.original) {
         row.original.status = newStatus;
      }

      if (onStatusChange) {
         onStatusChange(data.id, newStatus);
      }
   };

   return (
      <>
         <DetailsDialog
            detailData={data}
            open={open}
            setOpen={setOpen}
            onStatusUpdate={handleStatusUpdate}
         />
         <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Eye className="h-4 w-4" />
         </Button>
      </>
   );
};

export default function LeaveDataGrid({ leaveData }: LeaveProps) {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [sorting, setSorting] = useState<SortingState>([
      { id: "id", desc: true },
   ]);
   const [searchQuery, setSearchQuery] = useState("");

   const filteredData = useMemo(() => {
      return leaveData.filter((item) => {
         const searchLower = searchQuery.toLowerCase();
         const matchesSearch =
            !searchQuery ||
            item.employee?.user?.name.toLowerCase().includes(searchLower);

         return matchesSearch;
      });
   }, [leaveData, searchQuery]);

   const columns = useMemo<ColumnDef<leaveRequest>[]>(
      () => [
         {
            accessorKey: "id",
            id: "id",
            header: () => <DataGridTableRowSelectAll />,
            cell: ({ row }) => <DataGridTableRowSelect row={row} />,
            enableSorting: false,
            size: 35,
            meta: {
               headerClassName: "",
               cellClassName: "",
            },
            enableResizing: false,
         },
         {
            accessorKey: "employee.user.email",
            id: "employee.user.email",
            header: "Email",
         },
         {
            accessorKey: "employee.user.name",
            id: "employee.user.name",
            header: "Full Name",
         },
         {
            accessorKey: "startDate",
            id: "startDate",
            header: "Start Date",
            cell: ({ row }: { row: any }) => {
               const time = row.original.startDate;
               return formatDate(time);
            },
         },
         {
            accessorKey: "endDate",
            id: "endDate",
            header: "End Date",
            cell: ({ row }: { row: any }) => {
               const time = row.original.endDate;
               return formatDate(time);
            },
         },
         {
            id: "duration",
            header: "Duration",
            cell: ({ row }: { row: any }) => {
               const start = row.original.startDate;
               const end = row.original.startDate;
               return calculateDays(start, end);
            },
         },
         {
            accessorKey: "status",
            id: "status",
            header: "Status",
            cell: ({ row }: { row: any }) => {
               const status = row.original.status;
               return <StatusBadge status={status} />;
            },
         },
         {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionCell row={row} />,
         },
      ],
      [],
   );

   function StatusBadge({ status }: { status: any }) {
      switch (status) {
         case "PENDING":
            return (
               <Badge
                  variant="outline"
                  className="border-yellow-600 text-yellow-600"
               >
                  <Clock className="mr-1 h-3 w-3" /> Pending
               </Badge>
            );
         case "APPROVED":
            return (
               <Badge
                  variant="outline"
                  className="border-green-600 text-green-600"
               >
                  <CheckCircle className="mr-1 h-3 w-3" /> Approved
               </Badge>
            );
         case "REJECTED":
            return (
               <Badge variant="outline" className="border-red-600 text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Rejected
               </Badge>
            );
      }
   }

   const [columnOrder, setColumnOrder] = useState<string[]>(
      columns.map((column) => column.id as string),
   );

   const table = useReactTable({
      columns,
      data: filteredData,
      pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
      getRowId: (row: leaveRequest) => row.id,
      state: {
         pagination,
         sorting,
         columnOrder,
      },
      columnResizeMode: "onChange",
      onColumnOrderChange: setColumnOrder,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
   });

   return (
      <DataGrid
         table={table}
         recordCount={leaveData?.length || 0}
         tableLayout={{
            columnsPinnable: true,
            columnsResizable: true,
            columnsMovable: true,
            columnsVisibility: true,
         }}
      >
         <div className="flex flex-1 items-center justify-between gap-2 pb-4">
            <div className="max-w-lg">
               <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 pl-9"
               />
               {searchQuery.length > 0 && (
                  <Button
                     variant="ghost"
                     size="icon"
                     className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2"
                     onClick={() => setSearchQuery("")}
                  >
                     <X className="h-4 w-4" />
                  </Button>
               )}
            </div>
            <CardToolbar>
               <DataGridColumnVisibility
                  table={table}
                  trigger={
                     <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                     >
                        <Settings2 className="h-4 w-4" />
                        Columns
                     </Button>
                  }
               />
            </CardToolbar>
         </div>
         <Card>
            <CardTable>
               <ScrollArea>
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
               </ScrollArea>
            </CardTable>

            <CardFooter className="flex items-center justify-between">
               <DataGridPagination />
            </CardFooter>
         </Card>
      </DataGrid>
   );
}
