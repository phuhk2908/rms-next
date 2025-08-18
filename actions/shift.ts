"use server";

import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { ShiftFormValue, shiftSchema } from "@/schemas/shift";
import { revalidatePath } from "next/cache";

export const createShift = async (
   values: ShiftFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = shiftSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.shift.create({
         data: {
            name: validation.data.name,
            startTime: validation.data.startTime,
            endTime: validation.data.endTime,
         },
      });

      revalidatePath("/admin/shift");

      return {
         status: "success",
         message: "Created new shift successfully",
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

export const updateShift = async (
   values: ShiftFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = shiftSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.shift.update({
         where: {
            id: validation.data.id,
         },
         data: {
            name: validation.data.name,
            startTime: validation.data.startTime,
            endTime: validation.data.endTime,
         },
      });

      revalidatePath("/admin/shift");

      return {
         status: "success",
         message: "Updated shift successfully",
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

export const deleteShift = async (shiftId: string) => {
   try {
      await requireAdmin();

      await prisma.shift.delete({
         where: {
            id: shiftId,
         },
      });

      revalidatePath("/admin/shift");

      return {
         status: "success",
         message: "Deleted shift successfully",
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
