import { Prisma } from "@/lib/generated/prisma";

export type MenuCategory = Prisma.MenuCategoryGetPayload<{
   omit: {
      imageId: true;
   };
   include: {
      image: true;
   };
}>;
