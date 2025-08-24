import "server-only";

import { prisma } from "@/lib/prisma";
import { IngredientWithStock, StockStatus } from "@/types/ingredient";
import { unstable_cache } from "next/cache";

export const getIngredientsWithStock = async (): Promise<
   IngredientWithStock[]
> => {
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
      let stockStatus: StockStatus;
      const threshold =
         ingredient.lowStockThreshold ?? LOW_STOCK_DEFAULT_THRESHOLD;

      if (ingredient.currentStock <= 0) {
         stockStatus = StockStatus.OUT_OF_STOCK;
      } else if (ingredient.currentStock <= threshold) {
         stockStatus = StockStatus.LOW_STOCK;
      } else {
         stockStatus = StockStatus.IN_STOCK;
      }

      const { transactions, ...ingredientData } = ingredient;
      return {
         ...ingredientData,
         status: stockStatus,
      };
   });
};

export const getIngredientTransactions = async () => {
   return await prisma.ingredientTransaction.findMany({
      select: {
         id: true,
         type: true,
         quantity: true,
         price: true,
         notes: true,
         ingredient: {
            select: {
               id: true,
               name: true,
            },
         },
         createdBy: {
            select: {
               id: true,
               name: true,
            },
         },
      },
   });
};
