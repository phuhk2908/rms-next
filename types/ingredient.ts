import { Image, Prisma } from "@/lib/generated/prisma";

export enum StockStatus {
   IN_STOCK = "In Stock",
   LOW_STOCK = "Low Stock",
   OUT_OF_STOCK = "Out of Stock",
}

export type Ingredient = Prisma.IngredientGetPayload<{}>;

export type IngredientWithStock = Ingredient & {
   image: Image;
   currentStock: number;
   status: StockStatus;
};
