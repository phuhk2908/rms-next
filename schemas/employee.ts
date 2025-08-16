import { SalaryType, UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export const employeeSchema = z.object({
   id: z.string().optional(),
   name: z.string().min(1, "Name is required"),
   email: z.string().email("Invalid email format").min(1, "Email is required"),
   role: z.enum(UserRole),
   employeeProfile: z.object({
      position: z.string().min(1, "Position is required"),
      startDate: z.date(),
      phoneNumber: z.string().min(1, "Phone number is required"),
      salaryType: z.enum(SalaryType),
      baseSalary: z.preprocess(
         (val) => (val === "" ? undefined : Number(val)),
         z.number().min(0, "Base salary must be positive").optional(),
      ),
      hourlyRate: z.preprocess(
         (val) => (val === "" ? undefined : Number(val)),
         z.number().min(0, "Hourly rate must be positive").optional(),
      ),
      address: z.object({
         street: z.string().min(1, "Street is required"),
         ward: z.string().min(1, "Ward is required"),
         district: z.string().min(1, "District is required"),
         province: z.string().min(1, "Province is required"),
      }),
   }),
});

export type EmployeeFormValue = z.infer<typeof employeeSchema>;
