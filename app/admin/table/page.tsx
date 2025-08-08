import React from "react";
import TableForm from "./_components/table-form";
import { Metadata } from "next";
import { getAllTables } from "@/data/table";

export const metadata: Metadata = {
   title: "Admin | Restaurant Table",
};

export default async function TablePage() {
   const tables = await getAllTables();
   return <TableForm data={tables} />;
}
