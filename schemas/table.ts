import { TableStatus } from "@/lib/generated/prisma";
import z4 from "zod/v4";

export const tableSchema = z4.object({
   id: z4.string().optional(),
   tableNumber: z4.string().min(1, { message: "Table number is required." }),
   capacity: z4.coerce
      .number()
      .int()
      .min(1, { message: "Capacity is at least 1" }),

   status: z4.enum(TableStatus),
   qrCodeUrl: z4.url().nullable().optional(),
   isActive: z4.boolean().default(true),
});

export type TableFormValues = z4.infer<typeof tableSchema>;
