"use client";

import { useState } from "react";
import { RecipeCard } from "./recipe-card";
import { RecipeDetailModal } from "./recipe-detail-modal";

const ContainerRecipes = ({ recipes }: { recipes: any[] }) => {
   const [selectedRecipe, setSelectedRecipe] = useState(null);

   return (
      <>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
               <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
               />
            ))}
         </div>
         <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
         />
      </>
   );
};

export default ContainerRecipes;
