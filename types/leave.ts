import { getAllLeave } from "@/data/leave";

export type leaveRequest = Awaited<ReturnType<typeof getAllLeave>>[number];
