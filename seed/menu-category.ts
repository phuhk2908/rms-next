import { PrismaClient } from "@/lib/generated/prisma";
import { toSlug } from "@/lib/slugify";

const prisma = new PrismaClient();

export async function seedMenuCategory() {
   const categories = [
      {
         name: "Beverages",
         nameEn: "Beverages",
         slug: "beverages",
         image: {
            create: {
               key: "beverages-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Beverages",
            },
         },
         description: "Various refreshing drinks",
         descriptionEn: "Various refreshing drinks",
      },
      {
         name: "Appetizers",
         nameEn: "Appetizers",
         slug: "appetizers",
         image: {
            create: {
               key: "appetizers-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Appetizers",
            },
         },
         description: "Delicious starters",
         descriptionEn: "Delicious starters",
      },
      {
         name: "Main Dishes",
         nameEn: "Main Dishes",
         slug: "main-dishes",
         image: {
            create: {
               key: "main-dishes-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Main+Dishes",
            },
         },
         description: "Tasty main courses",
         descriptionEn: "Tasty main courses",
      },
      {
         name: "Asian Cuisine",
         nameEn: "Asian Cuisine",
         slug: "asian-cuisine",
         image: {
            create: {
               key: "asian-cuisine-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Asian+Cuisine",
            },
         },
         description: "Traditional Asian dishes",
         descriptionEn: "Traditional Asian dishes",
      },
      {
         name: "Desserts",
         nameEn: "Desserts",
         slug: "desserts",
         image: {
            create: {
               key: "desserts-image",
               ufsUrl: "https://placehold.co/600x400/png?text=Desserts",
            },
         },
         description: "Sweet desserts",
         descriptionEn: "Sweet desserts",
      },
   ];

   // Create data using upsert to avoid duplicates
   for (const category of categories) {
      await prisma.menuCategory.upsert({
         where: { slug: toSlug(category.name) },
         update: {
            name: category.name,
            nameEn: category.nameEn,
            description: category.description,
            descriptionEn: category.descriptionEn,
         },
         create: {
            name: category.name,
            nameEn: category.nameEn,
            slug: toSlug(category.name),
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

// For standalone execution
if (require.main === module) {
   seedMenuCategory()
      .then(async () => {
         await prisma.$disconnect();
      })
      .catch(async (e) => {
         console.error(e);
         await prisma.$disconnect();
         process.exit(1);
      });
}
