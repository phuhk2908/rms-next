import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics } from "@/data/analytics";

export async function IngredientOverview() {
   const analytics = await getAnalytics();

   const {
      totalIngredients,
      lowStock,
      outOfStock,
      totalIngredientTransactions,
   } = analytics;
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Total Ingredients
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{totalIngredients}</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{lowStock}</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Out of Stock
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{outOfStock}</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Total Transactions
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">
                  {totalIngredientTransactions}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
