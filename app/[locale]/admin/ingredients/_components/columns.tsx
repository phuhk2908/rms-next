"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IngredientWithStock } from "@/types/ingredient";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditIngredientForm } from "./edit-ingredient-form";
import Image from "next/image";

const ActionsCell = ({ row }: { row: Row<IngredientWithStock> }) => {
   const ingredient = row.original;
   const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

   return (
      <>
         <EditIngredientForm
            ingredient={ingredient}
            isOpen={isEditSheetOpen}
            onOpenChange={setIsEditSheetOpen}
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
                  onClick={() => navigator.clipboard.writeText(ingredient.id)}
               >
                  <Copy className="mr-2 size-4" />
                  Copy ID
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => setIsEditSheetOpen(true)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem variant="destructive">
                  <Trash2 className="mr-2 size-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

export const columns: ColumnDef<IngredientWithStock>[] = [
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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         const ingredient = row.original;

         return (
            <Image
               className="size-10 rounded-md object-cover"
               src={ingredient.image.ufsUrl}
               alt={ingredient.name}
               width={40}
               height={40}
            />
         );
      },
   },
   {
      accessorKey: "name",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Name" />
      ),
   },
   {
      accessorKey: "code",
      header: "Code",
   },
   {
      accessorKey: "unit",
      header: "Unit",
   },
   {
      accessorKey: "currentStock",
      header: "Stock",
   },
   {
      accessorKey: "status",
      header: "Status",
   },
   {
      id: "actions",
      header: "Actions",
      cell: ActionsCell,
   },
];
