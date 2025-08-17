import { SalaryType, UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export const employeeSchema = z
   .object({
      id: z.string().min(1).optional(),
      name: z.string().min(1, "Name is required"),
      email: z.email("Invalid email format").min(1, "Email is required"),
      role: z.enum(UserRole),
      employeeProfile: z.object({
         position: z.string().min(1).optional(),
         dateOfBirth: z.date().optional(),
         phoneNumber: z.string().min(1, "Phone number is required"),
         salaryType: z.enum(SalaryType),
         baseSalary: z.number().min(0).optional(),
         hourlyRate: z.number().min(0).optional(),
         address: z.object({
            street: z.string().min(1).optional(),
            ward: z.string().min(1).optional(),
            district: z.string().min(1).optional(),
            province: z.string().min(1).optional(),
         }),
      }),
   })
   .refine(
      (data) => {
         const { salaryType, baseSalary, hourlyRate } = data.employeeProfile;

         if (salaryType === SalaryType.MONTHLY && !baseSalary) {
            return false;
         }
         if (salaryType === SalaryType.HOURLY && !hourlyRate) {
            return false;
         }
         if (salaryType === SalaryType.MIXED && (!baseSalary || !hourlyRate)) {
            return false;
         }
         return true;
      },
      {
         message: "Salary values are required based on salary type",
         path: ["employeeProfile"],
      },
   );

export type EmployeeFormValue = z.infer<typeof employeeSchema>;
