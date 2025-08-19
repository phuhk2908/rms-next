import { IngredientTransactionType } from "@/lib/generated/prisma";
import { z } from "zod";

export const addIngredientTransactionSchema = z
   .object({
      ingredientId: z.string().min(1, "Please select an ingredient"),
      type: z.enum(IngredientTransactionType),
      quantity: z.coerce
         .number<number>()
         .min(1, "Quantity must be greater than 0"),
      price: z.coerce
         .number<number>()
         .min(1, "Price must be greater than 0"),
      notes: z.string().optional(),
      createdById: z.string().optional(),
   })
   .refine(
      (data) => {
         if (data.type === IngredientTransactionType.IMPORT) {
            return data.price !== null && data.price && data.price > 0;
         }

         return true;
      },
      {
         error: "Price is required for an import transaction",
         path: ["price"],
      },
   );

export type AddIngredientTransactionFormValues = z.infer<
   typeof addIngredientTransactionSchema
>;
