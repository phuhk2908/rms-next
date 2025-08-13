import { MenuItemStatus } from "@/types/menu";
import { z } from "zod";

export const menuItemSchema = z.object({
   name: z.string().min(1, "Tên món ăn là bắt buộc"),
   nameEn: z.string().optional(),
   description: z.string().optional(),
   descriptionEn: z.string().optional(),
   price: z.number().min(1000, "Giá phải lớn hơn 1000"),
   categoryId: z.string().min(1, "Danh mục là bắt buộc"),
   status: z.nativeEnum(MenuItemStatus),
   isActive: z.boolean(),
   images: z
      .array(
         z.object({
            key: z.string(),
            ufsUrl: z.string().url(),
         }),
      )
      .max(8, "Tối đa 8 ảnh"),
});
