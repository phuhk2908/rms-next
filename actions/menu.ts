"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { revalidatePath } from "next/cache";

export const createMenuCategory = async (
   values: MenuItemFormValue,
): Promise<ApiResponse> => {
   try {
      const validation = menuCategorySchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Failed to create menu category",
         };
      }

      await prisma.menuCategory.create({
         data: {
            ...validation.data,
         },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Create menu category successfully",
      };
   } catch (error) {
      return {
         status: "error",
         message: "Failed to create menu category",
      };
   }
};
