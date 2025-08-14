"use client";

import { updateIngredient } from "@/actions/ingredient";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { IngredientFormValue, ingredientSchema } from "@/schemas/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IngredientForm } from "./ingredient-form";
import { IngredientWithStock } from "@/types/ingredient";

interface EditIngredientFormProps {
   ingredient: IngredientWithStock;
   isOpen: boolean;
   onOpenChange: (isOpen: boolean) => void;
}

export function EditIngredientForm({
   ingredient,
   isOpen,
   onOpenChange,
}: EditIngredientFormProps) {
   const form = useForm<IngredientFormValue>({
      resolver: zodResolver(ingredientSchema),
      defaultValues: {
         name: ingredient.name,
         code: ingredient.code || "",
         image: {
            key: ingredient.image.key,
            ufsUrl: ingredient.image.ufsUrl,
         },
         unit: ingredient.unit,
      },
   });

   useEffect(() => {
      if (ingredient) {
         form.reset({
            name: ingredient.name,
            code: ingredient.code || "",
            image: {
               key: ingredient.image.key,
               ufsUrl: ingredient.image.ufsUrl,
            },
            unit: ingredient.unit,
         });
      }
   }, [ingredient, form]);

   const onSubmit = async (values: IngredientFormValue) => {
      try {
         const result = await updateIngredient(ingredient.id, values);

         if (result.status === "error") {
            toast.error("Failed to update ingredient", {
               description: result.message,
            });
            return;
         }

         toast.success(result.message);
         onOpenChange(false);
      } catch (error) {
         if (error instanceof Error) {
            toast.error("Failed to update ingredient", {
               description: error.message,
            });
         }
      }
   };

   return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle>Edit Ingredient</SheetTitle>
               <SheetDescription>
                  Update the details for this ingredient.
               </SheetDescription>
            </SheetHeader>
            <div className="px-4 py-8">
               <IngredientForm form={form} onSubmit={onSubmit} />
            </div>
         </SheetContent>
      </Sheet>
   );
}
