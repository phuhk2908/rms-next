// prisma/seed.ts

import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
   // Xóa dữ liệu cũ nếu cần
   await prisma.menuCategory.deleteMany();

   // Dữ liệu mẫu
   const categories = [
      {
         name: "Đồ uống",
         nameEn: "Beverages",
         slug: "beverages",
         image: "https://placehold.co/600x400/png?text=Beverages",
         description: "Các loại đồ uống giải khát",
         descriptionEn: "Various refreshing drinks",
      },
      {
         name: "Món khai vị",
         nameEn: "Appetizers",
         slug: "appetizers",
         image: "https://placehold.co/600x400/png?text=Appetizers",
         description: "Món khai vị ngon miệng",
         descriptionEn: "Delicious starters",
      },
      {
         name: "Món chính",
         nameEn: "Main Dishes",
         slug: "main-dishes",
         image: "https://placehold.co/600x400/png?text=Main+Dishes",
         description: "Các món ăn chính hấp dẫn",
         descriptionEn: "Tasty main courses",
      },
   ];

   // Tạo dữ liệu
   for (const category of categories) {
      await prisma.menuCategory.create({
         data: category,
      });
   }

   console.log("✅ Seed menu categories thành công!");
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
