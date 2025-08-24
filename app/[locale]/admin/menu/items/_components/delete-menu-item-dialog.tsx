"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteMenuItem, hardDeleteMenuItem } from "@/actions/menu/menu-items";
import { toast } from "sonner";
import { tryCatch } from "@/helpers/try-catch";

interface DeleteMenuItemDialogProps {
  menuItemId: string;
  menuItemName: string;
  trigger?: React.ReactNode;
}

export function DeleteMenuItemDialog({
  menuItemId,
  menuItemName,
  trigger,
}: DeleteMenuItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSoftDeletePending, startSoftDeleteTransition] = useTransition();
  const [isHardDeletePending, startHardDeleteTransition] = useTransition();

  const handleSoftDelete = () => {
    startSoftDeleteTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteMenuItem(menuItemId),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result?.success) {
        toast.success(result.message || "Moved the item to the trash");
        setIsOpen(false);
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
        toast.success(result.message || "Permanently deleted the item");
        setIsOpen(false);
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  const isPending = isSoftDeletePending || isHardDeletePending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <div>{trigger}</div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent text-red-600 hover:text-red-700"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Menu Item
          </DialogTitle>
          <DialogDescription className="text-left">
            Choose how you want to delete the item{" "}
            <strong>&quot;{menuItemName}&quot;</strong>:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">
                  Move to Trash (Temporary Delete)
                </h4>
                <p className="mt-1 text-sm text-yellow-700">
                  Hide this item from the menu. You can restore it anytime.
                </p>
                <Button
                  onClick={handleSoftDelete}
                  disabled={isPending}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  {isSoftDeletePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Move to Trash
                </Button>
              </div>
            </div>
          </div>

          {/* Hard Delete Option */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">
                  Permanently Delete (Irreversible)
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  Completely delete this item and all related images. This
                  action cannot be undone.
                </p>
                <Button
                  onClick={handleHardDelete}
                  disabled={isPending}
                  variant="destructive"
                  size="sm"
                  className="mt-3"
                >
                  {isHardDeletePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                  )}
                  Permanently Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
