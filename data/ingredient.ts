import "server-only";

import { prisma } from "@/lib/prisma";
import { IngredientWithStock, StockStatus } from "@/types/ingredient";
import { unstable_cache } from "next/cache";

export const getIngredientsWithStock = unstable_cache(
   async (): Promise<IngredientWithStock[]> => {
      const ingredients = await prisma.ingredient.findMany({
         include: {
            transactions: {
               select: {
                  type: true,
                  quantity: true,
               },
            },
            image: true,
         },
      });

      const LOW_STOCK_DEFAULT_THRESHOLD = 10;

      return ingredients.map((ingredient) => {
         const currentStock = ingredient.transactions.reduce(
            (acc, transaction) =>
               acc +
               (transaction.type === "IMPORT"
                  ? transaction.quantity
                  : -transaction.quantity),
            0,
         );

         let stockStatus: StockStatus;
         const threshold =
            ingredient.lowStockThreshold ?? LOW_STOCK_DEFAULT_THRESHOLD;

         if (currentStock <= 0) {
            stockStatus = StockStatus.OUT_OF_STOCK;
         } else if (currentStock <= threshold) {
            stockStatus = StockStatus.LOW_STOCK;
         } else {
            stockStatus = StockStatus.IN_STOCK;
         }

         const { transactions, ...ingredientData } = ingredient;
         return {
            ...ingredientData,
            currentStock,
            status: stockStatus,
         };
      });
   },
   ["ingredients"],
   {
      revalidate: 60,
   },
);
