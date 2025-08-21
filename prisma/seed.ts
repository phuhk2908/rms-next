import { prisma } from "@/lib/prisma";
import { seedIngredient } from "@/seed/ingredient";
import { seedMenuCategory } from "@/seed/menu-category";
import { seedMenuItem } from "@/seed/menu-item";
import { seedRecipe } from "@/seed/sample-recipe";
import { seedUser } from "@/seed/user";
import { seedWorkingDayConfig } from "@/seed/working-day-config";

async function main() {
   console.log(`Start to seeding ...`);
   console.log(`Start to seeding ...`);

   await prisma.menuItem.deleteMany();
   await prisma.menuCategory.deleteMany();
   await prisma.image.deleteMany();
   await prisma.workingDayConfig.deleteMany();

   const employeeCount = await prisma.employeeProfile.count();
   const customerCount = await prisma.customerProfile.count();
   const sessionCount = await prisma.session.count();
   const accountCount = await prisma.account.count();

   if (
      employeeCount > 0 ||
      customerCount > 0 ||
      sessionCount > 0 ||
      accountCount > 0
   ) {
      console.log("Deleting user-related data...");
      await prisma.employeeProfile.deleteMany();
      await prisma.customerProfile.deleteMany();
      await prisma.session.deleteMany();
      await prisma.account.deleteMany();
      await prisma.verification.deleteMany();
   }

   await prisma.user.deleteMany();

   // Seed in correct order (dependencies first)
   await seedUser();
   await seedWorkingDayConfig();
   await seedIngredient();
   await seedMenuCategory();
   await seedMenuItem();
   await seedRecipe();

   console.log(`Seeding successfully`);
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
