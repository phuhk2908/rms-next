import { deleteShift } from "@/actions/shift";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface ShiftProps {
   shiftId: any;
   shiftName: any;
   openDelete: boolean;
   setOpenDelete: Dispatch<SetStateAction<boolean>>;
}

const DeleteShiftDialog = ({
   shiftId,
   shiftName,
   openDelete,
   setOpenDelete,
}: ShiftProps) => {
   return (
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-6 w-6" />
                  Delete Confirmation
               </DialogTitle>
               <DialogDescription className="sr-only"></DialogDescription>
            </DialogHeader>
            <div>
               This will permanently delete{" "}
               <span className="text-red-500">{shiftName}</span> . This action
               cannot be undone.
            </div>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
               </DialogClose>
               <Button
                  type="submit"
                  onClick={async () => {
                     const res = await deleteShift(shiftId);
                     if (res.status === "success") {
                        toast.success(res.message);
                     } else {
                        toast.error(res.message);
                     }
                  }}
               >
                  Delete
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default DeleteShiftDialog;
