import { Dispatch, SetStateAction, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
   CheckCircle,
   CircleCheckBig,
   CircleSlash2,
   Clock,
   XCircle,
   Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateDays, formatDate } from "@/lib/utils";
import { Leave } from "@/types/leave";
import { toast } from "sonner";
import { updateStatus } from "@/actions/leave";
import { UserRole } from "@/lib/generated/prisma";

export type LeaveRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

interface DetailsDialogProps {
   detailData: Leave;
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
   onStatusUpdate?: (newStatus: LeaveRequestStatus) => void;
}

export function StatusBadge({ status }: { status: LeaveRequestStatus }) {
   switch (status) {
      case "PENDING":
         return (
            <Badge
               variant="outline"
               className="border-yellow-500 text-yellow-500"
            >
               <Clock className="mr-1 h-3 w-3" />
               Pending
            </Badge>
         );
      case "APPROVED":
         return (
            <Badge
               variant="outline"
               className="border-green-500 text-green-500"
            >
               <CheckCircle className="mr-1 h-3 w-3" />
               Approved
            </Badge>
         );
      case "REJECTED":
         return (
            <Badge variant="outline" className="border-red-500 text-red-500">
               <XCircle className="mr-1 h-3 w-3" />
               Rejected
            </Badge>
         );
   }
}

export function DetailsDialog({
   detailData,
   open,
   setOpen,
   onStatusUpdate,
}: DetailsDialogProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [currentStatus, setCurrentStatus] = useState(detailData.status);

   const handleStatusUpdate = async (newStatus: LeaveRequestStatus) => {
      try {
         const updateData = {
            id: detailData.id,
            startDate: detailData.startDate,
            endDate: detailData.endDate,
            reason: detailData.reason,
            status: newStatus,
            employee: {
               user: {
                  name: detailData.employee.user.name,
                  email: detailData.employee.user.email,
                  role: detailData.employee.user.role ?? UserRole.STAFF,
               },
            },
         };

         const result = await updateStatus(updateData);

         if (result.status === "success") {
            toast.success(result.message);
            setCurrentStatus(newStatus);

            if (onStatusUpdate) {
               onStatusUpdate(newStatus);
            }

            setTimeout(() => {
               setOpen(false);
            }, 1500);
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.log(error);
         toast.error("Something went wrong");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Details Leave Request</DialogTitle>
               <DialogDescription className="sr-only"></DialogDescription>
            </DialogHeader>
            {detailData && (
               <div className="space-y-6">
                  <div className="grid grid-cols-12 gap-4">
                     <div className="col-span-4">
                        <Label className="text-sm font-medium">Full Name</Label>
                        <p className="text-muted-foreground text-sm">
                           {detailData.employee?.user.name}
                        </p>
                     </div>
                     <div className="col-span-6">
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-muted-foreground text-sm">
                           {detailData.employee?.user.email}
                        </p>
                     </div>
                     <div className="col-span-2">
                        <Label className="text-sm font-medium">Role</Label>
                        <p className="text-muted-foreground text-sm">
                           {detailData.employee?.user.role || "N/A"}
                        </p>
                     </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                     <div className="col-span-3">
                        <Label className="text-sm font-medium">
                           Start Date
                        </Label>
                        <p className="text-muted-foreground text-sm">
                           {formatDate(detailData.startDate)}
                        </p>
                     </div>
                     <div className="col-span-3">
                        <Label className="text-sm font-medium">End Date</Label>
                        <p className="text-muted-foreground text-sm">
                           {formatDate(detailData.endDate)}
                        </p>
                     </div>
                     <div className="col-span-3">
                        <Label className="text-sm font-medium">Duration</Label>
                        <p className="text-muted-foreground text-sm">
                           {calculateDays(
                              detailData.startDate.toISOString(),
                              detailData.endDate.toISOString(),
                           )}
                           ngày
                        </p>
                     </div>
                     <div className="col-span-3">
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">
                           <StatusBadge status={currentStatus} />
                        </div>
                     </div>
                  </div>
                  <div>
                     <Label className="text-sm font-medium">Reason</Label>
                     <Textarea value={detailData.reason} disabled />
                  </div>
                  <DialogFooter className="flex justify-between gap-2">
                     <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                     >
                        Cancel
                     </Button>

                     <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate("REJECTED")}
                        disabled={isLoading || currentStatus === "REJECTED"}
                     >
                        {isLoading ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <CircleSlash2 className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Processing..." : "Rejected"}
                     </Button>

                     <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleStatusUpdate("APPROVED")}
                        disabled={isLoading || currentStatus === "APPROVED"}
                     >
                        {isLoading ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <CircleCheckBig className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Processing..." : "Approved"}
                     </Button>
                  </DialogFooter>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
