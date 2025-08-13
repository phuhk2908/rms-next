import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { ApiResponse } from "@/lib/types";
import { menuCategorySchema } from "@/schemas/menu/menu-category";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();

      const validation = menuCategorySchema.safeParse(body);

      if (!validation.success) {
         return NextResponse.json({
            status: "error",
            error: validation.error,
            message: "Failed to create menu category",
         });
      }

      await prisma.menuCategory.create({
         data: {
            ...validation.data,
            slug: toSlug(validation.data.name),
         },
      });

      revalidatePath("/admin/menu/categories");

      return NextResponse.json({
         status: "success",
         message: "Create menu category successfully",
      });
   } catch (error: any) {
      return NextResponse.json({
         status: "error",
         error: error.message,
         message: "Failed to create menu category",
      });
   }
}
