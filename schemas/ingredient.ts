import { z } from "zod";
import { IngredientUnit } from "@/lib/generated/prisma";

export const ingredientSchema = z.object({
   name: z.string().min(1, { message: "Name is required" }),
   code: z.string().min(1, { message: "Code is required" }),
   image: z.object({
      key: z.string(),
      ufsUrl: z.string(),
   }),
   unit: z.enum(IngredientUnit),
});

export type IngredientFormValue = z.infer<typeof ingredientSchema>;
