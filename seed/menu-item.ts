import { MenuItemStatus, PrismaClient, Status } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function seedMenuItem() {
   // Find existing categories
   const asianCategory = await prisma.menuCategory.findUnique({
      where: { slug: "asian-cuisine" },
   });

   const beverageCategory = await prisma.menuCategory.findUnique({
      where: { slug: "beverages" },
   });

   const dessertCategory = await prisma.menuCategory.findUnique({
      where: { slug: "desserts" },
   });

   if (!asianCategory || !beverageCategory || !dessertCategory) {
      console.error(
         "Categories not found. Please run menu-category seed first.",
      );
      return;
   }

   // Seed Menu Items
   await prisma.menuItem.createMany({
      data: [
         {
            name: "Beef Noodle Soup",
            nameEn: "Beef Noodle Soup",
            slug: "beef-noodle-soup",
            description:
               "Traditional beef noodle soup with rich broth and fresh beef",
            descriptionEn:
               "Traditional beef noodle soup with rich broth and fresh beef",
            price: 60000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: asianCategory.id,
         },
         {
            name: "Asian Sandwich",
            nameEn: "Asian Sandwich",
            slug: "asian-sandwich",
            description: "Asian sandwich with meat, pate, and fresh herbs",
            descriptionEn: "Asian sandwich with meat, pate, and fresh herbs",
            price: 25000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: asianCategory.id,
         },
         // Drinks
         {
            name: "Iced Coffee",
            nameEn: "Iced Coffee",
            slug: "iced-coffee",
            description: "Vietnamese drip coffee with condensed milk",
            descriptionEn: "Vietnamese drip coffee with condensed milk",
            price: 20000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: beverageCategory.id,
         },
         {
            name: "Lemon Tea",
            nameEn: "Lemon Tea",
            slug: "lemon-tea",
            description: "Refreshing iced lemon tea",
            descriptionEn: "Refreshing iced lemon tea",
            price: 15000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: beverageCategory.id,
         },
         // Desserts
         {
            name: "Three-Color Sweet Soup",
            nameEn: "Three-Color Sweet Soup",
            slug: "three-color-sweet-soup",
            description: "Sweet dessert with beans, jelly, and coconut milk",
            descriptionEn: "Sweet dessert with beans, jelly, and coconut milk",
            price: 25000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: dessertCategory.id,
         },
         {
            name: "Caramel Pudding",
            nameEn: "Caramel Pudding",
            slug: "caramel-pudding",
            description: "Soft caramel pudding",
            descriptionEn: "Soft caramel pudding",
            price: 20000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: dessertCategory.id,
         },
      ],
   });

   // Gán hình ảnh cho từng món
   const menuItems = await prisma.menuItem.findMany();
   for (const item of menuItems) {
      await prisma.image.create({
         data: {
            key: item.slug,
            ufsUrl: getItemImage(item.slug),
            menuItemId: item.id,
         },
      });
   }
}

// Helper: assign food images
function getItemImage(slug: string): string {
   const images: Record<string, string> = {
      "beef-noodle-soup":
         "https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGglRTElQkIlOUYlMjBiJUMzJUIyfGVufDB8fDB8fHww",
      "asian-sandwich":
         "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJlYWR8ZW58MHx8MHx8fDA%3D",
      "iced-coffee":
         "https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D",
      "lemon-tea":
         "https://plus.unsplash.com/premium_photo-1681997048580-3083c846bf09?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGVtb24lMjB0ZWF8ZW58MHx8MHx8fDA%3D",
      "three-color-sweet-soup":
         "https://plus.unsplash.com/premium_photo-1668143363479-b8cd08698c0d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3dlZXQlMjBzb3VwfGVufDB8fDB8fHww",
      "caramel-pudding":
         "https://images.unsplash.com/photo-1702728109878-c61a98d80491?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmxhbnxlbnwwfHwwfHx8MA%3D%3D",
   };
   return images[slug] || "https://placehold.co/600x400";
}

// For standalone execution
if (require.main === module) {
   seedMenuItem()
      .then(async () => {
         await prisma.$disconnect();
      })
      .catch(async (e) => {
         console.error(e);
         await prisma.$disconnect();
         process.exit(1);
      });
}
