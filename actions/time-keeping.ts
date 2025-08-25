"use server";

import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { timeKeepingSchema, TimeKeepingFormData } from "@/schemas/time-keeping";
import { revalidatePath } from "next/cache";

async function findEmployee(id: string): Promise<string | null> {
   const employeeById = await prisma.employeeProfile.findUnique({
      where: { id },
   });
   if (employeeById) return employeeById.id;

   const employeeByUser = await prisma.employeeProfile.findUnique({
      where: { userId: id },
   });
   if (employeeByUser) return employeeByUser.id;

   const user = await prisma.user.findUnique({ where: { id } });
   if (user) return user.id;

   return null;
}

export const createTimeKeeping = async (
   values: TimeKeepingFormData,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = timeKeepingSchema.safeParse(values);
      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const employeeId = await findEmployee(validation.data.employee.user.id);
      if (!employeeId) {
         return {
            status: "error",
            message: "Employee not found.",
         };
      }

      const shift = await prisma.shift.findUnique({
         where: { id: validation.data.shift.id },
      });
      if (!shift) {
         return {
            status: "error",
            message: "Shift not found.",
         };
      }

      await prisma.timekeeping.create({
         data: {
            employeeId,
            shiftId: shift.id,
            checkIn: validation.data.checkIn,
            checkOut: validation.data.checkOut || null,
            workDate: validation.data.workDate,
            regularHours: validation.data.regularHours || 0,
            overtimeHours: validation.data.overtimeHours || 0,
            totalHours: validation.data.totalHours || 0,
         },
      });

      revalidatePath("/admin/time-keeping");

      return {
         status: "success",
         message: "Created time keeping entry successfully",
      };
   } catch (error) {
      console.error("Server action error:", error);

      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: `Database error: ${error.message}`,
         };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};
