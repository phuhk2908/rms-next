import { queryData, QueryOptions } from "@/helpers/prisma";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getAllMenuCategories = async () => {
   const menuCategories = await prisma.menuCategory.findMany({
      omit: {
         imageId: true,
      },
      include: {
         image: true,
         _count: {
            select: {
               menuItems: true,
            },
         },
      },
   });

   return menuCategories;
};

export const getMenuCategoryById = async (menuCategoryId: string) => {
   const menuCategory = await prisma.menuCategory.findUnique({
      where: {
         id: menuCategoryId,
      },
      include: {
         image: true,
      },
   });

   if (!menuCategory) {
      return null;
   }

   return menuCategory;
};
