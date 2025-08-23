import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function Home({ params }: { params: any }) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });
   const t = await getTranslations("HomePage");
   const isAdmin = session?.user.role === "ADMIN";

   const { locale } = await params;

   return (
      <Link
         className={buttonVariants({
            variant: "link",
         })}
         href={isAdmin ? "/admin" : "/"}
      >
         {isAdmin ? t("title") : "Hello World"}
      </Link>
   );
}
