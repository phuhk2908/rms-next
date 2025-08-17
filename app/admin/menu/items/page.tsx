import { getAllMenuItems, getMenuCategoriesForSelect } from "@/data/menu-item";
import { MenuItemsList } from "./_components/menu-items-list";
import { MenuItem } from "@/types/menu";
import AddMenuItemForm from "./_components/add-menu-item-form";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export default async function AdminMenuItemsPage() {
   const menuItems = await getAllMenuItems(true);

   const categories = await getMenuCategoriesForSelect();

   return (
      <Card>
         <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>
               Organize and manage your restaurant&apos;s menu items
            </CardDescription>
            <CardAction>
               <AddMenuItemForm mode="create" categories={categories} />
            </CardAction>
         </CardHeader>
         <CardContent>
            <MenuItemsList
               menuItems={menuItems as MenuItem[]}
               categories={categories}
            />
         </CardContent>
      </Card>
   );
}
