"use client";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { Loader2, Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/helpers/try-catch";
import { createMenuCategory } from "@/actions/menu";
import { toast } from "sonner";

export default function AddMenuCategoryForm() {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [isPending, startTransition] = useTransition();
   const form = useForm<MenuItemFormValue>({
      resolver: zodResolver(menuCategorySchema),
      defaultValues: {
         name: "",
         nameEn: "",
      },
   });

   const onSubmit = (values: MenuItemFormValue) => {
      startTransition(async () => {
         const { data: result, error } = await tryCatch(
            createMenuCategory(values),
         );

         if (error) {
            toast.error("An unexpected error occurred. Please try again.");
            return;
         }

         if (result.status === "success") {
            toast.success(result.message);
            form.reset();
            setIsOpen(false);
         } else if (result.status === "error") {
            toast.error(result.message);
         }
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus className="size-4" />
               Add Category
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add new category</DialogTitle>
               <DialogDescription>
                  Enter a name and details to create a new menu category.
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="Name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        name="nameEn"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>English Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="English name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <DialogFooter>
                     <Button className="mt-4" disabled={isPending}>
                        {isPending ? (
                           <>
                              <Loader2 className="size-4 animate-spin" />
                              Creating...
                           </>
                        ) : (
                           <>Create</>
                        )}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
