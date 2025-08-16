import { prisma } from "@/lib/prisma";

export const getAnalytics = async () => {
   const ingredients = await prisma.ingredient.findMany({
      select: {
         id: true,
         lowStockThreshold: true,
         transactions: {
            select: {
               type: true,
               quantity: true,
            },
         },
      },
   });

   const totalIngredients = ingredients.length;
   let lowStock = 0;
   let outOfStock = 0;

   for (const ingredient of ingredients) {
      const stock = ingredient.transactions.reduce((acc, transaction) => {
         if (transaction.type === "IMPORT") {
            return acc + transaction.quantity;
         }
         return acc - transaction.quantity;
      }, 0);

      if (stock <= 0) {
         outOfStock++;
      } else if (stock < (ingredient.lowStockThreshold ?? 0)) {
         lowStock++;
      }
   }

   const totalIngredientTransactions =
      await prisma.ingredientTransaction.count();

   return {
      totalIngredients,
      lowStock,
      outOfStock,
      totalIngredientTransactions,
   };
};
