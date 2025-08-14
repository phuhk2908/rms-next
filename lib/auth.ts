import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
import { env } from "./env";
import argon2 from "argon2";
import { getVerificationEmailTemplate } from "./email-templates";

const emailAndPasswordConfig: BetterAuthOptions["emailAndPassword"] = {
   enabled: true,
   autoSignIn: true,
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
   admin({
      defaultRole: "CUSTOMER",
      adminRoles: ["ADMIN"],
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
   plugins,
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
