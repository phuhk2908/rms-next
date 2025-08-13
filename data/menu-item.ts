import { prisma } from "@/lib/prisma";

export const getAllMenuItems = async (includeDeleted: boolean = false) => {
   const menuItems = await prisma.menuItem.findMany({
      where: includeDeleted
         ? {}
         : {
              deletedAt: null,
           },
      include: {
         images: true,
         recipe: true,
         category: true,
      },
      orderBy: [
         { deletedAt: "asc" }, // Deleted items at the end
         { createdAt: "desc" }, // Newest first
      ],
   });

   return menuItems;
};

export const getMenuItemById = async (menuItemId: string) => {
   const menuItem = await prisma.menuItem.findUnique({
      where: {
         id: menuItemId,
      },
      include: {
         category: true,
         images: true,
         recipe: true,
      },
   });

   if (!menuItem) {
      return null;
   }

   return menuItem;
};

export const getMenuCategoriesForSelect = async () => {
   const categories = await prisma.menuCategory.findMany({
      where: {
         isActive: true,
      },
      select: {
         id: true,
         name: true,
      },
      orderBy: {
         name: "asc",
      },
   });

   return categories;
};
