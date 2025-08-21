"use client";

import { Button } from "@/components/ui/button";
import { Plus, ChefHat, Utensils, Trash2 } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useRecipeActions } from "./recipe-actions";

export function RecipeFormSheet({
   menuItems,
   ingredients,
   recipe = null,
   isOpen: externalIsOpen,
   onOpenChange: externalOnOpenChange,
   hideTrigger = false,
}: {
   menuItems: any[];
   ingredients: any[];
   recipe?: any;
   isOpen?: boolean;
   onOpenChange?: (open: boolean) => void;
   hideTrigger?: boolean;
}) {
   const {
      formData,
      instructionSteps,
      isPending,
      formIsOpen,
      setIsOpen,
      handleInputChange,
      addIngredient,
      removeIngredient,
      updateIngredient,
      addInstructionStep,
      removeInstructionStep,
      updateInstructionStep,
      onSubmit,
   } = useRecipeActions(recipe, externalIsOpen, externalOnOpenChange);

   return (
      <Sheet open={formIsOpen} onOpenChange={setIsOpen}>
         {!hideTrigger && (
            <SheetTrigger asChild>
               <Button>
                  <Plus className="size-4" />
                  {recipe ? "Edit Recipe" : "Add Recipe"}
               </Button>
            </SheetTrigger>
         )}
         <SheetContent className="w-120 overflow-y-auto">
            <SheetHeader>
               <SheetTitle>
                  {recipe ? "Edit Recipe" : "Add New Recipe"}
               </SheetTitle>
               <SheetDescription>
                  {recipe
                     ? "Update the recipe details below."
                     : "Create a new recipe with all the details. Fill in the required fields to get started."}
               </SheetDescription>
            </SheetHeader>
            <div className="px-4">
               <form onSubmit={onSubmit} className="space-y-6 py-6">
                  <div className="space-y-2">
                     <Label htmlFor="name">
                        Recipe Name
                        <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        id="name"
                        placeholder="Enter recipe name"
                        value={formData.name}
                        onChange={(e) =>
                           handleInputChange("name", e.target.value)
                        }
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Describe your recipe..."
                        rows={3}
                        className="resize-none"
                        value={formData.description || ""}
                        onChange={(e) =>
                           handleInputChange("description", e.target.value)
                        }
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="menuItem">Menu Item (Optional)</Label>
                     <Select
                        value={formData.menuItemId || ""}
                        onValueChange={(value) =>
                           handleInputChange("menuItemId", value)
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select menu item" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="none">None</SelectItem>
                           {menuItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                 {item.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="estimatedCost">
                           Estimated Cost ($)
                        </Label>
                        <Input
                           id="estimatedCost"
                           type="text"
                           inputMode="decimal"
                           pattern="[0-9]*"
                           placeholder="0.00"
                           value={formData.estimatedCost || ""}
                           onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange(
                                 "estimatedCost",
                                 value === "" ? undefined : Number(value),
                              );
                           }}
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="preparationTime">
                           Prep Time (minutes)
                        </Label>
                        <Input
                           id="preparationTime"
                           type="number"
                           min="1"
                           placeholder="30"
                           value={formData.preparationTime || ""}
                           onChange={(e) =>
                              handleInputChange(
                                 "preparationTime",
                                 e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                              )
                           }
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="servingSize">Serving Size</Label>
                     <Input
                        id="servingSize"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        value={formData.servingSize?.toString() ?? ""}
                        onChange={(e) =>
                           handleInputChange(
                              "servingSize",
                              e.target.value === ""
                                 ? 0
                                 : Number(e.target.value),
                           )
                        }
                     />
                  </div>

                  {/* Ingredients Section */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <Utensils className="text-primary h-5 w-5" />
                           <Label className="text-base font-semibold">
                              Recipe Ingredients
                           </Label>
                        </div>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={addIngredient}
                        >
                           <Plus className="mr-1 h-4 w-4" />
                           Add Ingredient
                        </Button>
                     </div>
                     <ScrollArea className="bg-muted/50 h-[280px] rounded-lg border">
                        {formData.ingredients &&
                        formData.ingredients.length > 0 ? (
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead className="w-12 text-center">
                                       #
                                    </TableHead>
                                    <TableHead>Ingredient</TableHead>
                                    <TableHead className="w-24 text-center">
                                       Quantity
                                    </TableHead>
                                    <TableHead className="w-16 text-center">
                                       Unit
                                    </TableHead>
                                    <TableHead className="w-12"></TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {formData.ingredients.map(
                                    (ingredient, index) => (
                                       <TableRow key={index} className="group">
                                          <TableCell className="text-center">
                                             {index + 1}
                                          </TableCell>
                                          <TableCell>
                                             <Select
                                                value={ingredient.ingredientId}
                                                onValueChange={(value) =>
                                                   updateIngredient(
                                                      index,
                                                      "ingredientId",
                                                      value,
                                                   )
                                                }
                                             >
                                                <SelectTrigger className="h-8 border-0 p-1 focus:ring-0">
                                                   <SelectValue placeholder="Choose ingredient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                   {ingredients.map((ing) => (
                                                      <SelectItem
                                                         key={ing.id}
                                                         value={ing.id}
                                                      >
                                                         <div className="flex items-center space-x-2">
                                                            <span>
                                                               {ing.name}
                                                            </span>
                                                            <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
                                                               {ing.unit}
                                                            </span>
                                                         </div>
                                                      </SelectItem>
                                                   ))}
                                                </SelectContent>
                                             </Select>
                                          </TableCell>
                                          <TableCell className="text-center">
                                             <Input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                step="0.1"
                                                value={
                                                   ingredient.quantity || ""
                                                }
                                                onChange={(e) =>
                                                   updateIngredient(
                                                      index,
                                                      "quantity",
                                                      Number(e.target.value) ||
                                                         0,
                                                   )
                                                }
                                                className="h-8 border-0 p-0 text-center focus:ring-0"
                                             />
                                          </TableCell>
                                          <TableCell className="text-muted-foreground text-center text-sm">
                                             {ingredients.find(
                                                (ing) =>
                                                   ing.id ===
                                                   ingredient.ingredientId,
                                             )?.unit || "unit"}
                                          </TableCell>
                                          <TableCell className="text-center">
                                             <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   removeIngredient(index)
                                                }
                                                className="hover:bg-destructive hover:text-destructive-foreground h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                             >
                                                <Trash2 className="h-3 w-3" />
                                             </Button>
                                          </TableCell>
                                       </TableRow>
                                    ),
                                 )}
                              </TableBody>
                           </Table>
                        ) : (
                           <div className="text-muted-foreground py-8 text-center">
                              <Utensils className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
                              <p>No ingredients added yet</p>
                              <p className="text-sm">
                                 Click &quot;Add Ingredient&quot; to start building your
                                 recipe
                              </p>
                           </div>
                        )}
                     </ScrollArea>
                  </div>

                  {/* Instructions Section */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <ChefHat className="text-primary h-5 w-5" />
                           <Label className="text-base font-semibold">
                              Cooking Instructions
                           </Label>
                        </div>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={addInstructionStep}
                        >
                           <Plus className="mr-1 h-4 w-4" />
                           Add Step
                        </Button>
                     </div>
                     <ScrollArea className="bg-muted/50 h-[320px] rounded-lg border">
                        {instructionSteps && instructionSteps.length > 0 ? (
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead className="w-12 text-center">
                                       Step
                                    </TableHead>
                                    <TableHead>Instructions</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {instructionSteps.map((step, index) => (
                                    <TableRow key={index} className="group">
                                       <TableCell className="text-center">
                                          {index + 1}
                                       </TableCell>
                                       <TableCell>
                                          <Textarea
                                             placeholder={`Describe step ${index + 1} in detail...`}
                                             rows={2}
                                             className="placeholder-muted-foreground min-h-[3rem] resize-none border-0 bg-transparent p-1 focus:ring-0"
                                             value={step}
                                             onChange={(e) =>
                                                updateInstructionStep(
                                                   index,
                                                   e.target.value,
                                                )
                                             }
                                          />
                                       </TableCell>
                                       <TableCell className="text-center">
                                          {instructionSteps.length > 1 && (
                                             <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   removeInstructionStep(index)
                                                }
                                                className="hover:bg-destructive hover:text-destructive-foreground h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                             >
                                                <Trash2 className="h-3 w-3" />
                                             </Button>
                                          )}
                                       </TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                        ) : (
                           <div className="text-muted-foreground py-8 text-center">
                              <ChefHat className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
                              <p>No cooking steps added yet</p>
                              <p className="text-sm">
                                 Click &quot;Add Step&quot; to start
                              </p>
                           </div>
                        )}
                     </ScrollArea>
                  </div>

                  <SheetFooter>
                     <SubmitButton
                        isLoading={isPending}
                        type="submit"
                        className="w-full"
                     >
                        {recipe ? "Update Recipe" : "Create Recipe"}
                     </SubmitButton>
                  </SheetFooter>
               </form>
            </div>
         </SheetContent>
      </Sheet>
   );
}
