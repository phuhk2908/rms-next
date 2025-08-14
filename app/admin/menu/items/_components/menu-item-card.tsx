"use client";

import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Images } from "lucide-react";
import { type MenuItem, MenuItemStatus } from "@/types/menu";
import Image from "next/image";
import AddMenuItemForm from "./add-menu-item-form";
import { ViewMenuItemDialog } from "./view-menu-item-dialog";
import { DeleteMenuItemDialog } from "./delete-menu-item-dialog";
import { MenuItemStatusBadge } from "./menu-item-status-badge";

interface MenuItemCardProps {
   item: MenuItem;
   categories: { id: string; name: string }[];
}

export function MenuItemCard({ item, categories }: MenuItemCardProps) {
   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
   };

   return (
      <Card className="justify-between overflow-hidden pt-0 transition-shadow hover:shadow-md">
         <CardHeader className="p-0">
            {item.images && item.images.length > 0 && (
               <div className="relative">
                  <Image
                     src={item.images[0].ufsUrl || "/placeholder.svg"}
                     alt={item.images[0].id}
                     className="h-48 w-full object-cover"
                     width={400}
                     height={220}
                  />
                  {item.images.length > 1 && (
                     <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                        <Images className="h-3 w-3" />
                        {item.images.length}
                     </div>
                  )}
               </div>
            )}
         </CardHeader>

         <CardContent className="space-y-2">
            <div className="flex items-start justify-between">
               <div className="space-y-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.nameEn && (
                     <p className="text-sm text-gray-500">{item.nameEn}</p>
                  )}
               </div>
               <MenuItemStatusBadge
                  menuItemId={item.id}
                  currentStatus={item.status as MenuItemStatus}
               />
            </div>
            <div>
               <p className="line-clamp-2 text-sm text-gray-600">
                  {item.description}
               </p>
               {item.descriptionEn && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                     {item.descriptionEn}
                  </p>
               )}
            </div>

            <div>
               <p className="text-lg font-semibold text-green-600">
                  {formatPrice(item.price)}
               </p>
               <p className="text-xs text-gray-500">
                  Category: {item.category.name}
               </p>
            </div>
         </CardContent>

         <CardFooter className="flex gap-2">
            <ViewMenuItemDialog item={item} />
            <AddMenuItemForm
               mode="edit"
               menuItem={item}
               categories={categories}
            />
            <DeleteMenuItemDialog
               menuItemId={item.id}
               menuItemName={item.name}
            />
         </CardFooter>
      </Card>
   );
}
