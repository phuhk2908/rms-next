"use client";

import {
   IconHelp,
   IconInnerShadowTop,
   IconSearch,
   IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Table, Users, UtensilsCrossed } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const t = useTranslations("Menubar");
   const data = useMemo(
      () => ({
         user: {
            name: "shadcn",
            email: "m@example.com",
            avatar:
               "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_6.png",
         },
         navMain: [
            {
               title: t("food-recipe.title"),
               url: "#",
               icon: UtensilsCrossed,
               isActive: true,
               items: [
                  {
                     title: t("food-recipe.ingredient"),
                     url: "/admin/ingredients/",
                  },
                  {
                     title: t("food-recipe.recipe"),
                     url: "/admin/recipes/",
                  },
                  {
                     title: t("food-recipe.menu-item"),
                     url: "/admin/menu/items",
                  },
                  {
                     title: t("food-recipe.menu-category"),
                     url: "/admin/menu/categories",
                  },
               ],
            },
            {
               title: t("employee.title"),
               url: "#",
               icon: Users,
               isActive: true,
               items: [
                  {
                     title: t("employee.employee-management"),
                     url: "/admin/employees",
                  },
                  {
                     title: t("employee.attendance"),
                     url: "/admin/attendance",
                  },
                  {
                     title: t("employee.payroll"),
                     url: "/admin/payrolls",
                  },
                  {
                     title: t("employee.shift"),
                     url: "/admin/shift",
                  },
                  {
                     title: t("employee.leave-request"),
                     url: "/admin/leave-request",
                  },
               ],
            },
            {
               title: t("restaurant-table"),
               url: "/admin/table/",
               icon: Table,
               isActive: false,
            },
         ],
         navSecondary: [
            {
               title: t("setting"),
               url: "/admin/settings",
               icon: IconSettings,
            },
            {
               title: t("get-help"),
               url: "#",
               icon: IconHelp,
            },
            {
               title: t("search"),
               url: "#",
               icon: IconSearch,
            },
         ],
      }),
      [t],
   );

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                     <a href="#">
                        <IconInnerShadowTop className="!size-5" />
                        <span className="text-base font-semibold">
                           Fuo Fuo.
                        </span>
                     </a>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />

            <NavSecondary items={data.navSecondary} className="mt-auto" />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
      </Sidebar>
   );
}
