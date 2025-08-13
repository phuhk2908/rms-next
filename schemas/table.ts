import { TableStatus } from "@/lib/generated/prisma";
import { z } from "zod";

export const tableSchema = z.object({
   id: z.string().optional(),
   tableNumber: z.string().min(1, { message: "Table number is required." }),
   capacity: z.coerce
      .number()
      .int()
      .min(1, { message: "Capacity is at least 1" }),

   status: z.enum(TableStatus),
   qrCodeUrl: z.url().nullable().optional(),
   isActive: z.boolean().default(true),
});

export type TableFormValues = z.infer<typeof tableSchema>;
