import { getAllTimeKeeping } from "@/data/time-keeping";
import TimeKeepingDateGrid from "./_components/columns";
import { Metadata } from "next";
import {
   Card,
   CardContent,
   CardDescription,
   CardTitle,
} from "@/components/ui/card";
import TimeEntryForm from "./_components/time-entry-form";
import { getAllEmployees } from "@/data/employees";
import { getAllShift } from "@/data/shift";

export const metadata: Metadata = {
   title: "Admin | Time Keeping",
};
export default async function Page() {
   const timeKeeping = await getAllTimeKeeping();
   const employees = await getAllEmployees();
   const shifts = await getAllShift();
   return (
      <div>
         <div className="flex w-full items-center justify-between px-2 py-4">
            <div>
               <CardTitle>Time Keeping</CardTitle>
               <CardDescription>
                  Manage your employee&apos;s shift
               </CardDescription>
            </div>
            <TimeEntryForm employees={employees} shifts={shifts} />
         </div>
         <Card>
            <CardContent>
               <TimeKeepingDateGrid timeKeepingData={timeKeeping} />
            </CardContent>
         </Card>
      </div>
   );
}
