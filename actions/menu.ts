"use server";

import { getMenuCategoryById } from "@/data/menu-category";
import { requireAdmin } from "@/data/require-admin";
import { tryCatch } from "@/helpers/try-catch";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { revalidatePath } from "next/cache";
import { deleteFiles } from "./uploadthing";

export const createMenuCategory = async (values: MenuItemFormValue) => {
   return await tryCatch(async () => {
      await requireAdmin();

      const validation = menuCategorySchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const { image, ...rest } = validation.data;

      await prisma.menuCategory.create({
         data: {
            ...rest,
            ...(image && {
               image: {
                  create: {
                     key: image.key,
                     ufsUrl: image.ufsUrl,
                  },
               },
            }),
            slug: toSlug(validation.data.name),
         },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category created successfully.",
      };
   });
};

export const updateMenuCategory = async (
   id: string,
   values: MenuItemFormValue,
) => {
   return await tryCatch(async () => {
      await requireAdmin();

      const validation = menuCategorySchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const existingCategory = await getMenuCategoryById(id);
      if (
         existingCategory?.image?.key &&
         values.image?.key !== existingCategory.image.key
      ) {
         await deleteFiles(existingCategory.image.key);
      }

      const { image, ...rest } = validation.data;

      await prisma.menuCategory.update({
         where: { id: id },
         data: {
            ...rest,
            ...(image && {
               image: {
                  upsert: {
                     create: {
                        key: image.key,
                        ufsUrl: image.ufsUrl,
                     },
                     update: {
                        key: image.key,
                        ufsUrl: image.ufsUrl,
                     },
                  },
               },
            }),
            slug: toSlug(validation.data.name),
         },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category updated successfully.",
      };
   });
};

export const updateMenuCategoryStatus = async (
   id: string,
   isActive: boolean,
) => {
   return await tryCatch(async () => {
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
   });
};

export const deleteMenuCategory = async (id: string) => {
   return await tryCatch(async () => {
      await requireAdmin();

      const menuCategory = await getMenuCategoryById(id);

      if (!menuCategory) {
         return {
            status: "error",
            message: "Menu category not found.",
         };
      }

      if (menuCategory.image?.key) {
         await deleteFiles(menuCategory.image.key);
      }

      await prisma.menuCategory.delete({
         where: { id },
      });

      revalidatePath("/admin/menu/categories");

      return {
         status: "success",
         message: "Menu category deleted successfully.",
      };
   });
};
