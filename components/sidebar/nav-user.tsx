"use client";

import {
   IconCreditCard,
   IconDotsVertical,
   IconLogout,
   IconNotification,
   IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function NavUser({
   user,
}: {
   user: {
      name: string;
      email: string;
      avatar: string;
   };
}) {
   const t = useTranslations("Authentication");
   const router = useRouter();
   const { isMobile } = useSidebar();
   const { data: session } = authClient.useSession();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                           CN
                        </AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                           {session?.user.name ||
                              session?.user.email.split("@")[0]}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                           {session?.user.email}
                        </span>
                     </div>
                     <IconDotsVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="p-0 font-normal">
                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                           <AvatarImage src={user.avatar} alt={user.name} />
                           <AvatarFallback className="rounded-lg">
                              CN
                           </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-medium">
                              {user.name}
                           </span>
                           <span className="text-muted-foreground truncate text-xs">
                              {session?.user.email}
                           </span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <IconUserCircle />
                        {t("account")}
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onClick={async () =>
                        await authClient.signOut({
                           fetchOptions: {
                              onSuccess: () => {
                                 router.push("/sign-in");
                              },
                           },
                        })
                     }
                  >
                     <IconLogout />
                     {t("sign-out")}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
