"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MenuItemCard } from "./menu-item-card";
import { DeletedMenuItemActions } from "./deleted-menu-item-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images } from "lucide-react";
import { type MenuItem } from "@/types/menu";
import Image from "next/image";

interface MenuItemsListProps {
   menuItems: MenuItem[];
   categories: { id: string; name: string }[];
}

export function MenuItemsList({ menuItems, categories }: MenuItemsListProps) {
   const [showDeleted, setShowDeleted] = useState(false);

   const activeItems = menuItems.filter((item) => !item.deletedAt);
   const deletedItems = menuItems.filter((item) => item.deletedAt);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
   };

   const displayItems = showDeleted ? deletedItems : activeItems;

   return (
      <div className="space-y-6">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground flex gap-4 text-sm">
               <span>Active: {activeItems.length}</span>
               <span>Deleted: {deletedItems.length}</span>
               <span>Total: {menuItems.length}</span>
            </div>

            <div className="flex items-center space-x-2">
               <Switch
                  id="show-deleted"
                  checked={showDeleted}
                  onCheckedChange={setShowDeleted}
               />
               <Label htmlFor="show-deleted">Show deleted items</Label>
            </div>
         </div>

         {/* Items grid */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item) => {
               if (item.deletedAt) {
                  // Render deleted item with special styling
                  return (
                     <Card
                        key={item.id}
                        className="overflow-hidden border-red-200 opacity-75 transition-shadow hover:shadow-md pt-0"
                     >
                        <CardHeader className="p-0">
                           {item.images && item.images.length > 0 && (
                              <div className="relative">
                                 <Image
                                    src={
                                       item.images[0].ufsUrl ||
                                       "/placeholder.svg"
                                    }
                                    alt={item.images[0].id}
                                    className="h-48 w-full object-cover grayscale"
                                    width={400}
                                    height={192}
                                 />
                                 {item.images.length > 1 && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                                       <Images className="h-3 w-3" />
                                       {item.images.length}
                                    </div>
                                 )}
                                 <div className="absolute inset-0 bg-red-900/20" />
                              </div>
                           )}
                        </CardHeader>

                        <CardContent className="space-y-4">
                           <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                 <CardTitle className="text-lg line-through">
                                    {item.name}
                                 </CardTitle>
                                 {item.nameEn && (
                                    <p className="text-sm text-gray-500 line-through">
                                       {item.nameEn}
                                    </p>
                                 )}
                              </div>
                           </div>
                           <div>
                              <p className="line-clamp-2 text-sm text-gray-600">
                                 {item.description}
                              </p>
                           </div>

                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-lg font-semibold text-gray-500 line-through">
                                    {formatPrice(item.price)}
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    Category: {item.category.name}
                                 </p>
                              </div>
                           </div>

                           <div className="border-t pt-2">
                              <DeletedMenuItemActions
                                 menuItemId={item.id}
                                 menuItemName={item.name}
                              />
                           </div>
                        </CardContent>
                     </Card>
                  );
               } else {
                  // Render active item normally
                  return (
                     <MenuItemCard
                        key={item.id}
                        item={item}
                        categories={categories}
                     />
                  );
               }
            })}
         </div>

         {/* Empty state */}
         {displayItems.length === 0 && (
            <div className="py-12 text-center">
               <div className="text-gray-500">
                  {showDeleted
                     ? "No deleted items found."
                     : "No menu items found."}
               </div>
            </div>
         )}
      </div>
   );
}
