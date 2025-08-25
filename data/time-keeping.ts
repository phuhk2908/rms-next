import { prisma } from "@/lib/prisma";

export const getAllTimeKeeping = async () => {
   const timeKeeping = await prisma.timekeeping.findMany({
      select: {
         id: true,
         checkIn: true,
         checkOut: true,
         workDate: true,
         regularHours: true,
         overtimeHours: true,
         totalHours: true,
         shift: {
            select: {
               name: true,
               startTime: true,
               endTime: true,
            },
         },
         employee: {
            select: {
               employeeCode: true,
               user: {
                  select: {
                     name: true,
                     email: true,
                  },
               },
            },
         },
      },
   });
   return timeKeeping;
};
