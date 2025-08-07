"use server";

import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import { revalidatePath } from "next/cache";

export const createIngredient = async (
   values: IngredientFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = ingredientSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.ingredient.create({
         data: {
            ...validation.data,
            ...(validation.data.image && {
               image: {
                  create: {
                     key: validation.data.image.key,
                     ufsUrl: validation.data.image.ufsUrl,
                  },
               },
            }),
            slug: toSlug(validation.data.name),
         },
      });

      revalidatePath("/admin/ingredients");

      return {
         status: "success",
         message: "Ingredient created successfully.",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return { status: "error", message: error.message };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};
