import { queryData, QueryOptions } from "@/helpers/prisma";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getAllMenuCategories = cache(async (options?: QueryOptions) => {
  const menuCategories = await queryData("menuCategory", options);

  return menuCategories;
});

export const getMenuCategoryById = async (menuCategoryId: string) => {
  const menuCategory = await prisma.menuCategory.findUnique({
    where: {
      id: menuCategoryId,
    },
  });

  return menuCategory;
};
