import { prisma } from "@/lib/prisma";

export const getAllRecipes = async (includeDeleted: boolean = false) => {
   const Recipes = await prisma.recipe.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
         menuItem: true,
      },
   });
   return Recipes;
};
