"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import UpdateShiftForm from "./update-shift-form";
import DeleteShiftDialog from "./delete-shift.dialog";
import { Shift } from "@/types/shift";

const ActionCell = ({ row }: { row: any }) => {
   const [open, setOpen] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);

   const shiftId = row.original.id;
   const shiftName = row.original.name;
   return (
      <>
         <UpdateShiftForm
            shiftData={row.original}
            open={open}
            setOpen={setOpen}
         />
         <DeleteShiftDialog
            shiftId={shiftId}
            shiftName={shiftName}
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
                  onClick={() => navigator.clipboard.writeText(row)}
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
export const columns: ColumnDef<Shift>[] = [
   {
      id: "select",
      header: ({ table }) => (
         <Checkbox
            checked={
               table.getIsAllPageRowsSelected() ||
               (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
               table.toggleAllPageRowsSelected(!!value)
            }
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
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "startTime",
      header: "Start Time",
   },
   {
      accessorKey: "endTime",
      header: "End Time",
   },
   {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionCell row={row} />,
   },
];
