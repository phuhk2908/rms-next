"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Edit, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValue, employeeSchema } from "@/schemas/employee";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/generated/prisma";
import { authClient } from "@/lib/auth-client";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateEmployee } from "@/actions/employee";
import { SalaryType } from "@/lib/generated/prisma";

interface EmployeeProps {
   employeeData: EmployeeFormValue;
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateEmployeeForm = ({ employeeData, open, setOpen }: EmployeeProps) => {
   const { data: session } = authClient.useSession();

   const form = useForm<EmployeeFormValue>({
      resolver: zodResolver(employeeSchema),
      defaultValues: employeeData,
   });

   const onSubmit = async (data: EmployeeFormValue) => {
      const res = await updateEmployee(data);
      if (res.status === "success") {
         toast.success(res.message);
         setOpen(false);
      } else {
         toast.error(res.message);
      }
   };
   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle className="text-xl">Update Employee</SheetTitle>
            </SheetHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-4"
               >
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Full Name
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Email <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="abc@employee.com"
                                    {...field}
                                    disabled
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Role <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={session?.user.role !== "ADMIN"}
                                 >
                                    <FormControl>
                                       <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select Role" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {Object.values(UserRole).map(
                                          (role, idx) => (
                                             <SelectItem key={idx} value={role}>
                                                {role}
                                             </SelectItem>
                                          ),
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="employeeProfile.position"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Position
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Staff, manager,..."
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="employeeProfile.startDate"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant={"outline"}
                                          className={cn(
                                             "w-full pl-3 text-left font-normal",
                                             !field.value &&
                                                "text-muted-foreground",
                                          )}
                                       >
                                          {field.value ? (
                                             formatDate(field.value, "PPP")
                                          ) : (
                                             <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                 >
                                    <Calendar
                                       mode="single"
                                       selected={new Date(field.value)}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date("1900-01-01")
                                       }
                                       captionLayout="dropdown"
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="employeeProfile.phoneNumber"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Phone Number
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="+84 xxxx xxxx"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     <FormField
                        control={form.control}
                        name="employeeProfile.salaryType"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Salary Type</FormLabel>
                              <FormControl>
                                 <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="mt-2 flex gap-8"
                                 >
                                    <FormItem className="flex items-center space-x-2">
                                       <FormControl>
                                          <RadioGroupItem
                                             value={SalaryType.MONTHLY}
                                          />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Monthly Salary
                                       </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center space-x-2">
                                       <FormControl>
                                          <RadioGroupItem
                                             value={SalaryType.HOURLY}
                                          />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Hourly Rate
                                       </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center space-x-2">
                                       <FormControl>
                                          <RadioGroupItem
                                             value={SalaryType.MIXED}
                                          />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Mixed
                                       </FormLabel>
                                    </FormItem>
                                 </RadioGroup>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {form.watch("employeeProfile.salaryType") !==
                        SalaryType.HOURLY && (
                        <FormField
                           control={form.control}
                           name="employeeProfile.baseSalary"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Base Salary
                                    <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="1500"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {form.watch("employeeProfile.salaryType") !==
                        SalaryType.MONTHLY && (
                        <FormField
                           control={form.control}
                           name="employeeProfile.hourlyRate"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Hourly Rate
                                    <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="25"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="employeeProfile.address.street"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Street
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="123 Avenue" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="employeeProfile.address.ward"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Ward <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="Ward 1" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="employeeProfile.address.district"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 District
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="District 1" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="employeeProfile.address.province"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Province{" "}
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Ho Chi Minh City"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <Button type="submit">Update</Button>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
};

export default UpdateEmployeeForm;
