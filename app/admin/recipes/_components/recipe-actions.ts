"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { createRecipe, updateRecipe } from "@/actions/recipe";
import type { RecipeFormValue } from "@/schemas/recipe";

export type RecipeFormData = RecipeFormValue & {
   menuItemId?: string;
   id?: string;
};

export const useRecipeActions = (
   recipe?: any,
   isOpen?: boolean,
   onOpenChange?: (open: boolean) => void,
) => {
   const [isPending, startTransition] = useTransition();
   const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
   const [instructionSteps, setInstructionSteps] = useState<string[]>([""]);

   // Use external control if provided, otherwise use internal state
   const formIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
   const setIsOpen = onOpenChange || setInternalIsOpen;

   const [formData, setFormData] = useState<RecipeFormData>({
      id: recipe?.id || "",
      name: recipe?.name || "",
      description: recipe?.description || "",
      instructions: recipe?.instructions || "",
      estimatedCost: recipe?.estimatedCost || undefined,
      preparationTime: recipe?.preparationTime || undefined,
      servingSize: recipe?.servingSize || 1,
      ingredients:
         recipe?.ingredients?.map((ing: any) => ({
            ingredientId: ing.ingredient.id,
            quantity: ing.quantity,
         })) || [],
      menuItemId: recipe?.menuItem?.id || "none",
   });

   // Update form data when recipe changes (for edit mode)
   useEffect(() => {
      if (recipe) {
         // Parse existing instructions into steps
         const existingSteps = recipe.instructions
            ? recipe.instructions
                 .split("\n")
                 .map((step: string) => step.replace(/^\d+\.\s*/, "").trim())
                 .filter((step: string) => step.length > 0)
            : [];

         setInstructionSteps(existingSteps.length > 0 ? existingSteps : [""]);

         setFormData({
            id: recipe.id || "",
            name: recipe.name || "",
            description: recipe.description || "",
            instructions: recipe.instructions || "",
            estimatedCost: recipe.estimatedCost
               ? Number(recipe.estimatedCost)
               : undefined,
            preparationTime: recipe.preparationTime || undefined,
            servingSize: recipe.servingSize || 1,
            ingredients:
               recipe.ingredients?.map((ing: any) => ({
                  ingredientId: ing.ingredient.id,
                  quantity: ing.quantity,
               })) || [],
            menuItemId: recipe.menuItem?.id || "none",
         });
      } else {
         // Reset form for create mode
         resetForm();
      }
   }, [recipe]);

   // Update formData.instructions when instructionSteps change
   useEffect(() => {
      const instructionsText = instructionSteps
         .filter((step) => step.trim().length > 0)
         .map((step, index) => `${index + 1}. ${step.trim()}`)
         .join("\n");

      setFormData((prev) => ({
         ...prev,
         instructions: instructionsText,
      }));
   }, [instructionSteps]);

   const resetForm = () => {
      setInstructionSteps([""]);
      setFormData({
         id: "",
         name: "",
         description: "",
         instructions: "",
         estimatedCost: undefined,
         preparationTime: undefined,
         servingSize: 1,
         ingredients: [],
         menuItemId: "none",
      });
   };

   const handleInputChange = (field: keyof RecipeFormData, value: any) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   // Ingredient actions
   const addIngredient = () => {
      setFormData((prev) => ({
         ...prev,
         ingredients: [
            ...(prev.ingredients || []),
            { ingredientId: "", quantity: 0 },
         ],
      }));
   };

   const removeIngredient = (index: number) => {
      setFormData((prev) => ({
         ...prev,
         ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
      }));
   };

   const updateIngredient = (
      index: number,
      field: "ingredientId" | "quantity",
      value: string | number,
   ) => {
      setFormData((prev) => ({
         ...prev,
         ingredients:
            prev.ingredients?.map((ingredient, i) =>
               i === index
                  ? {
                       ...ingredient,
                       [field]: field === "quantity" ? Number(value) : value,
                    }
                  : ingredient,
            ) || [],
      }));
   };

   // Instruction steps actions
   const addInstructionStep = () => {
      setInstructionSteps((prev) => [...prev, ""]);
   };

   const removeInstructionStep = (index: number) => {
      if (instructionSteps.length > 1) {
         setInstructionSteps((prev) => prev.filter((_, i) => i !== index));
      }
   };

   const updateInstructionStep = (index: number, value: string) => {
      setInstructionSteps((prev) =>
         prev.map((step, i) => (i === index ? value : step)),
      );
   };

   // Form submission
   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim()) {
         toast.error("Recipe name is required");
         return;
      }

      startTransition(async () => {
         // Convert "none" to undefined for menuItemId
         const submissionData = {
            ...formData,
            menuItemId:
               formData.menuItemId === "none" ? undefined : formData.menuItemId,
         };

         // Use ternary operator to choose between create and update
         const result = await (recipe
            ? updateRecipe(submissionData as RecipeFormValue & { id: string })
            : createRecipe(submissionData));

         if (result.status === "success") {
            toast.success(result.message);
            // Only reset form data if creating new recipe
            if (!recipe) {
               resetForm();
            }
            setIsOpen(false);
         } else if (result.status === "error") {
            toast.error(result.message);
         }
      });
   };

   return {
      // State
      formData,
      instructionSteps,
      isPending,
      formIsOpen,
      setIsOpen,

      // Actions
      handleInputChange,
      addIngredient,
      removeIngredient,
      updateIngredient,
      addInstructionStep,
      removeInstructionStep,
      updateInstructionStep,
      onSubmit,
      resetForm,
   };
};
