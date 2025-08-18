"use client";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { menuItemSchema } from "@/schemas/menu/menu-item";
import { Edit, Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/helpers/try-catch";
import { toast } from "sonner";
import Image from "next/image";
import { createMenuItem, updateMenuItem } from "@/actions/menu/menu-items";
import { deleteFiles } from "@/actions/uploadthing";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/ui/submit-button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { MenuItemStatus } from "@/types/menu";
import { MenuItem } from "@/types/menu";
import { CreateMenuItemInput } from "@/actions/menu/menu-items";
import { FileUploader } from "@/components/file-uploader";

interface MenuItemForm {
   mode: "create" | "edit";
   menuItem?: MenuItem;
   categories: { id: string; name: string }[];
   trigger?: React.ReactNode;
}

export default function AddMenuItemForm({
   mode = "create",
   menuItem,
   categories,
   trigger,
}: MenuItemForm) {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [images, setImages] = useState<Array<{ key: string; ufsUrl: string }>>(
      [],
   );
   const [isPending, startTransition] = useTransition();
   const [isDeletePending, startDeleteTransition] = useTransition();
   const isEditMode = mode === "edit";

   const form = useForm<CreateMenuItemInput>({
      resolver: zodResolver(menuItemSchema),
      defaultValues: {
         name: "",
         nameEn: "",
         description: "",
         descriptionEn: "",
         price: 0,
         categoryId: "",
         status: MenuItemStatus.AVAILABLE,
         isActive: true,
         images: [],
      },
   });

   const onSubmit = async (values: CreateMenuItemInput) => {
      startTransition(async () => {
         if (mode === "edit" && menuItem) {
            const { data: result, error } = await tryCatch(
               updateMenuItem({ ...values, id: menuItem.id }),
            );

            if (error) {
               toast.error(error.message);
            }

            if (result?.success) {
               toast.success("Menu item updated successfully");
               form.reset();
               setImages([]);
               setIsOpen(false);
            } else if (result?.error) {
               toast.error(result.error);
            }
         } else {
            const { data: result, error } = await tryCatch(
               createMenuItem(values),
            );

            if (error) {
               toast.error(error.message);
            }

            if (result?.success) {
               toast.success("Menu item created successfully");
               form.reset();
               setImages([]);
               setIsOpen(false);
            } else if (result?.error) {
               toast.error(result.error);
            }
         }
      });
   };

   const handleDeleteImage = (imageKey: string) => {
      startDeleteTransition(async () => {
         const result = await deleteFiles(imageKey);
         if (result && "success" in result && result.success === true) {
            setImages((prev) => prev.filter((img) => img.key !== imageKey));
            const currentImages = form.getValues("images");
            form.setValue(
               "images",
               currentImages.filter((img) => img.key !== imageKey),
            );
            toast.success(result.message);
         } else {
            toast.error(
               (result && "message" in result && result.message) ||
                  "Failed to delete image",
            );
         }
      });
   };

   useEffect(() => {
      if (isOpen) {
         if (mode === "create") {
            form.reset({
               name: "",
               nameEn: "",
               description: "",
               descriptionEn: "",
               price: 0,
               categoryId: "",
               status: MenuItemStatus.AVAILABLE,
               isActive: true,
               images: [],
            });
            setImages([]);
         } else if (mode === "edit" && menuItem) {
            form.reset({
               name: menuItem.name,
               nameEn: menuItem.nameEn || "",
               description: menuItem.description || "",
               descriptionEn: menuItem.descriptionEn || "",
               price: menuItem.price,
               categoryId: menuItem.categoryId,
               status: menuItem.status as MenuItemStatus,
               isActive: menuItem.isActive,
               images: menuItem.images.map((img) => ({
                  key: img.key,
                  ufsUrl: img.ufsUrl,
               })),
            });
            setImages(
               menuItem.images.map((img) => ({
                  key: img.key,
                  ufsUrl: img.ufsUrl,
               })),
            );
         }
      }
   }, [isOpen, mode, menuItem, form]);

   return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            {trigger ||
               (mode === "create" ? (
                  <Button>
                     <Plus className="size-4" />
                     Add Menu Item
                  </Button>
               ) : (
                  <Button
                     variant="outline"
                     size="sm"
                     className="flex-1 gap-1 bg-transparent"
                  >
                     <Edit className="h-3 w-3" />
                     Edit
                  </Button>
               ))}
         </SheetTrigger>
         <SheetContent className="overflow-y-auto pb-4 sm:max-w-2xl">
            <SheetHeader>
               <SheetTitle>
                  {mode === "create" ? "Create Menu Item" : "Update Menu Item"}
               </SheetTitle>
               <SheetDescription>
                  {mode === "create"
                     ? "Add a new menu item to your restaurant's menu."
                     : "Update the details of an existing menu item."}
               </SheetDescription>
            </SheetHeader>
            <div className="px-4">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <FormField
                        name="images"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Images (max: 8)</FormLabel>
                              <FormControl>
                                 <div className="space-y-4">
                                    {images.length > 0 && (
                                       <div className="flex gap-4 overflow-x-auto pb-2">
                                          {images.map((image, index) => (
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

                                                {/* Overlay khi hover */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                   <Button
                                                      disabled={
                                                         isDeletePending ||
                                                         isPending
                                                      }
                                                      size="icon"
                                                      type="button"
                                                      onClick={() =>
                                                         handleDeleteImage(
                                                            image.key,
                                                         )
                                                      }
                                                      className="rounded-full bg-red-500 hover:bg-red-600"
                                                   >
                                                      {isDeletePending ? (
                                                         <Loader2 className="h-4 w-4 animate-spin text-white" />
                                                      ) : (
                                                         <X className="h-4 w-4 text-white" />
                                                      )}
                                                   </Button>
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    )}

                                    {images.length < 8 && (
                                       <FileUploader
                                          onUploadComplete={(uploadedFiles) => {
                                             if (
                                                uploadedFiles &&
                                                uploadedFiles.length > 0
                                             ) {
                                                const newImages =
                                                   uploadedFiles.map(
                                                      (file) => ({
                                                         key: file.key,
                                                         ufsUrl: file.url,
                                                      }),
                                                   );
                                                const currentImages =
                                                   form.getValues("images");
                                                const updatedImages = [
                                                   ...currentImages,
                                                   ...newImages,
                                                ];

                                                // Check max limit
                                                if (updatedImages.length > 8) {
                                                   toast.error(
                                                      "Maximum 8 images allowed",
                                                   );
                                                   return;
                                                }

                                                setImages((prev) => [
                                                   ...prev,
                                                   ...newImages,
                                                ]);
                                                field.onChange(updatedImages);
                                                toast.success(
                                                   "Image uploaded successfully",
                                                );
                                             }
                                          }}
                                          maxFiles={8 - images.length}
                                          accept={["image/*"]}
                                       />
                                    )}
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           name="name"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Name
                                    <span className="text-destructive">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Menu item name"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           name="nameEn"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>English Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="English name"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           name="description"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       rows={4}
                                       placeholder="Description"
                                       className="resize-none"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           name="descriptionEn"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>English Description</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       rows={4}
                                       placeholder="English description"
                                       className="resize-none"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           name="price"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Price
                                    <span className="text-destructive">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="Price"
                                       {...field}
                                       onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                       }
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                              name="categoryId"
                              control={form.control}
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>
                                       Category
                                       <span className="text-destructive">
                                          *
                                       </span>
                                    </FormLabel>
                                    <Select
                                       onValueChange={field.onChange}
                                       defaultValue={field.value}
                                    >
                                       <FormControl>
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          {categories.map((category) => (
                                             <SelectItem
                                                key={category.id}
                                                value={category.id}
                                             >
                                                {category.name}
                                             </SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              name="status"
                              control={form.control}
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                       onValueChange={field.onChange}
                                       defaultValue={field.value}
                                    >
                                       <FormControl>
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          <SelectItem
                                             value={MenuItemStatus.AVAILABLE}
                                          >
                                             Available
                                          </SelectItem>
                                          <SelectItem
                                             value={MenuItemStatus.UNAVAILABLE}
                                          >
                                             Unavailable
                                          </SelectItem>
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           name="isActive"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                 <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                       Active
                                    </FormLabel>
                                    <div className="text-muted-foreground text-sm">
                                       Make this menu item visible to customers
                                    </div>
                                 </div>
                                 <FormControl>
                                    <Switch
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     </div>

                     <SubmitButton
                        className="w-full"
                        type="submit"
                        isLoading={isPending}
                        loadingText={isEditMode ? "Updating..." : "Creating..."}
                     >
                        {isEditMode ? "Update Menu Item" : "Create Menu Item"}
                     </SubmitButton>
                  </form>
               </Form>
            </div>
         </SheetContent>
      </Sheet>
   );
}
