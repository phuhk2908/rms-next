"use server";

import { SettingFormValues } from "@/app/admin/settings/_components/working-day-setting";
import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateSetting(
   values: SettingFormValues,
): Promise<ApiResponse> {
   try {
      await requireAdmin();

      values.workingDays.forEach(async (item) => {
         await prisma.workingDayConfig.update({
            where: {
               id: item.id,
            },
            data: item,
         });
      });

      revalidatePath("/admin/settings");

      return {
         status: "success",
         message: "Update setting successfully",
      };
   } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: error.message,
         };
      }

      return {
         status: "error",
         message: error.message,
      };
   }
}
