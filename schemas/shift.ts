import z from "zod";

export const shiftSchema = z.object({
   id: z.string().min(1, "Id is required").optional(),
   name: z.string().min(1, "Name is required"),
   startTime: z.string().min(1, "Start time should be a number"),
   endTime: z.string().min(1, "End time should be a number"),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
});

export type ShiftFormValue = z.infer<typeof shiftSchema>;
