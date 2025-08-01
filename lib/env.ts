import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      DATABASE_URL: z.url(),
      SHADOW_DATABASE_URL: z.string().min(1),
      RESEND_FROM_MAIL: z.string().min(1),
      RESEND_API_KEY: z.string().min(1),
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.url(),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      UPLOADTHING_TOKEN: z.string().min(1),
      UPLOADTHING_SECRET_KEY: z.string().min(1),
   },
   client: {
      NEXT_PUBLIC_UPLOADTHING_PRE_URL: z.string().min(1),
   },
   experimental__runtimeEnv: {
      NEXT_PUBLIC_UPLOADTHING_PRE_URL:
         process.env.NEXT_PUBLIC_UPLOADTHING_PRE_URL,
   },
});
