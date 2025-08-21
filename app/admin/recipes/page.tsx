import { getAllMenuItems } from "@/data/menu-item";
import { getIngredientsWithStock } from "@/data/ingredient";
import { getRecipes } from "@/data/recipe";
import ContainerRecipes from "./_components/container-recipes";
import { RecipeFormSheet } from "./_components/recipe-form";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardAction,
   CardContent,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Admin | Recipes",
   description: "Organize and manage your restaurant's recipes",
};

export default async function RecipeManagement() {
   const [menuItems, ingredients, recipes] = await Promise.all([
      getAllMenuItems(true),
      getIngredientsWithStock(),
      getRecipes(),
   ]);

   const serializedMenuItems = menuItems.map((item) => ({
      ...item,
      recipe: item.recipe
         ? {
              ...item.recipe,
              estimatedCost:
                 item.recipe.estimatedCost === null
                    ? null
                    : typeof item.recipe.estimatedCost === "object" &&
                        "toNumber" in item.recipe.estimatedCost
                      ? item.recipe.estimatedCost.toNumber()
                      : Number(item.recipe.estimatedCost),
           }
         : null,
   }));

   return (
      <Card>
         <CardHeader>
            <CardTitle>Recipes Management</CardTitle>
            <CardDescription>
               Organize and manage your restaurant&apos;s recipes
            </CardDescription>
            <CardAction>
               <RecipeFormSheet
                  menuItems={serializedMenuItems}
                  ingredients={ingredients}
               />
            </CardAction>
         </CardHeader>
         <CardContent>
            <ContainerRecipes
               recipes={recipes.map((recipe) => ({
                  ...recipe,
                  estimatedCost:
                     recipe.estimatedCost === null
                        ? null
                        : typeof recipe.estimatedCost === "object" &&
                            "toNumber" in recipe.estimatedCost
                          ? recipe.estimatedCost.toNumber()
                          : Number(recipe.estimatedCost),
               }))}
               menuItems={serializedMenuItems}
               ingredients={ingredients}
            />
         </CardContent>
      </Card>
   );
}
