"use client";

import { createIngredientTransaction } from "@/actions/ingredient";
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
import { Input, InputWrapper } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { IngredientTransactionType } from "@/lib/generated/prisma";
import {
   AddIngredientTransactionFormValues,
   addIngredientTransactionSchema,
} from "@/schemas/ingredient-transaction";
import { IngredientWithStock } from "@/types/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddTransactionFormProps {
   ingredients: IngredientWithStock[];
}

export function AddTransactionForm({ ingredients }: AddTransactionFormProps) {
   const { data: session } = authClient.useSession();
   const router = useRouter()
   const [isOpen, setIsOpen] = useState(false);
   const form = useForm<AddIngredientTransactionFormValues>({
      resolver: zodResolver(addIngredientTransactionSchema),
      defaultValues: {
         ingredientId: "",
         type: "IMPORT",
         quantity: 0,
         price: 0,
         notes: "",
         createdById: session?.user.id,
      },
   });

   const onSubmit = async (values: AddIngredientTransactionFormValues) => {
      const result = await createIngredientTransaction(values);

      if (result.status === "error") {
         toast.message(result.message);
      }

      toast.message(result.message);
      form.reset();
      router.refresh()
      setIsOpen(false);
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus />
               Add Transaction
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add Transaction</DialogTitle>
               <DialogDescription>
                  Fill in the details below to add a new transaction.
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="ingredientId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Ingredient</FormLabel>
                              <Select
                                 disabled={form.formState.isSubmitting}
                                 value={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger className="w-full">
                                       <SelectValue
                                          placeholder="Select ingredient"
                                          className="w-full"
                                       />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {ingredients.map((ingredient) => (
                                       <SelectItem
                                          key={ingredient.id}
                                          value={ingredient.id}
                                       >
                                          {ingredient.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Transaction Type</FormLabel>
                              <Select
                                 disabled={form.formState.isSubmitting}
                                 value={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger className="w-full">
                                       <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {Object.values(
                                       IngredientTransactionType,
                                    ).map((type) => (
                                       <SelectItem key={type} value={type}>
                                          {type}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="quantity"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Quantity</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={form.formState.isSubmitting}
                                 type="number"
                                 placeholder="10"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <InputWrapper>
                                 <Input
                                    disabled={form.formState.isSubmitting}
                                    type="number"
                                    placeholder="1000"
                                    {...field}
                                 />
                                 <Banknote />
                              </InputWrapper>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="createdById"
                     render={({ field }) => (
                        <FormItem className="hidden">
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <Input type="hidden" readOnly {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="notes"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Notes</FormLabel>
                           <FormControl>
                              <Textarea
                                 {...field}
                                 disabled={form.formState.isSubmitting}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <DialogFooter>
                     <SubmitButton
                        disabled={form.formState.isSubmitting}
                        isLoading={form.formState.isSubmitting}
                        loadingText="Saving..."
                     >
                        Save
                     </SubmitButton>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
