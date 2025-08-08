import z4 from "zod/v4";

export enum TableStatus {
   AVAILABLE = "AVAILABLE",
   OCCUPIED = "OCCUPIED",
   RESERVED = "RESERVED",
}

export const tableSchema = z4.object({
   id: z4.string().optional(),
   tableNumber: z4.string().min(1, { message: "Số bàn không được để trống." }),
   capacity: z4.coerce
      .number()
      .int()
      .min(1, { message: "Sức chứa ít nhất là 1" }),

   status: z4.enum(TableStatus),
   qrCodeUrl: z4.string().url().optional(),
   isActive: z4.boolean().default(true).optional(),
});

export type TableFormValues = z4.infer<typeof tableSchema>;
