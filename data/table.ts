import { prisma } from "@/lib/prisma";

export const getAllTables = async () => {
   const tables = await prisma.restaurantTable.findMany({
      select: {
         tableNumber: true,
         capacity: true,
         status: true,
         qrCodeUrl: true,
         isActive: true,
         orders: true,
         reservations: true,
      },
   });
   return tables;
};
