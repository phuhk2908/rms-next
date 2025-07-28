import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface AuthLayout {
   children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayout) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session) {
      redirect("/");
   }

   return (
      <div className="relative flex min-h-svh flex-col items-center justify-center">
         <Link
            href="/"
            className={buttonVariants({
               variant: "link",
               className: "absolute top-4 left-4",
            })}
         >
            <ArrowLeft className="size-4" />
            Back
         </Link>
         <div className="flex w-full max-w-sm flex-col gap-6">
            {children}

            <div className="text-muted-foreground text-center text-xs text-balance">
               By clicking continue, you agree to our{" "}
               <span className="hover:text-primary hover:underline">
                  Terms of services
               </span>{" "}
               and <span>Privary Policy</span>.
            </div>
         </div>
      </div>
   );
}
