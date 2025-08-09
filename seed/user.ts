import { prisma } from "@/lib/prisma";
import argon2 from "argon2";

export async function seedUser() {
   const hashedPassword = await argon2.hash("123456789");
   const user = await prisma.user.create({
      data: {
         name: "Admin",
         email: "admin@example.com",
         emailVerified: true,
         createdAt: new Date(),
         updatedAt: new Date(),
         role: "ADMIN",
         accounts: {
            create: {
               accountId: "cme4jc12k000008jodn53bnb4",
               providerId: "credential",
               password: hashedPassword,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
         },
      },
      include: {
         accounts: true,
      },
   });

   console.log("Created user:", user);
}
