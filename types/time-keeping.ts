import { getAllTimeKeeping } from "@/data/time-keeping";

export type TimeKeepingFormValue = Awaited<ReturnType<typeof getAllTimeKeeping>>[number];
