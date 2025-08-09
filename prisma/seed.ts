import { prisma } from "@/lib/prisma";
import { seedUser } from "@/seed/user";
import { seedWorkingDayConfig } from "@/seed/working-day-config";

async function main() {
   console.log(`Start to seeding ...`);

   await seedWorkingDayConfig();
   await seedUser();
   
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
