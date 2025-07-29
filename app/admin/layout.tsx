import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ReactNode } from "react";
interface AdminLayoutProps {
   children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (!session) {
      redirect("/sign-in");
   }

   if (session && session.user.role !== "admin") {
      redirect("/access-denied");
   }

   return (
      <SidebarProvider
         style={
            {
               "--sidebar-width": "calc(var(--spacing) * 72)",
               "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
         }
      >
         <AppSidebar variant="inset" />
         <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  {children}
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
