import React, { Dispatch, SetStateAction } from "react";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { ShiftFormValue, shiftSchema } from "@/schemas/shift";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { toast } from "sonner";
import { updateShift } from "@/actions/shift";

interface ShiftProps {
   shiftData: ShiftFormValue;
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateShiftForm = ({ shiftData, open, setOpen }: ShiftProps) => {
   const form = useForm<ShiftFormValue>({
      resolver: zodResolver(shiftSchema),
      defaultValues: {
         ...shiftData,
      },
   });

   const onSubmit = async (data: ShiftFormValue) => {
      const res = await updateShift(data);
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
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle className="text-xl">Update Shift</SheetTitle>
               <SheetDescription>
                  Please fill in the employee information below.
               </SheetDescription>
            </SheetHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 px-4"
               >
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Name <span className="text-red-500">*</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Morning / Night / Break Shift"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     {" "}
                     <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Start Time{" "}
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="8:00" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 End Time{" "}
                                 <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="17:00" {...field} />
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
                     Update
                  </SubmitButton>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
};

export default UpdateShiftForm;
