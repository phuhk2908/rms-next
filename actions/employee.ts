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

      let password = generateSecurePassword();

      const hashedPassword = (await argon2.hash(password)) as string;

      await prisma.user.create({
         data: {
            name: validation.data.name,
            email: validation.data.email,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: validation.data.role,
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
