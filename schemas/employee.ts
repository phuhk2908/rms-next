import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export const employeeSchema = z.object({
   id: z.string().optional(),
   name: z.string("Name is required"),
   email: z.email().min(1, "Email is required"),
   role: z.enum(UserRole),
   employeeProfile: z.object({
      position: z.string().optional(),
      startDate: z.date(),
      phoneNumber: z.string().optional(),
      salaryType: z.string().optional(),
      baseSalary: z.number().optional(),
      hourlyRate: z.number().optional(),
      address: z
         .object({
            street: z.string().optional(),
            ward: z.any().optional(),
            district: z.any().optional(),
            province: z.any().optional(),
         })
         .optional(),
   }),
});

export type EmployeeFormValue = z.infer<typeof employeeSchema>;
