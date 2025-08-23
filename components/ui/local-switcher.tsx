"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "./dropdown-menu";
import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

export function LocalSwitcher() {
   const t = useTranslations("LocaleSwitcher");
   const locale = useLocale();
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const pathname = usePathname();
   const params = useParams();

   function onLocaleChange(nextLocale: Locale) {
      startTransition(() => {
         router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: nextLocale },
         );
      });
   }

   console.log(routing.locales);

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={isPending}>
               <span>{t("label")}</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            {routing.locales.map((cur) => (
               <DropdownMenuItem
                  key={cur}
                  onClick={() => onLocaleChange(cur)}
                  className={cur === locale ? "bg-accent" : ""}
               >
                  {cur === "vi" ? "Vietnamese" : "English"}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
