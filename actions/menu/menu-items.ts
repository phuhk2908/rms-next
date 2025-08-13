"use server";

import { requireAdmin } from "@/data/require-admin";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MenuItemStatus } from "@/types/menu";
import { menuItemSchema } from "@/schemas/menu/menu-item";
import { deleteFiles } from "@/actions/uploadthing";

const updateMenuItemSchema = menuItemSchema.partial().extend({
   id: z.string().min(1, "ID là bắt buộc"),
});

export type CreateMenuItemInput = z.infer<typeof menuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

export const createMenuItem = async (data: CreateMenuItemInput) => {
   try {
      await requireAdmin();

      const validatedData = menuItemSchema.parse(data);

      const {
         name,
         nameEn,
         description,
         descriptionEn,
         price,
         categoryId,
         status,
         isActive,
         images,
      } = validatedData;

      const slug = toSlug(name);

      const existingItem = await prisma.menuItem.findUnique({
         where: { slug },
      });

      if (existingItem) {
         throw new Error("Món ăn với tên này đã tồn tại");
      }

      const menuItem = await prisma.menuItem.create({
         data: {
            name,
            nameEn,
            slug,
            description,
            descriptionEn,
            price,
            categoryId,
            status,
            isActive,
            images:
               Array.isArray(images) && images.length > 0
                  ? {
                       create: images.map((file) => ({
                          key: file.key,
                          ufsUrl: file.ufsUrl,
                       })),
                    }
                  : undefined,
         },
         include: {
            category: true,
            images: true,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, data: menuItem };
   } catch (error) {
      console.error("Error creating menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi tạo món ăn",
      };
   }
};

export const updateMenuItem = async (data: UpdateMenuItemInput) => {
   try {
      await requireAdmin();

      const validatedData = updateMenuItemSchema.parse(data);
      const { id, ...updateData } = validatedData;

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      let slug = existingItem.slug;
      if (updateData.name && updateData.name !== existingItem.name) {
         slug = toSlug(updateData.name);

         const slugExists = await prisma.menuItem.findFirst({
            where: {
               slug,
               id: { not: id },
            },
         });

         if (slugExists) {
            throw new Error("Món ăn với tên này đã tồn tại");
         }
      }

      const { categoryId, ...restUpdateData } = updateData;
      const updatePayload: any = {
         ...restUpdateData,
         slug,
      };
      if (typeof categoryId !== "undefined") {
         updatePayload.categoryId = categoryId;
      }
      const updatedItem = await prisma.menuItem.update({
         where: { id },
         data: updatePayload,
         include: {
            category: true,
            images: true,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, data: updatedItem };
   } catch (error) {
      console.error("Error updating menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi cập nhật món ăn",
      };
   }
};

// Xóa món ăn (soft delete)
export const deleteMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("ID món ăn là bắt buộc");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      await prisma.menuItem.update({
         where: { id },
         data: {
            deletedAt: new Date(),
            isActive: false,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Đã xóa món ăn thành công" };
   } catch (error) {
      console.error("Error deleting menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi xóa món ăn",
      };
   }
};

// Xóa món ăn vĩnh viễn (hard delete)
export const hardDeleteMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("ID món ăn là bắt buộc");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
         include: {
            images: true,
         },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      // Xóa các file ảnh từ UploadThing
      if (existingItem.images && existingItem.images.length > 0) {
         const imageKeys = existingItem.images.map((img) => img.key);
         try {
            await deleteFiles(imageKeys);
         } catch (imageError) {
            console.error("Error deleting images:", imageError);
         }
      }

      await prisma.menuItem.delete({
         where: { id },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Đã xóa vĩnh viễn món ăn thành công" };
   } catch (error) {
      console.error("Error hard deleting menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi xóa vĩnh viễn món ăn",
      };
   }
};

// Khôi phục món ăn
export const restoreMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("ID món ăn là bắt buộc");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      await prisma.menuItem.update({
         where: { id },
         data: {
            deletedAt: null,
            isActive: true,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Đã khôi phục món ăn thành công" };
   } catch (error) {
      console.error("Error restoring menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi khôi phục món ăn",
      };
   }
};

export const updateMenuItemStatus = async (
   id: string,
   status: MenuItemStatus,
) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("ID món ăn là bắt buộc");
      }

      // Kiểm tra món ăn có tồn tại không
      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      // Cập nhật trạng thái
      await prisma.menuItem.update({
         where: { id },
         data: { status },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Đã cập nhật trạng thái thành công" };
   } catch (error) {
      console.error("Error updating menu item status:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi cập nhật trạng thái",
      };
   }
};

// Toggle active status
export const toggleMenuItemActive = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("ID món ăn là bắt buộc");
      }

      // Kiểm tra món ăn có tồn tại không
      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Không tìm thấy món ăn");
      }

      // Toggle active status
      await prisma.menuItem.update({
         where: { id },
         data: { isActive: !existingItem.isActive },
      });

      revalidatePath("/admin/menu/items");
      return {
         success: true,
         message: "Đã cập nhật trạng thái hiển thị thành công",
      };
   } catch (error) {
      console.error("Error toggling menu item active:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi cập nhật trạng thái hiển thị",
      };
   }
};

// Bulk operations
export const bulkUpdateMenuItems = async (
   ids: string[],
   updates: Partial<CreateMenuItemInput>,
) => {
   try {
      await requireAdmin();

      if (!ids.length) {
         throw new Error("Không có món ăn nào được chọn");
      }

      // Cập nhật hàng loạt
      await prisma.menuItem.updateMany({
         where: {
            id: { in: ids },
         },
         data: updates,
      });

      revalidatePath("/admin/menu/items");
      return {
         success: true,
         message: `Đã cập nhật ${ids.length} món ăn thành công`,
      };
   } catch (error) {
      console.error("Error bulk updating menu items:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi cập nhật hàng loạt",
      };
   }
};

// Bulk delete
export const bulkDeleteMenuItems = async (ids: string[]) => {
   try {
      await requireAdmin();

      if (!ids.length) {
         throw new Error("Không có món ăn nào được chọn");
      }

      // Soft delete hàng loạt
      await prisma.menuItem.updateMany({
         where: {
            id: { in: ids },
         },
         data: {
            deletedAt: new Date(),
            isActive: false,
         },
      });

      revalidatePath("/admin/menu/items");
      return {
         success: true,
         message: `Đã xóa ${ids.length} món ăn thành công`,
      };
   } catch (error) {
      console.error("Error bulk deleting menu items:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Có lỗi xảy ra khi xóa hàng loạt",
      };
   }
};
