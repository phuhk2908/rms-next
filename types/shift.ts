import { getAllShift } from "@/data/shift";

export type Shift = Awaited<
   ReturnType<typeof getAllShift>
>[number];
