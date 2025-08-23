"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { updateMenuItemStatus } from "@/actions/menu/menu-items";
import { MenuItemStatus } from "@/types/menu";
import { toast } from "sonner";
import { tryCatch } from "@/helpers/try-catch";

interface MenuItemStatusBadgeProps {
   menuItemId: string;
   currentStatus: MenuItemStatus;
   disabled?: boolean;
}

export function MenuItemStatusBadge({
   menuItemId,
   currentStatus,
   disabled = false,
}: MenuItemStatusBadgeProps) {
   const [isPending, startTransition] = useTransition();

   const getStatusVariant = (status: MenuItemStatus) => {
      return status === MenuItemStatus.AVAILABLE
         ? "bg-green-100 text-green-800"
         : "bg-yellow-100 text-yellow-800";
   };

   const getStatusText = (status: MenuItemStatus) => {
      return status === MenuItemStatus.AVAILABLE ? "Available" : "Unavailable";
   };

   const handleStatusChange = (newStatus: MenuItemStatus) => {
      if (newStatus === currentStatus) return;

      startTransition(async () => {
         const { data: result, error } = await tryCatch(
            updateMenuItemStatus(menuItemId, newStatus),
         );

         if (error) {
            toast.error(error.message);
            return;
         }

         if (result?.success) {
            toast.success(result.message || "Status updated successfully");
         } else if (result?.error) {
            toast.error(result.error);
         }
      });
   };

   if (disabled || isPending) {
      return (
         <Badge className={getStatusVariant(currentStatus)}>
            {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            {getStatusText(currentStatus)}
         </Badge>
      );
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               size="sm"
               className={`h-auto p-1 ${getStatusVariant(currentStatus)} hover:opacity-80`}
            >
               {getStatusText(currentStatus)}
               <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start">
            <DropdownMenuItem
               onClick={() => handleStatusChange(MenuItemStatus.AVAILABLE)}
               className={
                  currentStatus === MenuItemStatus.AVAILABLE ? "bg-muted" : ""
               }
            >
               Available
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() => handleStatusChange(MenuItemStatus.UNAVAILABLE)}
               className={
                  currentStatus === MenuItemStatus.UNAVAILABLE ? "bg-muted" : ""
               }
            >
               Unavailable
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
