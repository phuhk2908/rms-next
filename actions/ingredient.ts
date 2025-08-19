"use server";

import { requireAdmin } from "@/data/require-admin";
import { tryCatch } from "@/helpers/try-catch";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import {
   AddIngredientTransactionFormValues,
   addIngredientTransactionSchema,
} from "@/schemas/ingredient-transaction";
import { revalidatePath } from "next/cache";

export const createIngredient = async (values: IngredientFormValue) => {
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
         return {
            status: "error",
            message: error.message,
         };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};

export const updateIngredient = async (
   id: string,
   values: IngredientFormValue,
) => {
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

      await prisma.ingredient.update({
         where: { id },
         data: {
            ...validation.data,
            ...(validation.data.image && {
               image: {
                  update: {
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
         message: "Ingredient updated successfully.",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: error.message,
         };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};

export const createIngredientTransaction = async (
   values: AddIngredientTransactionFormValues,
) => {
   try {
      await requireAdmin();

      const validation = addIngredientTransactionSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const { data } = validation;

      await prisma.ingredientTransaction.create({
         data: {
            ...data,
         },
      });

      revalidatePath("/admin/ingredients");

      return {
         status: "success",
         message: "Ingredient transaction added successfully.",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         console.log(error.message);
         return {
            status: "error",
            message: "Internal Service Error",
         };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};
