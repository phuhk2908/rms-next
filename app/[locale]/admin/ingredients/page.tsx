import { DataTable } from "@/components/ui/data-table";
import {
   getIngredientsWithStock,
   getIngredientTransactions,
} from "@/data/ingredient";
import { ingredientColumns } from "./_components/ingredient-columns";
import { Metadata } from "next";

import { AddIngredientForm } from "./_components/add-ingredient-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   CardToolbar,
} from "@/components/ui/card";
import { IngredientOverview } from "./_components/ingredient-overview";
import { AddTransactionForm } from "./_components/add-transaction-form";
import { transactionColumns } from "./_components/transaction-columns";

export const metadata: Metadata = {
   title: "Admin | Ingredients",
};

export default async function Page() {
   const ingredients = await getIngredientsWithStock();
   const ingredientTransactions = await getIngredientTransactions();

   console.log(ingredients, ingredientTransactions);

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
                     <CardToolbar>
                        <AddIngredientForm />
                     </CardToolbar>
                  </CardHeader>

                  <CardContent>
                     <DataTable
                        columns={ingredientColumns}
                        data={ingredients}
                     />
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
                     <CardToolbar>
                        <AddTransactionForm ingredients={ingredients} />
                     </CardToolbar>
                  </CardHeader>

                  <CardContent>
                     <DataTable
                        columns={transactionColumns}
                        data={ingredientTransactions}
                     />
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </>
   );
}
