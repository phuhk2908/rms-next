import { z } from "zod";

export const menuCategorySchema = z.object({
   name: z.string().min(1, { message: "Name is required" }),
   nameEn: z.string().min(1, { message: "English name is required" }),
   description: z.string().min(1, { message: "Description is required" }),
   descriptionEn: z
      .string()
      .min(1, { message: "English description is required" }),
   image: z
      .object({
         key: z.string(),
         ufsUrl: z.string(),
      })
      .optional(),
   isActive: z.boolean(),
});

export type MenuItemFormValue = z.infer<typeof menuCategorySchema>;
