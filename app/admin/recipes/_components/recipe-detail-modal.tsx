"use client";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

export function RecipeDetailModal({
   recipe,
   onClose,
}: {
   recipe: any;
   onClose: () => void;
}) {
   if (!recipe) return null;

   return (
      <Dialog open={!!recipe} onOpenChange={onClose}>
         <DialogContent className="max-w-3xl">
            <DialogHeader>
               <DialogTitle>{recipe.name}</DialogTitle>
               <DialogDescription>{recipe.description}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                  <h4 className="mb-3 font-semibold">Recipe Details</h4>
                  <div className="space-y-1 text-sm">
                     <p>Prep Time: {recipe.prepTime} min</p>
                     <p>Cook Time: {recipe.cookTime} min</p>
                     <p>Total Time: {recipe.totalTime} min</p>
                     <p>
                        Difficulty:{" "}
                        <Badge variant="outline">{recipe.difficulty}</Badge>
                     </p>
                     <p>Serving Size: {recipe.servingSize}</p>
                  </div>
               </div>
               <div>
                  <h4 className="mb-3 font-semibold">Cost Analysis</h4>
                  <div className="space-y-1 text-sm">
                     <p>Total Cost: ${recipe.totalCost.toFixed(2)}</p>
                     <p>Profit Margin: {recipe.profitMargin.toFixed(1)}%</p>
                     <p>
                        Menu Price: $
                        {(
                           recipe.totalCost /
                           (1 - recipe.profitMargin / 100)
                        ).toFixed(2)}
                     </p>
                  </div>
               </div>
            </div>

            <div>
               <h4 className="mt-4 mb-2 font-semibold">Ingredients</h4>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Cost</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {recipe.ingredients.map((ing: any, i: number) => (
                        <TableRow key={i}>
                           <TableCell>{ing.ingredientName}</TableCell>
                           <TableCell>{ing.quantity}</TableCell>
                           <TableCell>{ing.unit}</TableCell>
                           <TableCell>${ing.cost.toFixed(2)}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>

            <div>
               <h4 className="mt-4 mb-2 font-semibold">Instructions</h4>
               <ol className="list-inside list-decimal space-y-1 text-sm">
                  {recipe.instructions.map((step: string, i: number) => (
                     <li key={i}>{step}</li>
                  ))}
               </ol>
            </div>
         </DialogContent>
      </Dialog>
   );
}
