"use client";

import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetDescription,
   SheetFooter,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function RecipeFormSheet({ menuItems }: { menuItems: any[] }) {
   return (
      <Sheet>
         <SheetTrigger>
            <Button variant="outline">Add Recipe</Button>
         </SheetTrigger>
         <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
               <SheetTitle>Create New Recipe</SheetTitle>
               <SheetDescription>
                  Add a new recipe with ingredients and instructions
               </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipeName" className="text-right">
                     Recipe Name
                  </Label>
                  <Input
                     id="recipeName"
                     placeholder="Classic Caesar Salad"
                     className="col-span-3"
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="menuItem" className="text-right">
                     Menu Item
                  </Label>
                  <Select>
                     <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select menu item" />
                     </SelectTrigger>
                     <SelectContent>
                        {menuItems.map((item) => (
                           <SelectItem key={item.id} value={item.id}>
                              {item.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                     Difficulty
                  </Label>
                  <Select>
                     <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select difficulty" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prepTime" className="text-right">
                     Prep Time (min)
                  </Label>
                  <Input
                     id="prepTime"
                     type="number"
                     placeholder="15"
                     className="col-span-3"
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cookTime" className="text-right">
                     Cook Time (min)
                  </Label>
                  <Input
                     id="cookTime"
                     type="number"
                     placeholder="0"
                     className="col-span-3"
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                     Description
                  </Label>
                  <Textarea
                     id="description"
                     placeholder="Recipe description..."
                     className="col-span-3"
                  />
               </div>
            </div>

            <SheetFooter>
               <Button>Create Recipe</Button>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
}
