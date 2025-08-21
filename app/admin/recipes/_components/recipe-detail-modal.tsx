"use client";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Copy } from "lucide-react";
import type { RecipeWithRelations } from "@/types/recipe";

export function RecipeDetailModal({
   recipe,
   onClose,
   onEdit,
   onDelete,
   onDuplicate,
   isDeleting = false,
}: {
   recipe: RecipeWithRelations | null;
   onClose: () => void;
   onEdit?: (recipe: RecipeWithRelations) => void;
   onDelete?: (recipeId: string) => void;
   onDuplicate?: (recipeId: string) => void;
   isDeleting?: boolean;
}) {
   if (!recipe) return null;
   console.log(recipe);

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
                     {recipe.preparationTime && (
                        <p>Preparation Time: {recipe.preparationTime} min</p>
                     )}
                     <p>Serving Size: {recipe.servingSize}</p>
                     {recipe.menuItem && (
                        <p>
                           Menu Item:{" "}
                           <Badge variant="outline">
                              {recipe.menuItem.name}
                           </Badge>
                        </p>
                     )}
                  </div>
               </div>
               <div>
                  <h4 className="mb-3 font-semibold">Cost Information</h4>
                  <div className="space-y-1 text-sm">
                     {recipe.estimatedCost && (
                        <p>
                           Estimated Cost: ${recipe.estimatedCost.toFixed(2)}
                        </p>
                     )}
                     <p>Ingredients: {recipe.ingredients.length} items</p>
                  </div>
               </div>
            </div>

            <div>
               <h4 className="mt-4 mb-2 font-semibold">Ingredients</h4>
               {recipe.ingredients.length > 0 ? (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Ingredient</TableHead>
                           <TableHead>Quantity</TableHead>
                           <TableHead>Unit</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {recipe.ingredients.map(
                           (recipeIngredient, i: number) => (
                              <TableRow key={i}>
                                 <TableCell>
                                    {recipeIngredient.ingredient.name}
                                 </TableCell>
                                 <TableCell>
                                    {recipeIngredient.quantity}
                                 </TableCell>
                                 <TableCell>
                                    {recipeIngredient.ingredient.unit}
                                 </TableCell>
                              </TableRow>
                           ),
                        )}
                     </TableBody>
                  </Table>
               ) : (
                  <p className="text-muted-foreground text-sm">
                     No ingredients specified
                  </p>
               )}
            </div>

            <div>
               <h4 className="mt-4 mb-2 font-semibold">Instructions</h4>
               <div className="bg-muted/50 rounded-md p-3 text-sm whitespace-pre-wrap">
                  {recipe.instructions}
               </div>
            </div>

            {(onEdit || onDelete || onDuplicate) && (
               <DialogFooter className="mt-6">
                  <div className="flex w-full gap-2 sm:w-auto">
                     {onEdit && (
                        <Button
                           variant="outline"
                           onClick={() => {
                              onEdit(recipe);
                              onClose();
                           }}
                        >
                           <Edit className="mr-2 h-4 w-4" />
                           Edit Recipe
                        </Button>
                     )}
                     {onDuplicate && (
                        <Button
                           variant="outline"
                           onClick={() => {
                              onDuplicate(recipe.id);
                              onClose();
                           }}
                           disabled={isDeleting}
                        >
                           <Copy className="mr-2 h-4 w-4" />
                           Duplicate
                        </Button>
                     )}
                     {onDelete && (
                        <Button
                           variant="destructive"
                           onClick={() => {
                              onDelete(recipe.id);
                              onClose();
                           }}
                           disabled={isDeleting}
                        >
                           <Trash2 className="mr-2 h-4 w-4" />
                           {isDeleting ? "Deleting..." : "Delete Recipe"}
                        </Button>
                     )}
                  </div>
               </DialogFooter>
            )}
         </DialogContent>
      </Dialog>
   );
}
