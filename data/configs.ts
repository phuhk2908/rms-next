import { prisma } from "@/lib/prisma";

export async function getWorkingDayConfigs() {
   return await prisma.workingDayConfig.findMany();
}
