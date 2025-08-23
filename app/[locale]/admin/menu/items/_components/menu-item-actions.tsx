"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
   MoreHorizontal,
   Edit,
   Trash2,
   Eye,
   EyeOff,
   RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
   deleteMenuItem,
   restoreMenuItem,
   toggleMenuItemActive,
   updateMenuItemStatus,
} from "@/actions/menu/menu-items";
import { MenuItemStatus } from "@/types/menu";

interface MenuItemActionsProps {
   id: string;
   name: string;
   isActive: boolean;
   deletedAt: Date | null;
   status: MenuItemStatus;
   onEdit?: () => void;
}

export function MenuItemActions({
   id,
   name,
   isActive,
   deletedAt,
   status,
   onEdit,
}: MenuItemActionsProps) {
   const [isPending, startTransition] = useTransition();
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const handleDelete = () => {
      startTransition(async () => {
         try {
            const result = await deleteMenuItem(id);
            if (result.success) {
               toast.success(result.message);
               setShowDeleteDialog(false);
            } else {
               toast.error(result.error);
            }
         } catch {
            toast.error("An error occurred while deleting the menu item");
         }
      });
   };

   const handleRestore = () => {
      startTransition(async () => {
         try {
            const result = await restoreMenuItem(id);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.error);
            }
         } catch (error: any) {
            toast.error(`${error.response?.data?.message || "An error occurred while restoring the menu item"}`);
         }
      });
   };

   const handleToggleActive = () => {
      startTransition(async () => {
         try {
            const result = await toggleMenuItemActive(id);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.error);
            }
         } catch (error: any) {
            toast.error(`${error.response?.data?.message || "An error occurred while updating the status"}`);
         }
      });
   };

   const handleStatusChange = (newStatus: MenuItemStatus) => {
      startTransition(async () => {
         try {
            const result = await updateMenuItemStatus(id, newStatus);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.error);
            }
         } catch (error: any) {
            toast.error(`${error.response?.data?.message || "An error occurred while updating the status"}`);
         }
      });
   };

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuSeparator />

               {!deletedAt && (
                  <>
                     <DropdownMenuItem onClick={onEdit} disabled={isPending}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                     </DropdownMenuItem>

                     <DropdownMenuItem
                        onClick={handleToggleActive}
                        disabled={isPending}
                     >
                        {isActive ? (
                           <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Hide menu item
                           </>
                        ) : (
                           <>
                              <Eye className="mr-2 h-4 w-4" />
                              Show menu item
                           </>
                        )}
                     </DropdownMenuItem>

                     <DropdownMenuSeparator />

                     <DropdownMenuItem
                        onClick={() =>
                           handleStatusChange(
                              status === MenuItemStatus.AVAILABLE
                                 ? MenuItemStatus.UNAVAILABLE
                                 : MenuItemStatus.AVAILABLE,
                           )
                        }
                        disabled={isPending}
                     >
                        {status === MenuItemStatus.AVAILABLE
                           ? "Mark as out of stock"
                           : "Mark as available"}
                     </DropdownMenuItem>

                     <DropdownMenuSeparator />

                     <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                        disabled={isPending}
                     >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                     </DropdownMenuItem>
                  </>
               )}

               {deletedAt && (
                  <DropdownMenuItem
                     onClick={handleRestore}
                     disabled={isPending}
                  >
                     <RotateCcw className="mr-2 h-4 w-4" />
                     Restore
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

         <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete the menu item &quot;{name}
                     &quot;? This action can be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                     Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDelete}
                     disabled={isPending}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     {isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}

// Quick toggle component for status
export function MenuItemStatusToggle({
   id,
   status,
}: {
   id: string;
   status: MenuItemStatus;
}) {
   const [isPending, startTransition] = useTransition();

   const handleToggle = () => {
      const newStatus =
         status === MenuItemStatus.AVAILABLE
            ? MenuItemStatus.UNAVAILABLE
            : MenuItemStatus.AVAILABLE;

      startTransition(async () => {
         try {
            const result = await updateMenuItemStatus(id, newStatus);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.error);
            }
         } catch (error: any) {
            toast.error(
               `${error.response?.data?.message || "An error occurred"}`,
            );
         }
      });
   };

   return (
      <Button
         variant={status === MenuItemStatus.AVAILABLE ? "default" : "secondary"}
         size="sm"
         onClick={handleToggle}
         disabled={isPending}
      >
         {isPending
            ? "..."
            : status === MenuItemStatus.AVAILABLE
              ? "Available"
              : "Out of stock"}
      </Button>
   );
}

// Quick active toggle
export function MenuItemActiveToggle({
   id,
   isActive,
}: {
   id: string;
   isActive: boolean;
}) {
   const [isPending, startTransition] = useTransition();

   const handleToggle = () => {
      startTransition(async () => {
         try {
            const result = await toggleMenuItemActive(id);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.error);
            }
         } catch (error: any) {
            toast.error(
               `${error.ressponse?.data?.message || "An error occurred"}`,
            );
         }
      });
   };

   return (
      <Button
         variant={isActive ? "default" : "outline"}
         size="sm"
         onClick={handleToggle}
         disabled={isPending}
      >
         {isPending ? "..." : isActive ? "Show" : "Hide"}
      </Button>
   );
}
