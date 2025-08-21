"use server";

import { requireAdmin } from "@/data/require-admin";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { RecipeFormValue, updateRecipeSchema } from "@/schemas/recipe";
import { revalidatePath } from "next/cache";

export const createRecipe = async (
   values: RecipeFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      // Generate unique slug from name
      const baseSlug = toSlug(values.name);
      let uniqueSlug = baseSlug;
      let counter = 1;

      // Check for existing slug and make it unique
      while (await prisma.recipe.findUnique({ where: { slug: uniqueSlug } })) {
         uniqueSlug = `${baseSlug}-${counter}`;
         counter++;
      }

      // Create recipe with ingredients
      const recipe = await prisma.recipe.create({
         data: {
            name: values.name,
            description: values.description || null,
            instructions: values.instructions || null,
            slug: uniqueSlug,
            estimatedCost: values.estimatedCost || null,
            preparationTime: values.preparationTime || null,
            servingSize: values.servingSize || 1,
            ingredients: {
               create:
                  values.ingredients?.map((ingredient) => ({
                     ingredientId: ingredient.ingredientId,
                     quantity: ingredient.quantity,
                  })) || [],
            },
         },
      });

      // If menuItemId is provided, update the MenuItem to reference this recipe
      if (values.menuItemId && values.menuItemId !== "none") {
         await prisma.menuItem.update({
            where: { id: values.menuItemId },
            data: { recipeId: recipe.id },
         });
      }

      revalidatePath("/admin/recipes");

      return {
         status: "success",
         message: "Recipe created successfully.",
      };
   } catch (error) {
      console.error("Error creating recipe:", error);
      return {
         status: "error",
         message: "Failed to create recipe. Please try again.",
      };
   }
};

export const updateRecipe = async (
   values: RecipeFormValue & { id: string },
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = updateRecipeSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const { id, ...updateData } = validation.data;

      // Check if recipe exists
      const existingRecipe = await prisma.recipe.findUnique({
         where: { id },
      });

      if (!existingRecipe) {
         return {
            status: "error",
            message: "Recipe not found.",
         };
      }

      // Generate new slug if name changed
      let newSlug = existingRecipe.slug;
      if (updateData.name !== existingRecipe.name) {
         const baseSlug = toSlug(updateData.name);
         let uniqueSlug = baseSlug;
         let counter = 1;

         // Check for existing slug and make it unique (excluding current recipe)
         while (
            await prisma.recipe.findFirst({
               where: {
                  slug: uniqueSlug,
                  id: { not: id },
               },
            })
         ) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
         }
         newSlug = uniqueSlug;
      }

      // Update recipe
      await prisma.$transaction(async (tx) => {
         // Delete existing ingredients
         await tx.recipeIngredient.deleteMany({
            where: { recipeId: id },
         });

         // Update recipe with new data
         await tx.recipe.update({
            where: { id },
            data: {
               name: updateData.name,
               description: updateData.description || null,
               instructions: updateData.instructions || null,
               slug: newSlug,
               estimatedCost: updateData.estimatedCost || null,
               preparationTime: updateData.preparationTime || null,
               servingSize: updateData.servingSize || 1,
               ingredients: {
                  create:
                     updateData.ingredients?.map((ingredient) => ({
                        ingredientId: ingredient.ingredientId,
                        quantity: ingredient.quantity,
                     })) || [],
               },
            },
         });

         // Handle menuItem relationship
         if (updateData.menuItemId && updateData.menuItemId !== "none") {
            // Update the MenuItem to reference this recipe
            await tx.menuItem.update({
               where: { id: updateData.menuItemId },
               data: { recipeId: id },
            });
         } else {
            // Remove recipe reference from any existing menuItem
            await tx.menuItem.updateMany({
               where: { recipeId: id },
               data: { recipeId: null },
            });
         }
      });

      revalidatePath("/admin/recipes");

      return {
         status: "success",
         message: "Recipe updated successfully.",
      };
   } catch (error) {
      console.error("Error updating recipe:", error);
      return {
         status: "error",
         message: "Failed to update recipe. Please try again.",
      };
   }
};

export const deleteRecipe = async (id: string): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      // Check if recipe exists
      const existingRecipe = await prisma.recipe.findUnique({
         where: { id },
      });

      if (!existingRecipe) {
         return {
            status: "error",
            message: "Recipe not found.",
         };
      }

      // Soft delete recipe
      await prisma.recipe.update({
         where: { id },
         data: {
            deletedAt: new Date(),
         },
      });

      revalidatePath("/admin/recipes");

      return {
         status: "success",
         message: "Recipe deleted successfully.",
      };
   } catch (error) {
      console.error("Error deleting recipe:", error);
      return {
         status: "error",
         message: "Failed to delete recipe. Please try again.",
      };
   }
};

export const duplicateRecipe = async (id: string): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const originalRecipe = await prisma.recipe.findUnique({
         where: { id },
         include: {
            ingredients: true,
         },
      });

      if (!originalRecipe) {
         return {
            status: "error",
            message: "Recipe not found.",
         };
      }

      // Generate unique slug for duplicated recipe
      const baseSlug = `${originalRecipe.slug}-copy`;
      let uniqueSlug = baseSlug;
      let counter = 1;

      while (await prisma.recipe.findUnique({ where: { slug: uniqueSlug } })) {
         uniqueSlug = `${baseSlug}-${counter}`;
         counter++;
      }

      // Create duplicate recipe
      await prisma.recipe.create({
         data: {
            name: `${originalRecipe.name} (Copy)`,
            description: originalRecipe.description,
            instructions: originalRecipe.instructions,
            slug: uniqueSlug,
            estimatedCost: originalRecipe.estimatedCost,
            preparationTime: originalRecipe.preparationTime,
            servingSize: originalRecipe.servingSize,
            ingredients: {
               create: originalRecipe.ingredients.map((ingredient) => ({
                  ingredientId: ingredient.ingredientId,
                  quantity: ingredient.quantity,
               })),
            },
         },
      });

      revalidatePath("/admin/recipes");

      return {
         status: "success",
         message: "Recipe duplicated successfully.",
      };
   } catch (error) {
      console.error("Error duplicating recipe:", error);
      return {
         status: "error",
         message: "Failed to duplicate recipe. Please try again.",
      };
   }
};
