import {
   Card,
   CardContent,
   CardDescription,
   CardTitle,
} from "@/components/ui/card";
import { getAllLeave } from "@/data/leave";
import React from "react";
import LeaveDataGrid from "./_components/columns";

export default async function Page() {
   const leaves = await getAllLeave();
   console.log(leaves);
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
               <LeaveDataGrid leaveData={leaves} />
            </CardContent>
         </Card>
      </div>
   );
}
