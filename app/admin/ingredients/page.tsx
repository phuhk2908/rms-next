import { DataTable } from "@/components/ui/data-table";
import { getIngredientsWithStock } from "@/data/ingredient";
import { columns } from "./_components/columns";
import { Metadata } from "next";

import { AddIngredientForm } from "./_components/add-ingredient-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { IngredientOverview } from "./_components/ingredient-overview";
import { AddTransactionForm } from "./_components/add-transaction-form";

export const metadata: Metadata = {
   title: "Admin | Ingredients",
};

export default async function Page() {
   const ingredients = await getIngredientsWithStock();

   console.log(ingredients);

   return (
      <>
         <IngredientOverview />
         <Tabs defaultValue="ingredients" className="mt-4">
            <TabsList>
               <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
               <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients">
               <Card>
                  <CardHeader>
                     <CardTitle>Ingredients</CardTitle>
                     <CardDescription>
                        Manage your restaurant&apos;s ingredients.
                     </CardDescription>
                     <CardAction>
                        <AddIngredientForm />
                     </CardAction>
                  </CardHeader>

                  <CardContent>
                     <DataTable columns={columns} data={ingredients} />
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="transactions">
               <Card>
                  <CardHeader>
                     <CardTitle>Transactions</CardTitle>
                     <CardDescription>
                        Manage your ingredient transactions
                     </CardDescription>
                     <CardAction>
                        <AddTransactionForm ingredients={ingredients} />
                     </CardAction>
                  </CardHeader>

                  <CardContent></CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </>
   );
}
