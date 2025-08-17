"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
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
import { SalaryType, UserRole } from "@/lib/generated/prisma";
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
import { createEmployee } from "@/actions/employee";
import { toast } from "sonner";
import { SubmitButton } from "@/components/ui/submit-button";

const EmployeeForm = () => {
   const [open, setOpen] = useState(false);
   const { data: session } = authClient.useSession();

   const form = useForm<EmployeeFormValue>({
      resolver: zodResolver(employeeSchema),
      defaultValues: {
         name: "",
         email: "",
         role: UserRole.STAFF,
         employeeProfile: {
            position: "",
            dateOfBirth: new Date(),
            phoneNumber: "",
            salaryType: SalaryType.HOURLY,
            baseSalary: undefined,
            hourlyRate: undefined,
            address: {
               street: "",
               ward: "",
               district: "",
               province: "",
            },
         },
      },
   });

   const salaryType = form.watch("employeeProfile.salaryType");

   const onSubmit = async (data: EmployeeFormValue) => {
      const res = await createEmployee(data);
      if (res.status === "success") {
         toast.success(res.message);
         form.reset();
         setOpen(false);
      } else {
         toast.error(res.message);
      }
   };

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button>
               <Plus />
               Employee
            </Button>
         </SheetTrigger>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle className="text-xl">Create New Employee</SheetTitle>
               <SheetDescription>
                  Please fill in the employee information below.
               </SheetDescription>
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
                              <FormLabel>Position</FormLabel>
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
                        name="employeeProfile.dateOfBirth"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Date of Birth</FormLabel>
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
                                       selected={field.value}
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
                                    {Object.values(SalaryType).map((type) => (
                                       <FormItem
                                          className="flex items-center space-x-2"
                                          key={type}
                                       >
                                          <FormControl>
                                             <RadioGroupItem value={type} />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                             {type}
                                          </FormLabel>
                                       </FormItem>
                                    ))}
                                 </RadioGroup>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {(salaryType === SalaryType.MONTHLY ||
                     salaryType === SalaryType.MIXED) && (
                     <FormField
                        control={form.control}
                        name="employeeProfile.baseSalary"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Basic Salary (VND)
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="15000000"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(Number(e.target.value))
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}

                  {(salaryType === SalaryType.HOURLY ||
                     salaryType === SalaryType.MIXED) && (
                     <FormField
                        control={form.control}
                        name="employeeProfile.hourlyRate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Hourly Rate (VND)
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="50000"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(Number(e.target.value))
                                    }
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="employeeProfile.address.street"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Street</FormLabel>
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
                              <FormLabel></FormLabel>
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
                              <FormLabel>District</FormLabel>
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
                              <FormLabel>Province</FormLabel>
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
                  <SubmitButton
                     type="submit"
                     loadingText="Loading..."
                     isLoading={form.formState.isSubmitting}
                     disabled={form.formState.isSubmitting}
                  >
                     Create
                  </SubmitButton>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
};

export default EmployeeForm;
