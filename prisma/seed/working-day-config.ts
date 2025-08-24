import { DayOfWeek } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function seedWorkingDayConfig() {
   await prisma.workingDayConfig.deleteMany();
   await prisma.workingDayConfig.createMany({
      data: [
         // Ngày làm việc
         {
            dayOfWeek: DayOfWeek.MONDAY,
            isWorkingDay: true,
            standardHours: 8,
            startTime: "08:00",
            endTime: "17:00",
            overtimeRate: 1.5,
         },
         {
            dayOfWeek: DayOfWeek.TUESDAY,
            isWorkingDay: true,
            standardHours: 8,
            startTime: "08:00",
            endTime: "17:00",
            overtimeRate: 1.5,
         },
         {
            dayOfWeek: DayOfWeek.WEDNESDAY,
            isWorkingDay: true,
            standardHours: 8,
            startTime: "08:00",
            endTime: "17:00",
            overtimeRate: 1.5,
         },
         {
            dayOfWeek: DayOfWeek.THURSDAY,
            isWorkingDay: true,
            standardHours: 8,
            startTime: "08:00",
            endTime: "17:00",
            overtimeRate: 1.5,
         },
         {
            dayOfWeek: DayOfWeek.FRIDAY,
            isWorkingDay: true,
            standardHours: 8,
            startTime: "08:00",
            endTime: "17:00",
            overtimeRate: 1.5,
         },
         {
            dayOfWeek: DayOfWeek.SATURDAY,
            isWorkingDay: false,
            standardHours: 0,
            startTime: null,
            endTime: null,
            overtimeRate: 2.0,
         },
         {
            dayOfWeek: DayOfWeek.SUNDAY,
            isWorkingDay: false,
            standardHours: 0,
            startTime: null,
            endTime: null,
            overtimeRate: 2.5,
         },
      ],
   });
}
