import { getAllShift } from "@/data/shift";

export type ShiftWithTimeKeeping = Awaited<
   ReturnType<typeof getAllShift>
>[number];
