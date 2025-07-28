"use server";

import { requireAdmin } from "@/data/require-admin";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { revalidatePath } from "next/cache";

export const createMenuCategory = async (
   values: MenuItemFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = menuCategorySchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error.flatten().fieldErrors,
         };
      }

      await prisma.menuCategory.create({
         data: {
            slug: toSlug(validation.data.name),
            ...validation.data,
         },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category created successfully.",
      };
   } catch (error) {
      console.error("CREATE_MENU_CATEGORY_ERROR:", error);

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};
