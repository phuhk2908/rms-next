import { prisma } from "@/lib/prisma";

export const getAllShift = async () => {
   const shifts = await prisma.shift.findMany({
      select: {
         id: true,
         name: true,
         startTime: true,
         endTime: true,
      },
   });

   return shifts;
};
