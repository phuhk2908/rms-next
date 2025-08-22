import { getAllLeave } from "@/data/leave";

export type Leave = Awaited<ReturnType<typeof getAllLeave>>[number];
