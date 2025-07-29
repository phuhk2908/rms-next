"use client";

import { deleteMenuCategory, updateMenuCategoryStatus } from "@/actions/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import {
   Edit,
   Eye,
   MoreVertical,
   Trash2,
   Package,
   EyeOff,
   Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import AddMenuCategoryForm from "./add-menu-category-form";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function MenuCategoryCard({ menuCategory }: { menuCategory: any }) {
   return (
      <Card className="group transform gap-0 overflow-hidden border-0 py-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
         <div className="relative">
            <div className={cn("relative h-48 overflow-hidden")}>
               <Image
                  src={`${env.NEXT_PUBLIC_UPLOADTHING_PRE_URL}/${menuCategory.image}`}
                  alt={menuCategory.name}
                  unoptimized
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  fill
                  sizes="auto"
               />
               <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="absolute top-2 right-2">
               <MenuCategoryCardControl menuCategory={menuCategory} />
            </div>
         </div>

         <CardContent className="p-4">
            <div className="space-y-3">
               <Badge variant={menuCategory.isActive ? "default" : "secondary"}>
                  {menuCategory.isActive ? "Active" : "Inactive"}
               </Badge>
               <div className="flex items-center justify-between">
                  <h3 className="group-hover:text-primary text-xl font-semibold">
                     {menuCategory.name}
                  </h3>
                  <div className="text-muted-foreground flex items-center space-x-1">
                     <Package className="size-4" />
                     <span className="text-sm font-medium">
                        {menuCategory._count.menuItems || 0}
                     </span>
                  </div>
               </div>
               <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {menuCategory.description}
               </p>

               <div className="flex items-center justify-end">
                  <AddMenuCategoryForm
                     mode="edit"
                     menuCategory={menuCategory}
                  />
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

function MenuCategoryCardControl({ menuCategory }: { menuCategory: any }) {
   const [isAlertOpen, setIsAlertOpen] = useState(false);
   const [isUpdateStatusPending, startUpdateStatusTransition] = useTransition();
   const [isDeletePending, startDeleteTransition] = useTransition();

   const handleUpdateStatus = () => {
      startUpdateStatusTransition(async () => {
         try {
            const result = await updateMenuCategoryStatus(
               menuCategory.id,
               !menuCategory.isActive,
            );
            toast.success(result.message);
         } catch (error: any) {
            toast.error(error.message);
         }
      });
   };

   const handleDeleteCategory = () => {
      startDeleteTransition(async () => {
         try {
            const result = await deleteMenuCategory(menuCategory.id);
            toast.success(result.message);
         } catch (error: any) {
            toast.error(error.message);
         }
      });
   };
   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  disabled={isDeletePending || isUpdateStatusPending}
                  className="size-8"
                  size="icon"
                  variant="default"
               >
                  {isDeletePending || isUpdateStatusPending ? (
                     <Loader2 className="size-4 animate-spin" />
                  ) : (
                     <MoreVertical className="size-4" />
                  )}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={handleUpdateStatus}>
                  {menuCategory.isActive ? (
                     <>
                        <EyeOff className="h-4 w-4" />
                        Deactivate
                     </>
                  ) : (
                     <>
                        <Eye className="h-4 w-4" />
                        Activate
                     </>
                  )}
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  onClick={() => setIsAlertOpen(!isAlertOpen)}
                  className="text-red-600 focus:text-red-600"
               >
                  <Trash2 className="size-4 text-red-600" />
                  Delete Category
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         <ConfirmDialog
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={handleDeleteCategory}
            open={isAlertOpen}
            onOpenChange={setIsAlertOpen}
         />
      </>
   );
}
