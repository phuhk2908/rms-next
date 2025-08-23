"server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export const requireAdmin = async () => {
   const locale = await getLocale();
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (!session) {
      redirect({ href: "/sign-in", locale });
   }

   if (session && session.user.role !== "ADMIN") {
      redirect({ href: "/access-denied", locale });
   }

   return session;
};
