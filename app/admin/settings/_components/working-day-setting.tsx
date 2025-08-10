"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { DayOfWeek, WorkingDayConfig } from "@/lib/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSetting } from "@/actions/setting";
import { Loader2 } from "lucide-react";

type FormWorkingDay = {
   id: string;
   dayOfWeek: DayOfWeek;
   isWorkingDay: boolean;
   startTime?: string;
   endTime?: string;
   standardHours: number;
   overtimeRate: number;
};

interface WorkingDayConfigProps {
   data: WorkingDayConfig[];
}

const dayMapping = {
   [DayOfWeek.MONDAY]: "Monday",
   [DayOfWeek.TUESDAY]: "Tuesday",
   [DayOfWeek.WEDNESDAY]: "Wednesday",
   [DayOfWeek.THURSDAY]: "Thursday",
   [DayOfWeek.FRIDAY]: "Friday",
   [DayOfWeek.SATURDAY]: "Saturday",
   [DayOfWeek.SUNDAY]: "Sunday",
};

const workingDaySchema = z.object({
   id: z.string(),
   dayOfWeek: z.nativeEnum(DayOfWeek),
   isWorkingDay: z.boolean(),
   startTime: z.string().optional(),
   endTime: z.string().optional(),
   standardHours: z.number().nonnegative(),
   overtimeRate: z.number().nonnegative(),
});

const formSchema = z.object({
   workingDays: z.array(workingDaySchema),
});

export type SettingFormValues = z.infer<typeof formSchema>;

export function WorkingDaySetting({ data }: WorkingDayConfigProps) {
   const transformedData: FormWorkingDay[] = useMemo(
      () =>
         data.map((item) => ({
            id: item.id,
            dayOfWeek: item.dayOfWeek,
            isWorkingDay: item.isWorkingDay,
            startTime: item.startTime ?? undefined,
            endTime: item.endTime ?? undefined,
            standardHours: item.standardHours,
            overtimeRate: item.overtimeRate,
         })),
      [data],
   );

   const form = useForm<SettingFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         workingDays: transformedData,
      },
   });

   const { fields } = useFieldArray({
      control: form.control,
      name: "workingDays",
   });

   const watchedFields = form.watch("workingDays");

   const calculateStandardHours = useMemo(
      () =>
         (startTime?: string, endTime?: string): number => {
            if (!startTime || !endTime) return 0;

            try {
               const start = new Date(`1970-01-01T${startTime}:00`);
               const end = new Date(`1970-01-01T${endTime}:00`);

               if (
                  isNaN(start.getTime()) ||
                  isNaN(end.getTime()) ||
                  end <= start
               ) {
                  return 0;
               }

               const diffHours =
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60);
               return parseFloat(diffHours.toFixed(2));
            } catch {
               return 0;
            }
         },
      [],
   );

   // Fixed useEffect with proper dependencies
   useEffect(() => {
      watchedFields.forEach((field, index) => {
         if (!field.isWorkingDay) return;

         const calculatedHours = calculateStandardHours(
            field.startTime,
            field.endTime,
         );
         const currentHours = form.getValues(
            `workingDays.${index}.standardHours`,
         );

         if (calculatedHours !== currentHours) {
            form.setValue(
               `workingDays.${index}.standardHours`,
               calculatedHours,
               {
                  shouldValidate: false,
                  shouldDirty: true,
               },
            );
         }
      });
   }, [watchedFields, calculateStandardHours, form]);

   const onSave = async (values: SettingFormValues) => {
      try {
         const result = await updateSetting(values);

         if (result.status === "error") {
            toast.error(result.message);
            return;
         }

         toast.success("Settings saved successfully!");

         // Reset form state after successful save to prevent randomization
         form.reset(values);
      } catch (error) {
         toast.error("Failed to save settings");
      }
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <div className="flex justify-end">
               <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                     <>
                        <Loader2 className="size-4 animate-spin" /> Saving...
                     </>
                  ) : (
                     "Save"
                  )}
               </Button>
            </div>

            <div className="rounded-lg border">
               <Table>
                  <TableCaption>Working day configurations</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[120px]">Day</TableHead>
                        <TableHead className="text-center">
                           Working Day
                        </TableHead>
                        <TableHead className="text-center">
                           Start Time
                        </TableHead>
                        <TableHead className="text-center">End Time</TableHead>
                        <TableHead className="text-center">
                           Standard Hours
                        </TableHead>
                        <TableHead className="text-center">OT Rate</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {fields.map((field, index) => {
                        const isWorking = watchedFields[index]?.isWorkingDay;

                        return (
                           <TableRow key={field.id}>
                              <TableCell className="font-medium">
                                 {dayMapping[field.dayOfWeek]}
                              </TableCell>

                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`workingDays.${index}.isWorkingDay`}
                                    render={({ field }) => (
                                       <FormItem className="flex justify-center">
                                          <FormControl>
                                             <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                             />
                                          </FormControl>
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>

                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`workingDays.${index}.startTime`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                type="time"
                                                className="mx-auto w-fit"
                                                disabled={!isWorking}
                                                value={field.value || ""}
                                             />
                                          </FormControl>
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>

                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`workingDays.${index}.endTime`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                type="time"
                                                className="mx-auto w-fit"
                                                disabled={!isWorking}
                                                value={field.value || ""}
                                             />
                                          </FormControl>
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>

                              <TableCell className="text-center">
                                 <span>
                                    {watchedFields[
                                       index
                                    ]?.standardHours?.toFixed(2) || "0.00"}
                                 </span>
                              </TableCell>

                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`workingDays.${index}.overtimeRate`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                type="number"
                                                className="mx-auto w-20 text-center"
                                                step="0.1"
                                                min="0"
                                                disabled={!isWorking}
                                                onChange={(e) => {
                                                   const value =
                                                      e.target.value === ""
                                                         ? 0
                                                         : parseFloat(
                                                              e.target.value,
                                                           );
                                                   field.onChange(
                                                      isNaN(value) ? 0 : value,
                                                   );
                                                }}
                                                value={field.value || 0}
                                             />
                                          </FormControl>
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </div>
         </form>
      </Form>
   );
}
