import { LeaveRequestStatus, UserRole } from "@/lib/generated/prisma";
import z from "zod";

export const leaveSchema = z.object({
   id: z.string().optional(),
   startDate: z.date(),
   endDate: z.date(),
   reason: z.string(),
   status: z.enum(LeaveRequestStatus).default(LeaveRequestStatus.PENDING),
   employee: z.object({
      user: z.object({
         name: z.string(),
         email: z.string(),
         role: z.enum(UserRole).default(UserRole.STAFF),
      }),
   }),
   approvedBy: z
      .object({
         name: z.string(),
         email: z.string(),
         role: z.enum(UserRole).default(UserRole.STAFF),
      })
      .nullable()
      .optional(),
});

export type LeaveFormValue = z.infer<typeof leaveSchema>;
