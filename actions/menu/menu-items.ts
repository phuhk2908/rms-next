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
   id: z.string().min(1, "ID is required"),
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
         throw new Error("A menu item with this name already exists");
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
               : "An error occurred while creating the menu item",
      };
   }
};

export const updateMenuItem = async (data: UpdateMenuItemInput) => {
   try {
      await requireAdmin();

      const validatedData = updateMenuItemSchema.parse(data);
      const { id, images, ...updateData } = validatedData;

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
         include: { images: true },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
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
            throw new Error("A menu item with this name already exists");
         }
      }

      // Handle image updates separately
      if (images && Array.isArray(images)) {
         // Delete existing images first
         await prisma.image.deleteMany({
            where: { menuItemId: id },
         });

         // Create new images
         if (images.length > 0) {
            await prisma.image.createMany({
               data: images.map((file) => ({
                  key: file.key,
                  ufsUrl: file.ufsUrl,
                  menuItemId: id,
               })),
            });
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
               : "An error occurred while updating the menu item",
      };
   }
};

// Soft delete menu item
export const deleteMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("Menu item ID is required");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
      }

      await prisma.menuItem.update({
         where: { id },
         data: {
            deletedAt: new Date(),
            isActive: false,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Menu item deleted successfully" };
   } catch (error) {
      console.error("Error deleting menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while deleting the menu item",
      };
   }
};

// Hard delete menu item
export const hardDeleteMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("Menu item ID is required");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
         include: {
            images: true,
         },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
      }

      // Delete image files from UploadThing
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
      return { success: true, message: "Menu item permanently deleted" };
   } catch (error) {
      console.error("Error hard deleting menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while permanently deleting the menu item",
      };
   }
};

// Restore menu item
export const restoreMenuItem = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("Menu item ID is required");
      }

      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
      }

      await prisma.menuItem.update({
         where: { id },
         data: {
            deletedAt: null,
            isActive: true,
         },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Menu item restored successfully" };
   } catch (error) {
      console.error("Error restoring menu item:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while restoring the menu item",
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
         throw new Error("Menu item ID is required");
      }

      // Check if menu item exists
      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
      }

      // Update status
      await prisma.menuItem.update({
         where: { id },
         data: { status },
      });

      revalidatePath("/admin/menu/items");
      return { success: true, message: "Status updated successfully" };
   } catch (error) {
      console.error("Error updating menu item status:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while updating the status",
      };
   }
};

// Toggle active status
export const toggleMenuItemActive = async (id: string) => {
   try {
      await requireAdmin();

      if (!id) {
         throw new Error("Menu item ID is required");
      }

      // Check if menu item exists
      const existingItem = await prisma.menuItem.findUnique({
         where: { id },
      });

      if (!existingItem) {
         throw new Error("Menu item not found");
      }

      // Toggle active status
      await prisma.menuItem.update({
         where: { id },
         data: { isActive: !existingItem.isActive },
      });

      revalidatePath("/admin/menu/items");
      return {
         success: true,
         message: "Display status updated successfully",
      };
   } catch (error) {
      console.error("Error toggling menu item active:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while updating the display status",
      };
   }
};

// Bulk update
export const bulkUpdateMenuItems = async (
   ids: string[],
   updates: Partial<CreateMenuItemInput>,
) => {
   try {
      await requireAdmin();

      if (!ids.length) {
         throw new Error("No menu items selected");
      }

      // Bulk update
      await prisma.menuItem.updateMany({
         where: {
            id: { in: ids },
         },
         data: updates,
      });

      revalidatePath("/admin/menu/items");
      return {
         success: true,
         message: `Successfully updated ${ids.length} menu items`,
      };
   } catch (error) {
      console.error("Error bulk updating menu items:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while bulk updating menu items",
      };
   }
};

// Bulk delete (soft delete)
export const bulkDeleteMenuItems = async (ids: string[]) => {
   try {
      await requireAdmin();

      if (!ids.length) {
         throw new Error("No menu items selected");
      }

      // Bulk soft delete
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
         message: `Successfully deleted ${ids.length} menu items`,
      };
   } catch (error) {
      console.error("Error bulk deleting menu items:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "An error occurred while bulk deleting menu items",
      };
   }
};
