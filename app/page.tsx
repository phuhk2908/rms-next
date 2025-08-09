import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
   const session = await auth.api.getSession({
      headers: await headers(),
   });
   const isAdmin = session?.user.role === "ADMIN";

   return (
      <Link
         className={buttonVariants({
            variant: "link",
         })}
         href={isAdmin ? "/admin" : "#"}
      >
         {isAdmin ? "Go to Admin Dashboard" : "Hello World"}
      </Link>
   );
}
