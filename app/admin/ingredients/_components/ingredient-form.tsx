"use client";

import { createIngredient } from "@/actions/ingredient";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { FileUploadWithUploadthing } from "@/components/ui/file-upload-with-uploadthing";
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   SheetTitle,
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTrigger,
   SheetDescription,
   SheetFooter,
} from "@/components/ui/sheet";
import { IngredientUnit } from "@/lib/generated/prisma";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function IngredientForm() {
   const [isOpen, setIsOpen] = useState(false);
   const form = useForm<IngredientFormValue>({
      resolver: zodResolver(ingredientSchema),
      defaultValues: {
         name: "",
         code: "",
         image: {},
         unit: IngredientUnit.KG,
      },
   });

   const generateCode = () => {
      const randomCode = Math.random()
         .toString(36)
         .substring(2, 8)
         .toUpperCase();
      form.setValue("code", randomCode, { shouldValidate: true });
   };

   const onSubmit = async (values: IngredientFormValue) => {
      try {
         const result = await createIngredient(values);

         if (result.status === "error") {
            toast.error("Failed to create ingredient", {
               description: result.message,
            });
            return;
         }

         toast.success(result.message);
         form.reset();
         setIsOpen(false);
      } catch (error: any) {
         toast.error("Failed to create ingredient", {
            description: error.message,
         });
      }
   };

   return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            <Button>
               <Plus className="size-4" />
               Create
            </Button>
         </SheetTrigger>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle>Create Ingredient</SheetTitle>
               <SheetDescription>
                  Fill in the details below to create a new ingredient.
               </SheetDescription>
            </SheetHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-4"
               >
                  <FormField
                     control={form.control}
                     name="image"
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                 <FileUploader
                                    onUploadComplete={(uploadedFiles) => {
                                       if (
                                          uploadedFiles &&
                                          uploadedFiles.length > 0
                                       ) {
                                          const file = uploadedFiles[0];
                                          field.onChange({
                                             key: file.key,
                                             ufsUrl: file.url,
                                          });
                                       }
                                    }}
                                    maxFiles={1}
                                    accept={["image/*"]}
                                    className="w-full"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <div className="flex items-center gap-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Ingredient Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="e.g., Flour" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Choose unit" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {Object.values(IngredientUnit).map(
                                       (unit) => (
                                          <SelectItem key={unit} value={unit}>
                                             {unit}
                                          </SelectItem>
                                       ),
                                    )}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="code"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Code</FormLabel>
                           <div className="flex items-center gap-4">
                              <FormControl>
                                 <Input
                                    placeholder="Input code for ingredient"
                                    {...field}
                                 />
                              </FormControl>
                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={generateCode}
                              >
                                 Generate Code
                              </Button>
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button type="submit" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? (
                        <>
                           <Loader2 className="size-4 animate-spin" />
                           Saving...
                        </>
                     ) : (
                        "Save"
                     )}
                  </Button>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
}
