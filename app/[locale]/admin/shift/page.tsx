import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import React from "react";
import { columns } from "./_components/columns";
import { getAllShift } from "@/data/shift";
import ShiftForm from "./_components/shift-form";

export const metadata: Metadata = {
   title: "Admin | Shifts",
};

export default async function Page() {
   const shifts = await getAllShift();

   return (
      <div className="p-4 lg:p-6">
         <div className="flex w-full items-center justify-end">
            <ShiftForm />
         </div>
         <div>
            <DataTable columns={columns} data={shifts} />
         </div>
      </div>
   );
}
