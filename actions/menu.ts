"use server";

import { getMenuCategoryById } from "@/data/menu-category";
import { requireAdmin } from "@/data/require-admin";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { revalidatePath } from "next/cache";
import { deleteFiles } from "./uploadthing";

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

export const updateMenuCategory = async (
   id: string,
   values: MenuItemFormValue,
) => {
   try {
      await requireAdmin();

      const validation = menuCategorySchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.menuCategory.update({
         where: { id: id },
         data: {
            slug: toSlug(validation.data.name),
            ...validation.data,
         },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category updated successfully.",
      };
   } catch {
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};

export const updateMenuCategoryStatus = async (
   id: string,
   isActive: boolean,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      await prisma.menuCategory.update({
         where: { id },
         data: { isActive },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category status updated successfully.",
      };
   } catch {
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};

export const deleteMenuCategory = async (id: string) => {
   try {
      await requireAdmin();

      const menuCategory = await getMenuCategoryById(id);

      if (!menuCategory) {
         return {
            status: "error",
            message: "Menu category not found.",
         };
      }

      await deleteFiles(menuCategory.image as string);

      await prisma.menuCategory.delete({
         where: { id },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category deleted successfully.",
      };
   } catch {
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};
