import { prisma } from "@/lib/prisma";

export const getAllEmployees = async () => {
   const users = await prisma.user.findMany({
      select: {
         id: true,
         name: true,
         email: true,
         image: true,
         role: true,
         employeeProfile: {
            select: {
               id: true,
               user: true,
               position: true,
               startDate: true,
               phoneNumber: true,
               salaryType: true,
               baseSalary: true,
               hourlyRate: true,
               address: {
                  select: {
                     street: true,
                     ward: true,
                     district: true,
                     province: true,
                  },
               },
            },
         },
      },
      orderBy: { createdAt: "asc" },
   });

   return users;
};

