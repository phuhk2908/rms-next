import z from "zod";

export const menuCategorySchema = z.object({
   name: z.string().min(1, { message: "Name is required" }),
   nameEn: z.string().min(1, { message: "English name is required" }),
   image: z.string().min(1, { message: "Image url is required" }),
});

export type MenuItemFormValue = z.infer<typeof menuCategorySchema>;
