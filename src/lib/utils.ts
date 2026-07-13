import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ProductSize } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDiscountedPrice(price: number, discountType: "none" | "percentage" | "fixed" | null, discountValue: number | null): number {
  if (!discountType || discountType === "none" || !discountValue) return price;
  if (discountType === "percentage") {
    return Math.max(0, price - (price * discountValue) / 100);
  }
  if (discountType === "fixed") {
    return Math.max(0, price - discountValue);
  }
  return price;
}

export function getProductDisplayPrice(product: Product, size?: ProductSize | null): { original: number; final: number; hasDiscount: boolean } {
  const original = size ? size.price : (product.base_price ?? 0);
  const final = calculateDiscountedPrice(original, product.discount_type, product.discount_value);
  return { original, final, hasDiscount: original > final };
}
