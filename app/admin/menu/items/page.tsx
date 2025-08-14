import { getAllMenuItems, getMenuCategoriesForSelect } from "@/data/menu-item";
import { MenuItemsList } from "./_components/menu-items-list";
import { MenuItem } from "@/types/menu";
import AddMenuItemForm from "./_components/add-menu-item-form";

export default async function AdminMenuItemsPage() {
   const menuItems = await getAllMenuItems(true);
   console.log(menuItems);
   
   const categories = await getMenuCategoriesForSelect();

   return (
      <div className="p-4 lg:p-6">
         <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="space-y-1">
               <h2>Menu Items</h2>
               <p className="text-muted-foreground text-lg">
                  Organize and manage your restaurant&apos;s menu items
               </p>
            </div>

            <AddMenuItemForm mode="create" categories={categories} />
         </div>

         <div className="mt-8">
            <MenuItemsList
               menuItems={menuItems as MenuItem[]}
               categories={categories}
            />
         </div>
      </div>
   );
}
