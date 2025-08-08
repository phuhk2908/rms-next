import { WorkingDayConfigComp } from "./_components/working-day-config";
import { getWorkingDayConfigs } from "@/data/configs";

export default async function Page() {
   const workingDayConfigs = await getWorkingDayConfigs();

   console.log(workingDayConfigs);

   return (
      <div className="p-4 lg:p-6">
         <WorkingDayConfigComp data={workingDayConfigs} />
      </div>
   );
}
