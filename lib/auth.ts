import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
import { env } from "./env";
import argon2 from "argon2";
import { getVerificationEmailTemplate } from "./email-templates";

export const auth = betterAuth({
   emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      password: {
         hash: async (password) => {
            return await argon2.hash(password);
         },
         verify: async (data) => {
            return await argon2.verify(data.hash, data.password);
         },
      },
      requireEmailVerification: true,
   },
   emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url, token }, request) => {
         await resend.emails.send({
            from: env.RESEND_FROM_MAIL,
            to: user.email,
            subject: "Verify your email address",
            html: getVerificationEmailTemplate(url, "Fuofuo"),
         });
      },
   },
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),
   socialProviders: {
      github: {
         clientId: env.GITHUB_CLIENT_ID,
         clientSecret: env.GITHUB_CLIENT_SECRET,
      },
   },
   plugins: [
      emailOTP({
         async sendVerificationOTP({ email, otp }) {
            await resend.emails.send({
               from: env.RESEND_FROM_MAIL,
               to: [email],
               subject: "FuofuoLMS - Verify your email",
               html: `<p>Your OTP is <strong>${otp}</strong></p>`,
            });
         },
      }),
      admin({
         defaultRole: "CUSTOMER",
         adminRoles: ["ADMIN"],
      }),
   ],
   user: {
      additionalFields: {
         role: {
            type: ["CUSTOMER", "ADMIN", "STAFF", "CHEF", "MANAGER"],
            input: false,
         },
      },
   },
   advanced: {
      database: {
         generateId: false,
      },
   },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
