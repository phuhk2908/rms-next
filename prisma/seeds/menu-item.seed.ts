import { MenuItemStatus, PrismaClient, Status } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
   // Xóa dữ liệu cũ
   await prisma.menuItem.deleteMany();
   await prisma.menuCategory.deleteMany();

   // Tạo category
   const categories = await prisma.menuCategory.createMany({
      data: [
         {
            name: "Món Việt",
            nameEn: "Vietnamese Cuisine",
            slug: "vietnamese-cuisine",
            image: "https://images.unsplash.com/photo-1604909052743-1f2a097acaa1",
            description: "Các món ăn truyền thống Việt Nam",
            descriptionEn: "Traditional Vietnamese dishes",
         },
         {
            name: "Đồ uống",
            nameEn: "Beverages",
            slug: "beverages",
            image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
            description: "Các loại đồ uống giải khát",
            descriptionEn: "Refreshing beverages",
         },
         {
            name: "Món tráng miệng",
            nameEn: "Desserts",
            slug: "desserts",
            image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
            description: "Món ngọt ngon miệng",
            descriptionEn: "Sweet and tasty desserts",
         },
      ],
   });

   // Lấy lại id của categories
   const vietnameseCategory = await prisma.menuCategory.findUnique({
      where: { slug: "vietnamese-cuisine" },
   });
   const beverageCategory = await prisma.menuCategory.findUnique({
      where: { slug: "beverages" },
   });
   const dessertCategory = await prisma.menuCategory.findUnique({
      where: { slug: "desserts" },
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
            categoryId: vietnameseCategory!.id,
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
            categoryId: vietnameseCategory!.id,
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
            categoryId: beverageCategory!.id,
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
            categoryId: beverageCategory!.id,
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
            categoryId: dessertCategory!.id,
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
            categoryId: dessertCategory!.id,
         },
      ],
   });

   // Gán hình ảnh cho từng món
   const menuItems = await prisma.menuItem.findMany();
   for (const item of menuItems) {
      await prisma.image.create({
         data: {
            key: item.slug, // or generate a unique key if needed
            ufsUrl: getItemImage(item.slug),
            menuItemId: item.id,
         },
      });
   }

   console.log("✅ Seed menu categories & items thành công!");
}

// Helper: gán ảnh món ăn
function getItemImage(slug: string): string {
   const images: Record<string, string> = {
      "pho-bo": "https://images.unsplash.com/photo-1604908813112-6e9b3b8ef6ea",
      "banh-mi-thit":
         "https://images.unsplash.com/photo-1604908177522-cba2b4c2b5cc",
      "ca-phe-sua-da":
         "https://images.unsplash.com/photo-1512568400610-62da28bc8a13",
      "tra-chanh":
         "https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9",
      "che-ba-mau":
         "https://images.unsplash.com/photo-1627308595186-ea18f2f9b8c8",
      "banh-flan":
         "https://images.unsplash.com/photo-1625648831161-4d8ff5ea0ddc",
   };
   return images[slug] || "https://placehold.co/600x400";
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
