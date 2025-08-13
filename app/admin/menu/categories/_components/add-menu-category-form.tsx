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
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { Edit, Plus } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createMenuCategory, updateMenuCategory } from "@/actions/menu";
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
import { FileUploader } from "@/components/file-uploader";
import Image from "next/image";
import { MenuCategory } from "@/types/menu";

interface MenuCategoryForm {
   mode: "create" | "edit";
   menuCategory?: MenuCategory;
}

export default function AddMenuCategoryForm({
   mode = "create",
   menuCategory,
}: MenuCategoryForm) {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [isPending, startTransition] = useTransition();
   const isEditMode = mode === "edit";

   const form = useForm<MenuItemFormValue>({
      resolver: zodResolver(menuCategorySchema),
      defaultValues: {
         name: "",
         nameEn: "",
         description: "",
         descriptionEn: "",
         image: undefined,
         isActive: true,
      },
   });

   const onSubmit = async (values: MenuItemFormValue) => {
      startTransition(async () => {
         const action =
            mode === "edit" && menuCategory
               ? updateMenuCategory(menuCategory.id, values)
               : createMenuCategory(values);
         const { data, error } = await action;

         if (error) {
            toast.error(error.message);
            return;
         }

         if (data?.status === "success") {
            toast.success(data.message);
            form.reset();
            setIsOpen(false);
         } else if (data?.status === "error") {
            toast.error(data.message);
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
               image: undefined,
               isActive: true,
            });
         } else if (mode === "edit" && menuCategory) {
            form.reset({
               name: menuCategory.name,
               nameEn: menuCategory.nameEn || "",
               description: menuCategory.description || "",
               descriptionEn: menuCategory.descriptionEn || "",
               isActive: menuCategory.isActive,
               image: menuCategory.image || { key: "", ufsUrl: "" },
            });
         }
      }
   }, [isOpen, mode, menuCategory, form]);

   const currentImage = form.watch("image");

   return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            {mode === "create" ? (
               <Button>
                  <Plus className="size-4" />
                  Add Category
               </Button>
            ) : (
               <Button>
                  <Edit className="size-4" />
                  Edit
               </Button>
            )}
         </SheetTrigger>
         <SheetContent className="sm:max-w-xl">
            <SheetHeader>
               <SheetTitle>
                  {mode === "create" ? "Create Category" : "Update Category"}
               </SheetTitle>
               <SheetDescription>
                  {mode === "create"
                     ? "Add a new menu category to your restaurant's menu."
                     : "Update the details of an existing menu category."}
               </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Thumbnail</FormLabel>
                              <FormControl>
                                 <div>
                                    {currentImage?.ufsUrl && (
                                       <div className="relative h-48 w-full">
                                          <Image
                                             src={currentImage.ufsUrl}
                                             alt="Current image"
                                             fill
                                             className="rounded-md object-cover"
                                          />
                                       </div>
                                    )}
                                    <FileUploader
                                       onUploadComplete={(uploadedFiles) => {
                                          if (
                                             uploadedFiles &&
                                             uploadedFiles.length > 0
                                          ) {
                                             const file = uploadedFiles[0];
                                             field.onChange({
                                                key: file.key,
                                                ufsUrl: file.url,
                                             });
                                             toast.success(
                                                "Image uploaded successfully",
                                             );
                                          }
                                       }}
                                       maxFiles={1}
                                       accept={["image/*"]}
                                    />
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
                                 <FormLabel>Name</FormLabel>
                                 <FormControl>
                                    <Input placeholder="Name" {...field} />
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

                        <FormField
                           name="description"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       rows={10}
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
                                       rows={10}
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

                     <FormField
                        name="isActive"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem className="">
                              <FormLabel>Active</FormLabel>
                              <FormControl>
                                 <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <SubmitButton
                        className="w-full"
                        type="submit"
                        isLoading={isPending}
                        loadingText={isEditMode ? "Updating..." : "Creating..."}
                     >
                        {isEditMode ? "Update" : "Create"}
                     </SubmitButton>
                  </form>
               </Form>
            </div>
         </SheetContent>
      </Sheet>
   );
}
