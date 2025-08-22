"use server";

import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { LeaveFormValue, leaveRequestSchema } from "@/schemas/leave";
import { revalidatePath } from "next/cache";

export const updateStatus = async (
   values: LeaveFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = leaveRequestSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.leaveRequest.update({
         where: {
            id: validation.data.id,
         },
         data: {
            status: validation.data.status,
         },
      });

      revalidatePath("/admin/leave-request");

      return {
         status: "success",
         message: "Approved leave request successfully",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: error.message,
         };
      }
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};
