// Recipe with ingredients relation (based on the actual data structure)
export type RecipeWithRelations = {
   id: string;
   name: string;
   description?: string | null;
   instructions?: string | null;
   slug: string;
   estimatedCost?: number | null;
   preparationTime?: number | null;
   servingSize?: number | null;
   createdAt: Date;
   updatedAt: Date;
   deletedAt?: Date | null;
   ingredients: {
      quantity: number;
      ingredient: {
         id: string;
         name: string;
         unit: string;
      };
   }[];
   menuItem?: {
      id: string;
      name: string;
   } | null;
};

// Recipe ingredients for form handling
export type RecipeIngredientInput = {
   ingredientId: string;
   quantity: number;
};

// Recipe form data
export type RecipeFormData = {
   name: string;
   description?: string;
   instructions?: string;
   estimatedCost?: number;
   preparationTime?: number;
   servingSize?: number;
   menuItemId?: string;
   ingredients: RecipeIngredientInput[];
};
