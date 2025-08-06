import { DataTable } from "@/components/ui/data-table";
import { getIngredientsWithStock } from "@/data/ingredient";
import { columns } from "./_components/columns";
import { Metadata } from "next";

import { IngredientForm } from "./_components/ingredient-form";
import { DatePickerWithRange } from "@/components/calendar";

export const metadata: Metadata = {
   title: "Admin | Ingredients",
};

export default async function Page() {
   const ingredients = await getIngredientsWithStock();

   return (
      <div className="p-4 lg:p-6">
         <IngredientForm />
         <DataTable columns={columns} data={ingredients} />
      </div>
   );
}
