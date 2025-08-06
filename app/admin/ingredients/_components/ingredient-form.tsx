"use client";

import { Button } from "@/components/ui/button";
import { FileUploadWithUploadthing } from "@/components/ui/file-upload-with-uploadthing";
import { Form } from "@/components/ui/form";
import {
   SheetTitle,
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTrigger,
   SheetDescription,
} from "@/components/ui/sheet";
import { IngredientUnit } from "@/lib/generated/prisma";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

export function IngredientForm() {
   const form = useForm<IngredientFormValue>({
      resolver: zodResolver(ingredientSchema),
      defaultValues: {
         name: "",
         code: "",
         image: {
            key: "",
            ufsUrl: "",
         },
         unit: IngredientUnit.KG,
      },
   });

   const onSubmit = (values: IngredientFormValue) => {};

   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button>
               <Plus className="size-4" />
               Create
            </Button>
         </SheetTrigger>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle>Create Ingredient</SheetTitle>
               <SheetDescription></SheetDescription>
            </SheetHeader>

            <Form {...form}>
               <form>
                  <FileUploadWithUploadthing
                     onUploadComplete={(files) => console.log(files)}
                  />
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
}
