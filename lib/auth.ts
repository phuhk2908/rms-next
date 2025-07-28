import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { env } from "./env";

export const auth = betterAuth({
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
            const { data, error } = await resend.emails.send({
               from: env.RESEND_FROM_MAIL,
               to: [email],
               subject: "FuofuoLMS - Verify your email",
               html: `<p>Your OTP is <strong>${otp}</strong></p>`,
            });
         },
      }),
   ],
});
