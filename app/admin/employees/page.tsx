import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import React from "react";
import { columns } from "./_components/columns";
import { getAllEmployees } from "@/data/employees";
import EmployeeForm from "./_components/employee-form";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
   title: "Admin | Employees",
};

export default async function Page() {
   const employees = await getAllEmployees();

   return (
      <Card>
         <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
               Manage your restaurant&apos;s employees.
            </CardDescription>
            <CardAction>
               <EmployeeForm />
            </CardAction>
         </CardHeader>

         <CardContent>
            <DataTable columns={columns} data={employees} />
         </CardContent>
      </Card>
   );
}
