import AddMenuCategoryForm from "./_components/add-menu-category-form";
import { getAllMenuCategories } from "@/data/menu-category";

export default async function AdminMenuCategoriesPage() {
   const data = await getAllMenuCategories();

   return (
      <div className="p-4 lg:p-6">
         <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="space-y-1">
               <h2>Menu Categories</h2>
               <p className="text-muted-foreground text-lg">
                  Organize and manage your restaurant's menu categories
               </p>
            </div>

            <AddMenuCategoryForm />
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item: any) => (
               <p key={item.id}>{item.name}</p>
            ))}
         </div>
      </div>
   );
}
