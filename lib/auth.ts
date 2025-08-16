import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
import { env } from "./env";
import argon2 from "argon2";
import { getVerificationEmailTemplate } from "./email-templates";
import {
   ac,
   admin as adminRole,
   chef,
   customer,
   manager,
   staff,
} from "./permission";

const emailAndPasswordConfig: BetterAuthOptions["emailAndPassword"] = {
   enabled: true,
   password: {
      hash: (password) => argon2.hash(password),
      verify: (data) => argon2.verify(data.hash, data.password),
   },
   requireEmailVerification: true,
};

const emailVerificationConfig: BetterAuthOptions["emailVerification"] = {
   sendOnSignUp: true,
   sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
         from: env.RESEND_FROM_MAIL,
         to: user.email,
         subject: "Verify your email address",
         html: getVerificationEmailTemplate(url, "Fuofuo"),
      });
   },
};

const plugins: BetterAuthOptions["plugins"] = [
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
      ac,
      roles: {
         adminRole,
         manager,
         staff,
         chef,
         customer,
      },
   }),
];

export const auth = betterAuth({
   emailAndPassword: emailAndPasswordConfig,
   emailVerification: emailVerificationConfig,
   database: prismaAdapter(prisma, { provider: "postgresql" }),
   socialProviders: {
      github: {
         clientId: env.GITHUB_CLIENT_ID,
         clientSecret: env.GITHUB_CLIENT_SECRET,
      },
   },
   user: {
      additionalFields: {
         role: {
            type: ["CUSTOMER", "ADMIN", "STAFF", "CHEF", "MANAGER"],
            input: false,
         },
      },
   },
   plugins,
   advanced: {
      database: {
         generateId: false,
      },
   },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
