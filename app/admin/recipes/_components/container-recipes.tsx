"use client";

import { useState, useTransition } from "react";
import { RecipeCard } from "./recipe-card";
import { RecipeDetailModal } from "./recipe-detail-modal";
import { RecipeFormSheet } from "./recipe-form";
import type { RecipeWithRelations } from "@/types/recipe";
import { deleteRecipe, duplicateRecipe } from "@/actions/recipe";
import { tryCatch } from "@/helpers/try-catch";
import { toast } from "sonner";

const ContainerRecipes = ({
   recipes,
   menuItems,
   ingredients,
}: {
   recipes: RecipeWithRelations[];
   menuItems: any[];
   ingredients: any[];
}) => {
   const [selectedRecipe, setSelectedRecipe] =
      useState<RecipeWithRelations | null>(null);
   const [editingRecipe, setEditingRecipe] =
      useState<RecipeWithRelations | null>(null);
   const [isPending, startTransition] = useTransition();

   const handleDeleteRecipe = async (recipeId: string) => {
       startTransition(async () => {
         const { data: result, error } = await tryCatch(deleteRecipe(recipeId));

         if (error) {
            toast.error("Something went wrong. Please try again.");
            return;
         }

         if (result?.status === "success") {
            toast.success(result.message);
         } else if (result?.status === "error") {
            toast.error(result.message);
         }
      });
   };

   const handleDuplicateRecipe = async (recipeId: string) => {
      startTransition(async () => {
         const { data: result, error } = await tryCatch(
            duplicateRecipe(recipeId),
         );

         if (error) {
            toast.error("Something went wrong. Please try again.");
            return;
         }

         if (result?.status === "success") {
            console.log(result);

            toast.success(result.message);
         } else if (result?.status === "error") {
            toast.error(result.message);
         }
      });
   };

   const handleEditRecipe = (recipe: RecipeWithRelations) => {
      setEditingRecipe(recipe);
   };

   return (
      <>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
               <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                  onEdit={() => handleEditRecipe(recipe)}
                  onDelete={() => handleDeleteRecipe(recipe.id)}
                  onDuplicate={() => handleDuplicateRecipe(recipe.id)}
                  isDeleting={isPending}
               />
            ))}
         </div>
         <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onDuplicate={handleDuplicateRecipe}
            isDeleting={isPending}
         />
         <RecipeFormSheet
            recipe={editingRecipe}
            menuItems={menuItems}
            ingredients={ingredients}
            isOpen={!!editingRecipe}
            onOpenChange={(open) => {
               if (!open) {
                  setEditingRecipe(null);
               }
            }}
            hideTrigger={true}
         />
      </>
   );
};

export default ContainerRecipes;
