import { DataTable } from "@/components/ui/data-table";
import { getIngredientsWithStock } from "@/data/ingredient";
import { columns } from "./_components/columns";
import { Metadata } from "next";

import { IngredientForm } from "./_components/ingredient-form";

export const metadata: Metadata = {
   title: "Admin | Ingredients",
};

export default async function Page() {
   const ingredients = await getIngredientsWithStock();
   console.log(ingredients);

   return (
      <div className="p-4 lg:p-6">
         <IngredientForm mode="create" />
         <DataTable columns={columns} data={ingredients} />
      </div>
   );
}
