import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
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

export const calculateDays = (startDate: string, endDate: string) => {
   const start = new Date(startDate);
   const end = new Date(endDate);
   const diffTime = Math.abs(end.getTime() - start.getTime());
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
   return diffDays;
};

export const formatTime = (date: Date) => {
   return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
   });
};

export function calculateHours(checkIn: Date, checkOut: Date): number {
   const checkInMinutes = checkIn.getUTCHours() * 60 + checkIn.getUTCMinutes();
   const checkOutMinutes =
      checkOut.getUTCHours() * 60 + checkOut.getUTCMinutes();

   let diff = checkOutMinutes - checkInMinutes;
   if (diff < 0) diff += 24 * 60;

   const hours = diff / 60;

   if (hours > 2.5) {
      return Math.ceil(hours);
   } else {
      return Math.floor(hours);
   }
}
