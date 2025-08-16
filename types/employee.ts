import { getAllEmployees } from "@/data/employees";

export type UserWithEmployeeProfile = Awaited<
   ReturnType<typeof getAllEmployees>
>[number];
