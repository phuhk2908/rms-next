import { prisma } from "@/lib/prisma";

export const getAllLeave = async () => {
   const leaves = await prisma.leaveRequest.findMany({
      select: {
         id: true,
         startDate: true,
         endDate: true,
         reason: true,
         status: true,
         createdAt: true,
         employee: {
            select: {
               user: {
                  select: {
                     name: true,
                     email: true,
                     role: true,
                  },
               },
            },
         },
         approvedBy: {
            select: {
               name: true,
               email: true,
               role: true,
            },
         },
      },
      orderBy: { createdAt: "asc" },
   });
   return leaves;
};
