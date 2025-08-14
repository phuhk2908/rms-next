"use client";

import { FileUploader } from "@/components/file-uploader";
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { IngredientUnit } from "@/lib/generated/prisma";
import { IngredientFormValue } from "@/schemas/ingredient";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface IngredientFormProps {
   form: UseFormReturn<IngredientFormValue>;
   onSubmit: (values: IngredientFormValue) => void;
}

export function IngredientForm({ form, onSubmit }: IngredientFormProps) {
   const generateCode = () => {
      const randomCode = Math.random()
         .toString(36)
         .substring(2, 8)
         .toUpperCase();
      form.setValue("code", randomCode, { shouldValidate: true });
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
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
   );
}
