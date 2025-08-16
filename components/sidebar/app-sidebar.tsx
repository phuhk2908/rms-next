"use client";

import * as React from "react";
import {
   IconCamera,
   IconFileAi,
   IconFileDescription,
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

const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
   navMain: [
      {
         title: "Food & Recipe",
         url: "#",
         icon: UtensilsCrossed,
         isActive: true,
         items: [
            {
               title: "Ingredients",
               url: "/admin/ingredients/",
            },
            {
               title: "Recipes",
               url: "/admin/recipes/",
            },
            {
               title: "Menu Item",
               url: "/admin/menu/items",
            },
            {
               title: "Menu Category",
               url: "/admin/menu/categories",
            },
         ],
      },
      {
         title: "Staffs",
         url: "#",
         icon: Users,
         isActive: false,
         items: [
            {
               title: "Staff Management",
               url: "/admin/staffs/manage",
            },
            {
               title: "Attendance",
               url: "/admin/staffs/attendance",
            },
            {
               title: "Payrolls",
               url: "/admin/staffs/payrolls",
            },
            {
               title: "Shifts",
               url: "/admin/staffs/shifts",
            },
            {
               title: "Leave Request",
               url: "/admin/staffs/leave-request",
            },
         ],
      },
      {
         title: "Restaurant Table",
         url: "/admin/table/",
         icon: Table,
         isActive: false,
      },
      {
         title: "Employee Management",
         url: "#",
         icon: Users,
         isActive: true,
         items: [
            {
               title: "List",
               url: "/admin/employees/",
            },
         ],
      },
   ],
   navClouds: [
      {
         title: "Capture",
         icon: IconCamera,
         isActive: true,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
      {
         title: "Proposal",
         icon: IconFileDescription,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
      {
         title: "Prompts",
         icon: IconFileAi,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
   ],
   navSecondary: [
      {
         title: "Settings",
         url: "#",
         icon: IconSettings,
      },
      {
         title: "Get Help",
         url: "#",
         icon: IconHelp,
      },
      {
         title: "Search",
         url: "#",
         icon: IconSearch,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                           Acme Inc.
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
