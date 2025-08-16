import { prisma } from "@/lib/prisma";

export const getAllTables = async () => {
   const tables = await prisma.restaurantTable.findMany({
      include: {
         orders: true,
         reservations: true,
      },
      orderBy: {
         createdAt: "asc",
      },
   });

   return tables;
};
