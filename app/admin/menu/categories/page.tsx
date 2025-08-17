import AddMenuCategoryForm from "./_components/add-menu-category-form";
import { getAllMenuCategories } from "@/data/menu-category";
import { MenuCategoryCard } from "./_components/menu-category-card";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { MenuItem } from "@/types/menu";
import AddMenuItemForm from "../items/_components/add-menu-item-form";
import { MenuItemsList } from "../items/_components/menu-items-list";

export default async function AdminMenuCategoriesPage() {
   const data = await getAllMenuCategories();

   console.log(data);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Menu Categories</CardTitle>
            <CardDescription>
               Organize and manage your restaurant&apos;s menu categories
            </CardDescription>
            <CardAction>
               <AddMenuCategoryForm mode="create" />
            </CardAction>
         </CardHeader>
         <CardContent>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {data.map((item) => (
                  <MenuCategoryCard key={item.id} menuCategory={item} />
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
