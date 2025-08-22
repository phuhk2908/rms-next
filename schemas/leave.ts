import { LeaveRequestStatus, UserRole } from "@/lib/generated/prisma";
import z from "zod";

export const leaveRequestSchema = z.object({
   id: z.string().optional(),
   status: z.enum(LeaveRequestStatus).default(LeaveRequestStatus.PENDING),
});

export type LeaveFormValue = z.infer<typeof leaveRequestSchema>;
