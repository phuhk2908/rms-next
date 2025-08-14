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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa món ăn");
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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi khôi phục món ăn");
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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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
               <DropdownMenuLabel>Hành động</DropdownMenuLabel>
               <DropdownMenuSeparator />

               {!deletedAt && (
                  <>
                     <DropdownMenuItem onClick={onEdit} disabled={isPending}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                     </DropdownMenuItem>

                     <DropdownMenuItem
                        onClick={handleToggleActive}
                        disabled={isPending}
                     >
                        {isActive ? (
                           <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Ẩn món ăn
                           </>
                        ) : (
                           <>
                              <Eye className="mr-2 h-4 w-4" />
                              Hiển thị món ăn
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
                           ? "Đánh dấu hết hàng"
                           : "Đánh dấu có sẵn"}
                     </DropdownMenuItem>

                     <DropdownMenuSeparator />

                     <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                        disabled={isPending}
                     >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                     </DropdownMenuItem>
                  </>
               )}

               {deletedAt && (
                  <DropdownMenuItem
                     onClick={handleRestore}
                     disabled={isPending}
                  >
                     <RotateCcw className="mr-2 h-4 w-4" />
                     Khôi phục
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
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                     Bạn có chắc chắn muốn xóa món ăn "{name}" không? Hành động
                     này có thể được hoàn tác.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                     Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDelete}
                     disabled={isPending}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     {isPending ? "Đang xóa..." : "Xóa"}
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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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
              ? "Có sẵn"
              : "Hết hàng"}
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
         } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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
         {isPending ? "..." : isActive ? "Hiện" : "Ẩn"}
      </Button>
   );
}
