"use client";

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
import { menuCategorySchema, MenuItemFormValue } from "@/schemas/menu";
import { Loader2, Plus, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/helpers/try-catch";
import { toast } from "sonner";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { createMenuCategory } from "@/actions/menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { deleteFiles } from "@/actions/uploadthing";
import { file } from "zod";

export default function AddMenuCategoryForm() {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [image, setImage] = useState<any | null>(null);
   const [isPending, startTransition] = useTransition();
   const [isDeletePending, startDeleteTransition] = useTransition();
   const form = useForm<MenuItemFormValue>({
      resolver: zodResolver(menuCategorySchema),
      defaultValues: {
         name: "",
         nameEn: "",
         image: "",
      },
   });

   const onSubmit = async (values: MenuItemFormValue) => {
      startTransition(async () => {
         const { data: result, error } = await tryCatch(
            createMenuCategory(values),
         );

         if (error) {
            toast.error(error.message);
         }

         if (result?.status === "success") {
            toast.success(result.message);
            form.reset();
            setIsOpen(false);
         } else if (result?.status === "error") {
            toast.error(result.message);
         }
      });
   };

   const handleDelete = () => {
      startDeleteTransition(async () => {
         const result = await deleteFiles(image.key);
         if (result?.success === true) {
            setImage(null);
            toast.success(result.message);
         } else {
            toast.error(result?.message || "Failed to delete image");
         }
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus className="size-4" />
               Add Category
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add new category</DialogTitle>
               <DialogDescription>
                  Enter a name and details to create a new menu category.
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     name="image"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Thumbnail</FormLabel>
                           <FormControl>
                              {image ? (
                                 <div className="bg-muted-foreground relative h-[300px] w-full overflow-hidden rounded-lg">
                                    <Image
                                       src={image.ufsUrl}
                                       alt="Preview"
                                       fill
                                       sizes="auto"
                                       className="object-contain"
                                    />
                                    <Button
                                       disabled={isDeletePending}
                                       className="hover:bg-destructive group absolute top-3 right-3 transition-colors"
                                       size="icon"
                                       type="button"
                                       onClick={handleDelete}
                                    >
                                       {isDeletePending ? (
                                          <Loader2 className="text-destructive size-4 animate-spin" />
                                       ) : (
                                          <X className="text-destructive size-4 group-hover:text-white" />
                                       )}
                                    </Button>
                                 </div>
                              ) : (
                                 <UploadDropzone
                                    endpoint="menuCategory"
                                    onClientUploadComplete={(res) => {
                                       if (res) {
                                          field.onChange(res[0].key);
                                          setImage(res[0]);
                                       }
                                       toast.success("Upload Completed");
                                    }}
                                    onUploadError={(error: Error) => {
                                       toast.error(`ERROR! ${error.message}`);
                                    }}
                                    config={{ cn: twMerge }}
                                    className={cn(
                                       "ut-button:bg-primary ut-button:ut-readying:bg-primary/25 ut-button:text-black",
                                       "ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary",
                                       "ut-label:text-primary ut-allowed-content:text-muted-foreground",
                                       "ut-upload-icon:text-muted-foreground border-muted-foreground/25 border-dashed",
                                       "hover:border-muted-foreground/50 rounded-lg p-8 transition-colors",
                                       "bg-background hover:bg-muted/25",
                                    )}
                                 />
                              )}
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
                                 <Input placeholder="English name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <DialogFooter>
                     <Button type="submit" disabled={isPending}>
                        {isPending ? (
                           <>
                              <Loader2 className="size-4 animate-spin" />
                              Creating...
                           </>
                        ) : (
                           <>Create</>
                        )}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
