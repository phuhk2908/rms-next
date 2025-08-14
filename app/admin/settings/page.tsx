import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkingDaySetting } from "./_components/working-day-setting";
import { getWorkingDayConfigs } from "@/data/configs";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Admin | Settings",
};

export default async function Page() {
   const workingDayConfigs = await getWorkingDayConfigs();

   return (
      <div className="p-4 lg:p-6">
         <Tabs defaultValue="general-settings">
            <TabsList>
               <TabsTrigger value="general-settings">
                  General Settings
               </TabsTrigger>
               <TabsTrigger value="working-day">Working Day</TabsTrigger>
            </TabsList>
            <TabsContent value="general-settings">General Settings</TabsContent>
            <TabsContent value="working-day">
               <WorkingDaySetting data={workingDayConfigs} />
            </TabsContent>
         </Tabs>
      </div>
   );
}
