import { DataTable } from "@/components/ui/data-table";
import { getIngredientsWithStock } from "@/data/ingredient";
import { columns } from "./_components/columns";
import { Metadata } from "next";

import { AddIngredientForm } from "./_components/add-ingredient-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { IngredientOverview } from "./_components/ingredient-overview";

export const metadata: Metadata = {
   title: "Admin | Ingredients",
};

export default async function Page() {
   const ingredients = await getIngredientsWithStock();

   console.log(ingredients);
  
   return (
      <div className="p-4 lg:p-6">
         <IngredientOverview />
         <AddIngredientForm />
         <Tabs defaultValue="ingredients">
            <TabsList>
               <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
               <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients">
               <Card>
                  <CardContent>
                     <DataTable columns={columns} data={ingredients} />
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="transactions">
               <p>Transactions</p>
            </TabsContent>
         </Tabs>
      </div>
   );
}
