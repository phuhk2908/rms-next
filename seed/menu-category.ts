import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function seedMenuCategory() {
   const categories = [
      {
         name: "Đồ uống",
         nameEn: "Beverages",
         slug: "beverages",
         image: {
            create: {
               key: "beverages-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Beverages",
            },
         },
         description: "Các loại đồ uống giải khát",
         descriptionEn: "Various refreshing drinks",
      },
      {
         name: "Món khai vị",
         nameEn: "Appetizers",
         slug: "appetizers",
         image: {
            create: {
               key: "appetizers-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Appetizers",
            },
         },
         description: "Món khai vị ngon miệng",
         descriptionEn: "Delicious starters",
      },
      {
         name: "Món chính",
         nameEn: "Main Dishes",
         slug: "main-dishes",
         image: {
            create: {
               key: "main-dishes-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Main+Dishes",
            },
         },
         description: "Các món ăn chính hấp dẫn",
         descriptionEn: "Tasty main courses",
      },
   ];

   // Tạo dữ liệu
   for (const category of categories) {
      await prisma.menuCategory.create({
         data: {
            name: category.name,
            nameEn: category.nameEn,
            slug: category.slug,
            description: category.description,
            descriptionEn: category.descriptionEn,
            image: {
               create: {
                  key: category.image.create.key,
                  ufsUrl: category.image.create.ufsUrl,
               },
            },
         },
      });
   }
}
