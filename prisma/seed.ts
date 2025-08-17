import { prisma } from "@/lib/prisma";
import { seedMenuCategory } from "@/seed/menu-category";
import { seedMenuItem } from "@/seed/menu-item";
import { seedUser } from "@/seed/user";
import { seedWorkingDayConfig } from "@/seed/working-day-config";

async function main() {
   console.log(`Start to seeding ...`);
   await prisma.menuItem.deleteMany();
   await prisma.menuCategory.deleteMany();
   await prisma.image.deleteMany();
   await prisma.workingDayConfig.deleteMany();
   await prisma.user.deleteMany();

   await seedMenuItem();
   await seedWorkingDayConfig();
   await seedUser();
   await seedMenuCategory();

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
