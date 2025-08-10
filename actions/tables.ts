"use server";
import { requireAdmin } from "@/data/require-admin";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { TableFormValues, tableSchema } from "@/schemas/table";
import { revalidatePath } from "next/cache";

export const createTable = async (
   values: TableFormValues,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = tableSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const { id, ...tableData } = validation.data;

      let result;

      if (id) {
         result = await prisma.restaurantTable.update({
            where: { id },
            data: tableData,
         });
      } else {
         result = await prisma.restaurantTable.create({
            data: {
               ...tableData,
               qrCodeUrl:
                  tableData.qrCodeUrl ||
                  `https://example.com/table/${tableData.tableNumber}`,
            },
         });
      }
      revalidatePath("/admin/table");
      return {
         status: "success",
         message: "Table created/updated successfully",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return { status: "error", message: error.message };
      }

      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later.",
      };
   }
};

export const deleteTable = async (tableId: string) => {
   try {
      console.log(tableId);
      await requireAdmin();
      await prisma.restaurantTable.delete({
         where: {
            id: tableId,
         },
      });

      revalidatePath("/admin/table");
      return {
         status: "success",
         message: "Deleted successfully",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return { status: "error", message: error.message };
      }

      return {
         status: "error",
         message: "Deleted failed, please try again",
      };
   }
};
