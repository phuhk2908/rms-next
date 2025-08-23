"use server";

import { SettingFormValues } from "@/app/[locale]/admin/settings/_components/working-day-setting";
import { requireAdmin } from "@/data/require-admin";
import { tryCatch } from "@/helpers/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateSetting(values: SettingFormValues) {
   return await tryCatch(async () => {
      await requireAdmin();

      await Promise.all(
         values.workingDays.map(async (item) => {
            await prisma.workingDayConfig.update({
               where: {
                  id: item.id,
               },
               data: item,
            });
         }),
      );

      revalidatePath("/admin/settings");

      return {
         status: "success",
         message: "Update setting successfully",
      };
   });
}
