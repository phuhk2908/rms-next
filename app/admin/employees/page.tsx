import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import React from "react";
import { columns } from "./_components/columns";
import { getAllEmployees } from "@/data/employees";
import EmployeeForm from "./_components/employee-form";
export const metadata: Metadata = {
   title: "Admin | Employees",
};

export default async function Page() {
   const employees = await getAllEmployees();
   console.log(employees);
   return (
      <div className="p-4 lg:p-6">
         <div className="flex w-full items-center justify-end">
            <EmployeeForm />
         </div>
         <div>
            <DataTable columns={columns} data={employees} />
         </div>
      </div>
   );
}
