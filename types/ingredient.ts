import { Image, Ingredient, Prisma } from "@/lib/generated/prisma";

export enum StockStatus {
   IN_STOCK = "IN_STOCK",
   LOW_STOCK = "LOW_STOCK",
   OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type IngredientWithStock = Ingredient & {
   image: Image;
   currentStock: number;
   status: StockStatus;
};
