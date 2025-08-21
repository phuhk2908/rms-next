import { z } from "zod";

export const recipeSchema = z.object({
   name: z.string().min(1, { message: "Name is required" }),
   description: z.string().optional(),
   instructions: z.string().optional(),
   estimatedCost: z
      .number()
      .min(0, { message: "Estimated cost must be positive" })
      .optional(),
   preparationTime: z
      .number()
      .min(1, { message: "Preparation time must be at least 1 minute" })
      .optional(),
   servingSize: z
      .number()
      .min(1, { message: "Serving size must be at least 1" })
      .default(1),
   menuItemId: z.string().optional(),
   ingredients: z
      .array(
         z.object({
            ingredientId: z
               .string()
               .min(1, { message: "Ingredient is required" }),
            quantity: z
               .number()
               .min(0, { message: "Quantity must be positive" }),
         }),
      )
      .optional(),
});

export const updateRecipeSchema = recipeSchema.extend({
   id: z.string().min(1, { message: "Recipe ID is required" }),
});

export type RecipeFormValue = z.infer<typeof recipeSchema>;
export type UpdateRecipeFormValue = z.infer<typeof updateRecipeSchema>;
