"use client";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Clock,
   Users,
   DollarSign,
   Edit,
   Trash2,
   MoreHorizontal,
   Copy,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RecipeCard({
   recipe,
   onSelect,
   onEdit,
   onDelete,
   onDuplicate,
   isDeleting = false,
}: {
   recipe: any;
   onSelect: (r: any) => void;
   onEdit?: () => void;
   onDelete?: () => void;
   onDuplicate?: () => void;
   isDeleting?: boolean;
}) {
   return (
      <Card className="cursor-pointer transition-all hover:shadow-lg">
         <CardHeader>
            <div className="flex items-start justify-between">
               <div onClick={() => onSelect(recipe)} className="flex-1">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <CardDescription>
                     {recipe.menuItem?.name || "No menu item assigned"}
                  </CardDescription>
               </div>
               {/* Action dropdown */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {onEdit && (
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation();
                              onEdit();
                           }}
                        >
                           <Edit className="mr-2 h-4 w-4" />
                           Edit
                        </DropdownMenuItem>
                     )}
                     {onDuplicate && (
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation();
                              onDuplicate();
                           }}
                           disabled={isDeleting}
                        >
                           <Copy className="mr-2 h-4 w-4" />
                           Duplicate
                        </DropdownMenuItem>
                     )}
                     {onDelete && (
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation();
                              onDelete();
                           }}
                           className="text-destructive"
                           disabled={isDeleting}
                        >
                           <Trash2 className="mr-2 h-4 w-4" />
                           {isDeleting ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>
               {/* Temporarily hide difficulty indicator until we add it to schema */}
               {/* <div className={`w-3 h-3 rounded-full ${getDifficultyColor(recipe.difficulty || 'EASY')}`} /> */}
            </div>
         </CardHeader>
         <CardContent onClick={() => onSelect(recipe)}>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                     <Clock className="h-3 w-3" />
                     <span>{recipe.preparationTime || 0} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Users className="h-3 w-3" />
                     <span>
                        {recipe.servingSize || 1} serving
                        {recipe.servingSize > 1 ? "s" : ""}
                     </span>
                  </div>
               </div>
               <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                     <DollarSign className="h-3 w-3" />
                     <span>
                        $
                        {recipe.estimatedCost
                           ? Number(recipe.estimatedCost).toFixed(2)
                           : "0.00"}
                     </span>
                  </div>
                  <Badge variant="outline">
                     {recipe.ingredients?.length || 0} ingredients
                  </Badge>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
