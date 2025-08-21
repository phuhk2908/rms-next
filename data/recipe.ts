import { prisma } from "@/lib/prisma";

export const getAllRecipes = async (includeDeleted: boolean = false) => {
   const recipes = await prisma.recipe.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
         ingredients: {
            include: {
               ingredient: {
                  select: {
                     id: true,
                     name: true,
                     unit: true,
                  },
               },
            },
            where: {
               deletedAt: null,
            },
         },
         menuItem: {
            select: {
               id: true,
               name: true,
            },
         },
      },
      orderBy: {
         createdAt: "desc",
      },
   });
   return recipes;
};

export const getRecipes = async (includeDeleted: boolean = false) => {
   return getAllRecipes(includeDeleted);
};

export const getRecipeById = async (id: string) => {
   const recipe = await prisma.recipe.findUnique({
      where: {
         id,
         deletedAt: null,
      },
      include: {
         ingredients: {
            include: {
               ingredient: {
                  select: {
                     id: true,
                     name: true,
                     unit: true,
                  },
               },
            },
            where: {
               deletedAt: null,
            },
         },
         menuItem: {
            select: {
               id: true,
               name: true,
            },
         },
      },
   });
   return recipe;
};

export const getRecipeBySlug = async (slug: string) => {
   const recipe = await prisma.recipe.findUnique({
      where: {
         slug,
         deletedAt: null,
      },
      include: {
         ingredients: {
            include: {
               ingredient: {
                  select: {
                     id: true,
                     name: true,
                     unit: true,
                     code: true,
                  },
               },
            },
            where: {
               deletedAt: null,
            },
         },
         menuItem: {
            select: {
               id: true,
               name: true,
            },
         },
      },
   });
   return recipe;
};

export const getRecipesByMenuItemId = async (menuItemId: string) => {
   // Since MenuItem has recipeId foreign key, we need to find MenuItem first
   const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      select: { recipeId: true },
   });

   if (!menuItem?.recipeId) {
      return [];
   }

   const recipe = await getRecipeById(menuItem.recipeId);
   return recipe ? [recipe] : [];
};
