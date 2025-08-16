"use client";

import { createIngredient } from "@/actions/ingredient";
import { Button } from "@/components/ui/button";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { IngredientUnit } from "@/lib/generated/prisma";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IngredientForm } from "./ingredient-form";

export function AddIngredientForm() {
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
      } catch (error) {
         if (error instanceof Error) {
            toast.error("Failed to create ingredient", {
               description: error.message,
            });
         }
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
            <div className="px-4">
               <IngredientForm form={form} onSubmit={onSubmit} />
            </div>
         </SheetContent>
      </Sheet>
   );
}
