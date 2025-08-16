"use server";
import { requireAdmin } from "@/data/require-admin";
import { tryCatch } from "@/helpers/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { TableFormValues, tableSchema } from "@/schemas/table";
import { revalidatePath } from "next/cache";

export const createTable = async (values: TableFormValues) => {
   return await tryCatch(async () => {
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

      await prisma.restaurantTable.create({
         data: {
            ...tableData,
            qrCodeUrl:
               tableData.qrCodeUrl ||
               `https://example.com/table/${tableData.tableNumber}`,
         },
      });

      revalidatePath("/admin/table");
      return {
         status: "success",
         message: "Table created successfully.",
      };
   });
};

export const updateTable = async (id: string, values: TableFormValues) => {
   return await tryCatch(async () => {
      await requireAdmin();

      const validation = tableSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const { id: formId, ...tableData } = validation.data;

      await prisma.restaurantTable.update({
         where: { id },
         data: tableData,
      });

      revalidatePath("/admin/table");
      return {
         status: "success",
         message: "Table updated successfully.",
      };
   });
};

export const deleteTable = async (tableId: string) => {
   return await tryCatch(async () => {
      await requireAdmin();
      await prisma.restaurantTable.delete({
         where: {
            id: tableId,
         },
      });

      revalidatePath("/admin/table");
      return {
         status: "success",
         message: "Table deleted successfully.",
      };
   });
};
