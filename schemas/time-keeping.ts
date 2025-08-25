import z from "zod";

export const timeKeepingSchema = z.object({
   employee: z.object({
      user: z.object({
         id: z.string().min(1, "Employee is required"),
         name: z.string().optional(),
      }),
   }),
   shift: z.object({
      id: z.string().min(1, "Shift is required"),
      name: z.string().optional(),
   }),
   checkIn: z.date(),
   checkOut: z.date().optional(),
   workDate: z.date(),
   regularHours: z.number().optional(),
   overtimeHours: z.number().optional(),
   totalHours: z.number().optional(),
});

export type TimeKeepingFormData = z.infer<typeof timeKeepingSchema>;
