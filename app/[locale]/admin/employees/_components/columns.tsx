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
import { Copy, Edit, MoreHorizontal, Settings2, Trash2, X } from "lucide-react";
import { UserWithEmployeeProfile } from "@/types/employee";
import UpdateEmployeeForm from "./update-employee-form";
import DeleteDialogForm from "./delete-dialog-form";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";

interface EmployeeProps {
   employeeData: UserWithEmployeeProfile[];
}

export const ActionCell = ({ row }: { row: any }) => {
   const [open, setOpen] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);

   const employeeId = row.original.id;
   const employeeEmail = row.original.email;
   return (
      <>
         <UpdateEmployeeForm
            employeeData={row.original}
            open={open}
            setOpen={setOpen}
         />
         <DeleteDialogForm
            employeeId={employeeId}
            employeeEmail={employeeEmail}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(employeeId)}
               >
                  <Copy className="size-4" />
                  Copy ID
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => setOpen(true)}>
                  <Edit className="size-4" />
                  Edit
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setOpenDelete(true)}
               >
                  <Trash2 className="size-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

export default function EmployeeDataGrid({ employeeData }: EmployeeProps) {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [sorting, setSorting] = useState<SortingState>([
      { id: "name", desc: true },
   ]);
   const [searchQuery, setSearchQuery] = useState("");

   const filteredData = useMemo(() => {
      return employeeData.filter((item) => {
         const searchLower = searchQuery.toLowerCase();
         const matchesSearch =
            !searchQuery || item.name.toLowerCase().includes(searchLower);

         return matchesSearch;
      });
   }, [employeeData, searchQuery]);

   const columns = useMemo<ColumnDef<UserWithEmployeeProfile>[]>(
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
            accessorKey: "name",
            id: "name",
            header: "Name",
         },
         {
            accessorKey: "email",
            id: "email",
            header: "Email",
         },
         {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionCell row={row} />,
            size: 60,
            enableSorting: false,
            enableHiding: false,
            enableResizing: false,
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
      getRowId: (row: UserWithEmployeeProfile) => row.id,
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
         recordCount={employeeData?.length || 0}
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
