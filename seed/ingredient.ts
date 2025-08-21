import { PrismaClient, IngredientUnit } from "@/lib/generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function seedIngredient() {
   const ingredients: Array<{
      name: string;
      code: string;
      unit: IngredientUnit;
      image: {
         url: string;
         alt: string;
      };
   }> = [
      {
         name: "Tomato",
         code: "ING001",
         unit: IngredientUnit.KG,
         image: {
            url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
            alt: "Tomato",
         },
      },
      {
         name: "Onion",
         code: "ING002",
         unit: IngredientUnit.KG,
         image: {
            url: "https://images.unsplash.com/photo-1604908177522-040b4f4f7f25",
            alt: "Onion",
         },
      },
      {
         name: "Beef",
         code: "ING003",
         unit: IngredientUnit.KG,
         image: {
            url: "https://images.unsplash.com/photo-1604908810540-6f6c8a49963a",
            alt: "Beef",
         },
      },
      {
         name: "Salmon",
         code: "ING004",
         unit: IngredientUnit.KG,
         image: {
            url: "https://images.unsplash.com/photo-1603048293569-f5c672b2a5c8",
            alt: "Salmon",
         },
      },
      {
         name: "Salt",
         code: "ING005",
         unit: IngredientUnit.GRAM,
         image: {
            url: "https://images.unsplash.com/photo-1606788075761-9d5f0f3b6f53",
            alt: "Salt",
         },
      },
   ];

   for (const ing of ingredients) {
      const slug = slugify(ing.name, { lower: true });

      const existingIngredient = await prisma.ingredient.findUnique({
         where: { slug },
      });

      if (!existingIngredient) {
         await prisma.ingredient.create({
            data: {
               slug,
               name: ing.name,
               code: ing.code,
               unit: ing.unit,
               image: {
                  create: {
                     ufsUrl: ing.image.url,
                     key: ing.image.alt,
                  },
               },
            },
         });
         console.log(`Created ingredient: ${ing.name}`);
      } else {
         console.log(`Ingredient already exists: ${ing.name}`);
      }
   }
}

// For standalone execution
if (require.main === module) {
   seedIngredient()
      .then(async () => {
         await prisma.$disconnect();
      })
      .catch(async (e) => {
         console.error(e);
         await prisma.$disconnect();
         process.exit(1);
      });
}
