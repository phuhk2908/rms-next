import { Metadata } from "next";
import React from "react";
import { getAllEmployees } from "@/data/employees";
import EmployeeForm from "./_components/employee-form";
import {
   Card,
   CardContent,
   CardDescription,
   CardTitle,
} from "@/components/ui/card";
import EmployeeDataGrid from "./_components/columns";

export const metadata: Metadata = {
   title: "Admin | Employees",
};

export default async function Page() {
   const employees = await getAllEmployees();
   console.log(employees);

   return (
      <div>
         <div className="flex w-full items-center justify-between px-2 py-4">
            <div>
               <CardTitle>Employees</CardTitle>
               <CardDescription>
                  Manage your restaurant&apos;s employee
               </CardDescription>
            </div>
            <EmployeeForm />
         </div>
         <Card>
            <CardContent>
               <EmployeeDataGrid employeeData={employees} />
            </CardContent>
         </Card>
      </div>
   );
}
