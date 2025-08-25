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
import { Clock, Settings2, X } from "lucide-react";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { formatDate, formatTime } from "@/lib/utils";
import { TimeKeepingFormValue } from "@/types/time-keeping";
import { Badge } from "@/components/ui/badge";

interface TimeKeepingProps {
   timeKeepingData: TimeKeepingFormValue[];
}

export default function TimeKeepingDateGrid({
   timeKeepingData,
}: TimeKeepingProps) {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [sorting, setSorting] = useState<SortingState>([
      { id: "id", desc: true },
   ]);
   const [searchQuery, setSearchQuery] = useState("");

   const filteredData = useMemo(() => {
      return timeKeepingData.filter((item) => {
         const searchLower = searchQuery.toLowerCase();
         const matchesSearch =
            !searchQuery ||
            item.employee.employeeCode.toLowerCase().includes(searchLower);

         return matchesSearch;
      });
   }, [timeKeepingData, searchQuery]);

   const columns = useMemo<ColumnDef<TimeKeepingFormValue>[]>(
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
            id: "employee.employeeCode",
            header: "Employee",
            cell: ({ row }) => (
               <div className="flex items-center space-x-3">
                  <div>
                     <p>{row.original.employee.user.name}</p>
                     <p className="text-sm text-gray-400">
                        {row.original.employee.employeeCode}
                     </p>
                  </div>
               </div>
            ),
         },
         {
            accessorKey: "shift.name",
            id: "shift.name",
            header: "Shift",
            cell: ({ row }) => (
               <div>
                  <p className="text-start">{row.original.shift.name}</p>
                  <p className="flex items-center gap-x-1 text-sm text-gray-400">
                     <Clock className="h-3 w-3 text-gray-400" />
                     {row.original.shift.startTime} -{" "}
                     {row.original.shift.endTime}
                  </p>
               </div>
            ),
         },
         {
            accessorKey: "workDate",
            id: "workDate",
            header: "Date",
            cell: ({ row }) => (
               <div className="text-md">
                  {formatDate(row.original.workDate)}
               </div>
            ),
         },

         {
            accessorKey: "checkIn",
            id: "checkIn",
            header: "Check In",
            cell: ({ row }) => (
               <div className="flex items-center gap-x-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(row.original.checkIn)}
               </div>
            ),
         },
         {
            accessorKey: "checkOut",
            id: "checkOut",
            header: "Check Out",
            cell: ({ row }) => (
               <div className="flex items-center gap-x-1">
                  <Clock className="text-muted-foreground h-3 w-3" />
                  {row.original.checkOut ? (
                     formatTime(row.original.checkOut)
                  ) : (
                     <span className="text-muted-foreground">-</span>
                  )}
               </div>
            ),
         },
         {
            id: "totalHours",
            header: "Hours",
            cell: ({ row }) => (
               <div>
                  {row.original.totalHours ? (
                     <div className="flex items-center gap-x-2">
                        <p className="text-card-foreground font-medium">
                           {row.original.totalHours}h
                        </p>

                        {row.original.overtimeHours !== undefined &&
                           row.original.overtimeHours !== null &&
                           (row.original.overtimeHours > 0 ? (
                              <Badge variant="secondary">
                                 +{row.original.overtimeHours}h OT
                              </Badge>
                           ) : (
                              <Badge variant="secondary">
                                 {row.original.overtimeHours}h OT
                              </Badge>
                           ))}
                     </div>
                  ) : (
                     <span className="text-muted-foreground">-</span>
                  )}
               </div>
            ),
         },
      ],
      [],
   );

   const [columnOrder, setColumnOrder] = useState<string[]>(
      columns.map((column) => column.id as string),
   );

   const table = useReactTable({
      columns,
      data: filteredData,
      pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
      getRowId: (row: TimeKeepingFormValue) => row.id,
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
         recordCount={timeKeepingData?.length || 0}
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
                  placeholder="Search by employee code..."
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
