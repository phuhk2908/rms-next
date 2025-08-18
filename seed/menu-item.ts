import { MenuItemStatus, PrismaClient, Status } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function seedMenuItem() {
   const categories = [
      {
         name: "Món Việt Nam",
         nameEn: "Vietnamese Cuisine",
         slug: "vietnamese-cuisine",
         description: "Các món ăn truyền thống Việt Nam",
         descriptionEn: "Traditional Vietnamese dishes",
      },
      {
         name: "Đồ uống",
         nameEn: "Beverages",
         slug: "beverages",
         description: "Các loại đồ uống giải khát",
         descriptionEn: "Various refreshing drinks",
      },
      {
         name: "Tráng miệng",
         nameEn: "Desserts",
         slug: "desserts",
         description: "Các món tráng miệng ngọt ngào",
         descriptionEn: "Sweet desserts",
      },
   ];

   // Create or find categories
   const vietnameseCategory = await prisma.menuCategory.upsert({
      where: { slug: "vietnamese-cuisine" },
      update: {},
      create: categories[0],
   });

   const beverageCategory = await prisma.menuCategory.upsert({
      where: { slug: "beverages" },
      update: {},
      create: categories[1],
   });

   const dessertCategory = await prisma.menuCategory.upsert({
      where: { slug: "desserts" },
      update: {},
      create: categories[2],
   });

   // Seed Menu Items
   await prisma.menuItem.createMany({
      data: [
         // Vietnamese dishes
         {
            name: "Phở Bò",
            nameEn: "Beef Pho",
            slug: "pho-bo",
            description:
               "Phở bò truyền thống với nước dùng đậm đà và thịt bò tươi",
            descriptionEn:
               "Traditional beef pho with rich broth and fresh beef",
            price: 60000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: vietnameseCategory.id,
         },
         {
            name: "Bánh Mì Thịt",
            nameEn: "Vietnamese Baguette",
            slug: "banh-mi-thit",
            description: "Bánh mì kẹp thịt, pate và rau thơm",
            descriptionEn:
               "Vietnamese baguette with meat, pate, and fresh herbs",
            price: 25000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: vietnameseCategory.id,
         },
         // Drinks
         {
            name: "Cà Phê Sữa Đá",
            nameEn: "Vietnamese Iced Coffee",
            slug: "ca-phe-sua-da",
            description: "Cà phê rang xay pha phin với sữa đặc",
            descriptionEn: "Vietnamese drip coffee with condensed milk",
            price: 20000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: beverageCategory.id,
         },
         {
            name: "Trà Chanh",
            nameEn: "Lemon Tea",
            slug: "tra-chanh",
            description: "Trà chanh mát lạnh giải nhiệt",
            descriptionEn: "Refreshing iced lemon tea",
            price: 15000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: beverageCategory.id,
         },
         // Desserts
         {
            name: "Chè Ba Màu",
            nameEn: "Three-Color Sweet Soup",
            slug: "che-ba-mau",
            description: "Chè ngọt gồm đậu, thạch và nước cốt dừa",
            descriptionEn: "Sweet dessert with beans, jelly, and coconut milk",
            price: 25000,
            status: MenuItemStatus.AVAILABLE,
            recordStatus: Status.ACTIVE,
            isActive: true,
            categoryId: dessertCategory.id,
         },
         {
            name: "Bánh Flan",
            nameEn: "Caramel Pudding",
            slug: "banh-flan",
            description: "Bánh flan mềm mịn phủ caramel",
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

// Helper: gán ảnh món ăn
function getItemImage(slug: string): string {
   const images: Record<string, string> = {
      "pho-bo":
         "https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGglRTElQkIlOUYlMjBiJUMzJUIyfGVufDB8fDB8fHww",
      "banh-mi-thit":
         "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJlYWR8ZW58MHx8MHx8fDA%3D",
      "ca-phe-sua-da":
         "https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D",
      "tra-chanh":
         "https://plus.unsplash.com/premium_photo-1681997048580-3083c846bf09?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGVtb24lMjB0ZWF8ZW58MHx8MHx8fDA%3D",
      "che-ba-mau":
         "https://plus.unsplash.com/premium_photo-1668143363479-b8cd08698c0d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3dlZXQlMjBzb3VwfGVufDB8fDB8fHww",
      "banh-flan":
         "https://images.unsplash.com/photo-1702728109878-c61a98d80491?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmxhbnxlbnwwfHwwfHx8MA%3D%3D",
   };
   return images[slug] || "https://placehold.co/600x400";
}
