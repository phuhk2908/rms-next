"server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireAdmin = async () => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (!session) {
      redirect("/");
   }

   if (session && session.user.role !== "ADMIN") {
      redirect("/access-denied");
   }

   return session;
};
