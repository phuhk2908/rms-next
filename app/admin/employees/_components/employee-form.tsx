"use client";

import React from "react";
import {
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Eye, Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
   Form,
   FormControl,
   FormDescription,
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
import { createEmployee } from "@/actions/employee";
import { toast } from "sonner";

const EmployeeForm = () => {
   const { data: session } = authClient.useSession();

   const form = useForm<EmployeeFormValue>({
      resolver: zodResolver(employeeSchema),
      defaultValues: {
         name: "",
         email: "",
         role: UserRole.STAFF,
         employeeProfile: {
            position: "",
            startDate: new Date(),
            phoneNumber: "",
            salaryType: "",
            baseSalary: 1,
            hourlyRate: 1,
            address: {
               street: "",
               ward: "",
               district: "",
               province: "",
            },
         },
      },
   });
   const onSubmit = async (data: EmployeeFormValue) => {
      try {
         await createEmployee(data);
         toast.success("Created new employee successfully");
      } catch (error) {
         toast.error("Created new employee failed");
      }
   };
   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button>Employee</Button>
         </SheetTrigger>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle className="text-xl"></SheetTitle>
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
                                    defaultValue={field.value}
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
                              <FormLabel>Date of birth</FormLabel>
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
                                    <FormItem className="flex items-center">
                                       <FormControl>
                                          <RadioGroupItem value="basic" />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Basic Salary
                                       </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center">
                                       <FormControl>
                                          <RadioGroupItem value="hourly" />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Hourly Rate
                                       </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center">
                                       <FormControl>
                                          <RadioGroupItem value="mixed" />
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

                     {form.watch("employeeProfile.salaryType") === "basic" && (
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
                                    <Input placeholder="15$" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {form.watch("employeeProfile.salaryType") === "hourly" && (
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
                                    <Input placeholder="25$/hour" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}
                  </div>

                  {form.watch("employeeProfile.salaryType") === "mixed" && (
                     <div className="grid grid-cols-2 gap-4">
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
                                    <Input placeholder="15$" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
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
                                    <Input placeholder="25$/hour" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  )}
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
                                 <Input placeholder="123 Avanue" {...field} />
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
                                 <Input placeholder="Vietnam" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <Button type="submit">Create</Button>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
};

export default EmployeeForm;
