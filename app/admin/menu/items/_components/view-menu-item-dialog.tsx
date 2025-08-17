"use client";

import { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { type MenuItem, MenuItemStatus } from "@/types/menu";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface ViewMenuItemDialogProps {
   item: MenuItem;
   trigger?: React.ReactNode;
}

export function ViewMenuItemDialog({ item, trigger }: ViewMenuItemDialogProps) {
   const [isOpen, setIsOpen] = useState(false);

   const getStatusBadge = (status: MenuItemStatus) => {
      const variants = {
         [MenuItemStatus.AVAILABLE]: "bg-green-100 text-green-800",
         [MenuItemStatus.UNAVAILABLE]: "bg-yellow-100 text-yellow-800",
      };

      return (
         <Badge className={variants[status]}>{status.replace("_", " ")}</Badge>
      );
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            {trigger || (
               <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 bg-transparent"
               >
                  <Eye className="h-3 w-3" />
                  View
               </Button>
            )}
         </DialogTrigger>
         <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl">{item.name}</DialogTitle>
               {item.nameEn && (
                  <DialogDescription className="text-base">
                     {item.nameEn}
                  </DialogDescription>
               )}
            </DialogHeader>

            <div className="space-y-6">
               {/* Images */}
               {item.images && item.images.length > 0 && (
                  <div className="space-y-2">
                     <h3 className="text-muted-foreground text-sm font-medium">
                        Images
                     </h3>

                     <div className="flex gap-4 overflow-x-auto pb-2">
                        {item.images.map((image, index) => (
                           <div
                              key={image.key}
                              className="group relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm"
                           >
                              <Image
                                 src={image.ufsUrl}
                                 alt={`Preview ${index + 1}`}
                                 fill
                                 sizes="auto"
                                 className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               <Separator />

               {/* Basic Info */}
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                        Price
                     </h3>
                     <p className="text-lg font-semibold text-green-600">
                        {formatPrice(item.price)}
                     </p>
                  </div>
                  <div>
                     <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                        Category
                     </h3>
                     <p className="text-sm">{item.category.name}</p>
                     {item.category.nameEn && (
                        <p className="text-xs text-gray-500">
                           {item.category.nameEn}
                        </p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                        Status
                     </h3>
                     {getStatusBadge(item.status as MenuItemStatus)}
                  </div>
                  <div>
                     <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                        Active
                     </h3>
                     <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                     </Badge>
                  </div>
               </div>

               <Separator />

               {/* Descriptions */}
               {(item.description || item.descriptionEn) && (
                  <div className="space-y-4">
                     {item.description && (
                        <div>
                           <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                              Description
                           </h3>
                           <p className="text-muted-foreground text-sm leading-relaxed">
                              {item.description}
                           </p>
                        </div>
                     )}
                     {item.descriptionEn && (
                        <div>
                           <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                              English Description
                           </h3>
                           <p className="text-muted-foreground text-sm leading-relaxed">
                              {item.descriptionEn}
                           </p>
                        </div>
                     )}
                  </div>
               )}

               {/* Recipe Info */}
               {item.recipe && (
                  <div>
                     <Separator />

                     <h3 className="ttext-muted-foreground mb-1 text-sm font-medium">
                        Recipe
                     </h3>
                     <p className="text-sm">{item.recipe.name}</p>
                     {item.recipe.description && (
                        <p className="text-xs text-gray-500">
                           {item.recipe.description}
                        </p>
                     )}
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
