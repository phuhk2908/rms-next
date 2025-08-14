import { MenuItemStatus } from "@/types/menu";
import { z } from "zod";

export const menuItemSchema = z.object({
   name: z.string().min(1, "Menu item name is required"),
   nameEn: z.string().optional(),
   description: z.string().optional(),
   descriptionEn: z.string().optional(),
   price: z.number().min(1, "Price must be greater than 1"),
   categoryId: z.string().min(1, "Category is required"),
   status: z.nativeEnum(MenuItemStatus),
   isActive: z.boolean(),
   images: z
      .array(
         z.object({
            key: z.string(),
            ufsUrl: z.string().url(),
         }),
      )
      .max(8, "Maximum of 8 images allowed"),
});
