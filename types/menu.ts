import { Prisma } from "@/lib/generated/prisma";

export enum MenuItemStatus {
   AVAILABLE = "AVAILABLE",
   UNAVAILABLE = "UNAVAILABLE",
}

export type MenuCategory = Prisma.MenuCategoryGetPayload<{
   omit: {
      imageId: true;
   };
   include: {
      image: true;
   };
}>;

export type MenuItem = Prisma.MenuItemGetPayload<{
   include: {
      category: {
         include: Prisma.MenuCategoryInclude;
      };
      images: true;
      recipe: true;
   };
}>;

export type AddMenuItemInput = Omit<
   MenuItem,
   | "id"
   | "createdAt"
   | "updatedAt"
   | "category"
   | "recipe"
   | "recipeId"
   | "slug"
>;
