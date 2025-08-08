import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { DayOfWeek, WorkingDayConfig } from "@/lib/generated/prisma";

interface WorkingDayConfigProps {
   data: WorkingDayConfig[];
}

const dayMapping = {
   [DayOfWeek.MONDAY]: "Monday",
   [DayOfWeek.TUESDAY]: "Tuesday",
   [DayOfWeek.WEDNESDAY]: "Wednesday",
   [DayOfWeek.THURSDAY]: "Thuesday",
   [DayOfWeek.FRIDAY]: "Friday",
   [DayOfWeek.SATURDAY]: "Saturday",
   [DayOfWeek.SUNDAY]: "Sunday",
};

export function WorkingDayConfigComp({ data }: WorkingDayConfigProps) {
   return (
      <Table>
         <TableCaption>A list of working day configs</TableCaption>
         <TableHeader>
            <TableRow>
               <TableHead className="">Date</TableHead>
               <TableHead className="text-center">Workday</TableHead>
               <TableHead className="text-center">Standard Hours</TableHead>
               <TableHead className="text-center">Start Time</TableHead>
               <TableHead className="text-center">End Time</TableHead>
               <TableHead className="text-center">OT Rate</TableHead>
               <TableHead className="text-center">Actions</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {data.map((item) => (
               <TableRow key={item.id}>
                  <TableCell className="">
                     {dayMapping[item.dayOfWeek]}
                  </TableCell>
                  <TableCell className="text-center">
                     <Checkbox checked={item.isWorkingDay} />
                  </TableCell>
                  <TableCell className="text-center">
                     {item.standardHours}
                  </TableCell>
                  <TableCell className="text-center">
                     <Input
                        className="mx-auto w-fit"
                        type="time"
                        defaultValue={item.startTime || "00:00"}
                        disabled={!item.isWorkingDay}
                     />
                  </TableCell>
                  <TableCell className="text-center">
                     <Input
                        className="mx-auto w-fit"
                        type="time"
                        defaultValue={item.endTime || "00:00"}
                        disabled={!item.isWorkingDay}
                     />
                  </TableCell>
                  <TableCell className="text-center">
                     {item.overtimeRate}
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
