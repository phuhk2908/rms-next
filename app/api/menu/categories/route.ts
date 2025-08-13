import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slugify";
import { menuCategorySchema } from "@/schemas/menu";
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

      const { image, ...rest } = validation.data;

      await prisma.menuCategory.create({
         data: {
            ...rest,
            ...(image && {
               image: {
                  create: {
                     key: image.key,
                     ufsUrl: image.ufsUrl,
                  },
               },
            }),
            slug: toSlug(validation.data.name),
         },
      });

      revalidatePath("/admin/menu/categories");

      return NextResponse.json({
         status: "success",
         message: "Create menu category successfully",
      });
   } catch (error) {
      if (error instanceof Error) {
         return NextResponse.json({
            status: "error",
            error: error.message,
            message: "Failed to create menu category",
         });
      }
   }
}
