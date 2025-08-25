"use client";

import React, { useEffect, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { TimeKeepingFormData, timeKeepingSchema } from "@/schemas/time-keeping";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { toast } from "sonner";
import { createTimeKeeping } from "@/actions/time-keeping";

interface TimeKeepingFormProps {
   employees: any[];
   shifts: any[];
}

export default function TimeEntryFormClient({
   employees,
   shifts,
}: TimeKeepingFormProps) {
   const [open, setOpen] = useState(false);

   const form = useForm<TimeKeepingFormData>({
      resolver: zodResolver(timeKeepingSchema),
      defaultValues: {
         employee: {
            user: {
               id: "",
               name: "",
            },
         },
         shift: {
            id: "",
            name: "",
         },
         checkIn: new Date(),
         checkOut: undefined,
         workDate: new Date(),
         regularHours: 0,
         overtimeHours: 0,
         totalHours: 0,
      },
   });

   const calculateHours = (checkIn: Date, checkOut: Date): number => {
      const diffInMilliseconds = checkOut.getTime() - checkIn.getTime();
      const diffInMinutes = diffInMilliseconds / (1000 * 60);

      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      if (minutes === 0) return hours;
      if (minutes <= 30) return hours + 0.5;
      return hours + 1;
   };

   const checkIn = form.watch("checkIn");
   const checkOut = form.watch("checkOut");
   const overtimeHours = form.watch("overtimeHours");

   useEffect(() => {
      if (checkIn && checkOut && checkOut > checkIn) {
         const regularHours = calculateHours(checkIn, checkOut);
         form.setValue("regularHours", regularHours);

         const currentOvertimeHours = form.getValues("overtimeHours") || 0;
         form.setValue("totalHours", regularHours + currentOvertimeHours);
      } else if (!checkOut) {
         form.setValue("regularHours", 0);
         const currentOvertimeHours = form.getValues("overtimeHours") || 0;
         form.setValue("totalHours", currentOvertimeHours);
      }
   }, [checkIn, checkOut, form]);

   useEffect(() => {
      const regularHours = form.getValues("regularHours") || 0;
      const currentOvertimeHours = overtimeHours || 0;
      form.setValue("totalHours", regularHours + currentOvertimeHours);
   }, [overtimeHours, form]);

   const onSubmit = async (data: TimeKeepingFormData) => {
      const res = await createTimeKeeping(data);
      if (res.status === "success") {
         toast.success(res.message);
         form.reset();
         setOpen(false);
      } else {
         toast.error(res.message);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus />
               Time Keeping
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-md">
            <DialogHeader>
               <DialogTitle>Work shift assignment form</DialogTitle>
               <DialogDescription>
                  Assign a shift to an employee
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormField
                     control={form.control}
                     name="employee.user.id"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Employee</FormLabel>
                           <FormControl>
                              <Select
                                 value={field.value}
                                 onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedEmployee = employees.find(
                                       (emp) => emp.id === value,
                                    );
                                    if (selectedEmployee) {
                                       form.setValue(
                                          "employee.user.name",
                                          selectedEmployee.name,
                                       );
                                    }
                                 }}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Employee" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {employees.map((employee: any) => (
                                       <SelectItem
                                          key={employee.id}
                                          value={employee.id}
                                       >
                                          {employee.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="shift.id"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Shift</FormLabel>
                           <FormControl>
                              <Select
                                 value={field.value}
                                 onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedShift = shifts.find(
                                       (shift) => shift.id === value,
                                    );
                                    if (selectedShift) {
                                       form.setValue(
                                          "shift.name",
                                          selectedShift.name,
                                       );
                                    }
                                 }}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select shifts" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {shifts.map((shift: any) => (
                                       <SelectItem
                                          key={shift.id}
                                          value={shift.id}
                                       >
                                          {shift.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="workDate"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Work Date</FormLabel>
                           <FormControl>
                              <Input
                                 type="date"
                                 value={
                                    field.value?.toISOString().split("T")[0] ||
                                    ""
                                 }
                                 onChange={(e) =>
                                    field.onChange(new Date(e.target.value))
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="checkIn"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Check In Time</FormLabel>
                              <FormControl>
                                 <Input
                                    type="datetime-local"
                                    value={
                                       field.value
                                          ?.toISOString()
                                          .slice(0, 16) || ""
                                    }
                                    onChange={(e) =>
                                       field.onChange(new Date(e.target.value))
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="checkOut"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Check Out Time</FormLabel>
                              <FormControl>
                                 <Input
                                    type="datetime-local"
                                    value={
                                       field.value
                                          ?.toISOString()
                                          .slice(0, 16) || ""
                                    }
                                    onChange={(e) =>
                                       field.onChange(
                                          e.target.value
                                             ? new Date(e.target.value)
                                             : undefined,
                                       )
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="regularHours"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Regular Hours</FormLabel>
                              <FormControl>
                                 <Input disabled {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="overtimeHours"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Overtime Hours</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                       field.onChange(
                                          e.target.value
                                             ? parseFloat(e.target.value)
                                             : 0,
                                       )
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="totalHours"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Hours</FormLabel>
                              <FormControl>
                                 <Input disabled {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <SubmitButton type="submit" className="w-full">
                     Submit Time Entry
                  </SubmitButton>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
