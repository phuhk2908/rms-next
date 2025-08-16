"use server";

import { requireAdmin } from "@/data/require-admin";
import { generateSecurePassword } from "@/helpers/gen-password";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { ApiResponse } from "@/lib/types";
import { EmployeeFormValue, employeeSchema } from "@/schemas/employee";
import { revalidatePath } from "next/cache";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { generateId } from "better-auth";
import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import EmailTemplate from "@/components/email";
import { SalaryType } from "@/lib/generated/prisma";
import { generateEmployeeCode } from "@/helpers/generate-employee-code";

export const createEmployee = async (
   values: EmployeeFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = employeeSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      const password = generateSecurePassword();
      const employeeCode = generateEmployeeCode();

      const hashedPassword = (await argon2.hash(password)) as string;

      await prisma.user.create({
         data: {
            name: validation.data.name,
            email: validation.data.email,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: validation.data.role,
            employeeProfile: {
               create: {
                  employeeCode: employeeCode,
                  position: validation.data.employeeProfile.position,
                  dateOfBirth: validation.data.employeeProfile.dateOfBirth,
                  phoneNumber: validation.data.employeeProfile.phoneNumber,
                  salaryType: validation.data.employeeProfile
                     .salaryType as SalaryType,
                  baseSalary: validation.data.employeeProfile.baseSalary,
                  hourlyRate: validation.data.employeeProfile.hourlyRate,
                  address: {
                     create: {
                        street:
                           validation.data.employeeProfile.address?.street ||
                           "",
                        ward:
                           validation.data.employeeProfile.address?.ward || "",
                        district:
                           validation.data.employeeProfile.address?.district ||
                           "",
                        province:
                           validation.data.employeeProfile.address?.province ||
                           "",
                     },
                  },
               },
            },
            accounts: {
               create: {
                  accountId: generateId(),
                  providerId: "credential",
                  password: hashedPassword,
                  createdAt: new Date(),
                  updatedAt: new Date(),
               },
            },
         },
      });

      await resend.emails.send({
         from: env.RESEND_FROM_MAIL,
         to: validation.data.email,
         subject: "Your account is registered successfully",
         react: EmailTemplate({
            email: validation.data.email,
            password: password,
         }),
      });

      revalidatePath("/admin/employees");

      return {
         status: "success",
         message: "Created new employee successfully",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: error.message,
         };
      }
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};

export const updateEmployee = async (
   values: EmployeeFormValue,
): Promise<ApiResponse> => {
   try {
      await requireAdmin();

      const validation = employeeSchema.safeParse(values);

      if (!validation.success) {
         return {
            status: "error",
            message: "Invalid form data. Please correct the errors.",
            errors: validation.error,
         };
      }

      await prisma.user.update({
         where: {
            id: validation.data.id,
         },
         data: {
            name: validation.data.name,
            role: validation.data.role,
            employeeProfile: {
               update: {
                  position: validation.data.employeeProfile.position,
                  dateOfBirth: validation.data.employeeProfile.dateOfBirth,
                  phoneNumber: validation.data.employeeProfile.phoneNumber,
                  salaryType: validation.data.employeeProfile
                     .salaryType as SalaryType,
                  baseSalary: validation.data.employeeProfile.baseSalary,
                  hourlyRate: validation.data.employeeProfile.hourlyRate,
                  address: {
                     update: {
                        street: validation.data.employeeProfile.address?.street,
                        ward: validation.data.employeeProfile.address?.ward,
                        district:
                           validation.data.employeeProfile.address?.district,
                        province:
                           validation.data.employeeProfile.address?.province,
                     },
                  },
               },
            },
         },
      });

      revalidatePath("/admin/employees");

      return {
         status: "success",
         message: "Updated employee successfully",
      };
   } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
         return {
            status: "error",
            message: error.message,
         };
      }
      return {
         status: "error",
         message: "An unexpected error occurred. Please try again later",
      };
   }
};
