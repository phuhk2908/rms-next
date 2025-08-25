import {
   Card,
   CardContent,
   CardDescription,
   CardTitle,
} from "@/components/ui/card";
import { getAllLeave } from "@/data/leave";
import React from "react";
import LeaveDataGrid from "./_components/columns";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Admin | Leave Requests",
};

export default async function Page() {
   const leaveRequest = await getAllLeave();
   return (
      <div>
         <div className="flex w-full items-center justify-between px-2 py-4">
            <div>
               <CardTitle>Employees</CardTitle>
               <CardDescription>
                  Manage your restaurant&apos;s employee
               </CardDescription>
            </div>
         </div>
         <Card>
            <CardContent>
               <LeaveDataGrid leaveData={leaveRequest} />
            </CardContent>
         </Card>
      </div>
   );
}
