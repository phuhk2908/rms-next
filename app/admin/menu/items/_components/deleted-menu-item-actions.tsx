"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { restoreMenuItem, hardDeleteMenuItem } from "@/actions/menu/menu-items";
import { toast } from "sonner";
import { tryCatch } from "@/helpers/try-catch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeletedMenuItemActionsProps {
   menuItemId: string;
   menuItemName: string;
}

export function DeletedMenuItemActions({
   menuItemId,
   menuItemName,
}: DeletedMenuItemActionsProps) {
   const [isRestorePending, startRestoreTransition] = useTransition();
   const [isHardDeletePending, startHardDeleteTransition] = useTransition();
   const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false);

   const handleRestore = () => {
      startRestoreTransition(async () => {
         const { data: result, error } = await tryCatch(
            restoreMenuItem(menuItemId),
         );

         if (error) {
            toast.error(error.message);
            return;
         }

         if (result?.success) {
            toast.success(result.message || "Menu item restored successfully");
         } else if (result?.error) {
            toast.error(result.error);
         }
      });
   };

   const handleHardDelete = () => {
      startHardDeleteTransition(async () => {
         const { data: result, error } = await tryCatch(
            hardDeleteMenuItem(menuItemId),
         );

         if (error) {
            toast.error(error.message);
            return;
         }

         if (result?.success) {
            toast.success(result.message || "Menu item permanently deleted");
            setShowHardDeleteDialog(false);
         } else if (result?.error) {
            toast.error(result.error);
         }
      });
   };

   const isPending = isRestorePending || isHardDeletePending;

   return (
      <div className="flex justify-between items-center gap-2">
         <Badge variant="secondary" className="bg-red-100 text-red-800">
            Deleted
         </Badge>

         <div className="flex gap-1">
            <Button
               onClick={handleRestore}
               disabled={isPending}
               variant="outline"
               size="sm"
               className="gap-1 text-green-600 hover:text-green-700"
            >
               {isRestorePending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
               ) : (
                  <RotateCcw className="h-3 w-3" />
               )}
               Restore
            </Button>

            <Button
               onClick={() => setShowHardDeleteDialog(true)}
               disabled={isPending}
               variant="outline"
               size="sm"
               className="gap-1 text-red-600 hover:text-red-700"
            >
               {isHardDeletePending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
               ) : (
                  <Trash2 className="h-3 w-3" />
               )}
               Delete Forever
            </Button>
         </div>

         <ConfirmDialog
            title="Delete Permanently"
            description={`Are you sure you want to permanently delete "${menuItemName}"? This will remove all data and images permanently and cannot be undone.`}
            onConfirm={handleHardDelete}
            open={showHardDeleteDialog}
            onOpenChange={setShowHardDeleteDialog}
            confirmText="Delete Forever"
            cancelText="Cancel"
         />
      </div>
   );
}
