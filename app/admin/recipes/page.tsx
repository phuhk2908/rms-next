import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
// import { mockRecipes, mockMenuItems } from "@/lib/mock-data";
import { RecipeCard } from "./_components/recipe-card";
import { RecipeDetailModal } from "./_components/recipe-detail-modal";
import { getAllMenuItems } from "@/data/menu-item";
import { RecipeFormSheet } from "./_components/recipe-form";
import { getAllRecipes } from "@/data/recipe";
import ContainerRecipes from "./_components/container-recipes";

export default async function RecipeManagement() {
   // const [recipes, setRecipes] = useState(mockRecipes);
   const menuItems = await getAllMenuItems(true);
   const recipes = await getAllRecipes(true);

   return (
      <div className="bg-background min-h-screen">
         <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
               <div>
                  <h1 className="text-foreground mb-2 text-4xl font-bold">
                     Recipe Management
                  </h1>
                  <p className="text-muted-foreground">
                     Manage recipes and food costs
                  </p>
               </div>
               {/* <Button onClick={() => setIsAddRecipeOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
               </Button> */}
               <RecipeFormSheet menuItems={menuItems} />
            </div>

            <div className="mb-6">
               <div className="relative w-64">
                  {/* <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                  <Input
                     placeholder="Search recipes..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  /> */}
               </div>
            </div>

            <ContainerRecipes recipes={recipes} />
         </div>
      </div>
   );
}
