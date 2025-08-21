import { PrismaClient } from "@/lib/generated/prisma";
import { toSlug } from "@/lib/slugify";

const prisma = new PrismaClient();

export async function seedRecipe() {
   const slug = toSlug("Beef and Onion Stir Fry");

   // Check if recipe already exists
   const existingRecipe = await prisma.recipe.findUnique({
      where: { slug },
   });

   if (existingRecipe) {
      console.log("Sample recipe already exists:", existingRecipe.name);
      return;
   }

   // Create a sample recipe with instructions
   const sampleRecipe = await prisma.recipe.create({
      data: {
         name: "Beef and Onion Stir Fry",
         description: "Delicious and nutritious traditional stir-fried dish",
         instructions: `1. Slice beef thinly against the grain
                        2. Marinate beef with salt, pepper, minced garlic, and oil for 15 minutes
                        3. Cut onion into medium-sized slices
                        4. Heat oil in a pan, add beef and stir-fry on high heat
                        5. When beef is about 70% cooked, add onions and stir-fry together
                        6. Season to taste
                        7. Stir-fry for another 2-3 minutes until beef and onions are evenly cooked
                        8. Turn off heat and serve on a plate, garnish with green onions`,
         slug: slug,
         estimatedCost: 50000,
         preparationTime: 20,
         servingSize: 2,
         ingredients: {
            create: [
               {
                  quantity: 300,
                  ingredient: {
                     connect: {
                        slug: toSlug("Beef"),
                     },
                  },
               },
               {
                  quantity: 1,
                  ingredient: {
                     connect: {
                        slug: toSlug("Onion"),
                     },
                  },
               },
               {
                  quantity: 5,
                  ingredient: {
                     connect: {
                        slug: toSlug("Salt"),
                     },
                  },
               },
            ],
         },
      },
   });

   console.log("Created sample recipe:", sampleRecipe.name);
}
