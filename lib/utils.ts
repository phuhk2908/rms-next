import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   }).format(price);
}

export const formatDate = (date: Date | string): string => {
   return new Intl.DateTimeFormat("vi-VI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   }).format(new Date(date));
};
