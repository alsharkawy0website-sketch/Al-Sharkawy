import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getFeaturedProducts,
  getMenuCategories,
  getMenuItems,
  getOffers,
  getProductById,
} from "@/services/api";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: FIVE_MINUTES,
  });
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ["menuCategories"],
    queryFn: getMenuCategories,
    staleTime: FIVE_MINUTES,
  });
}

export function useMenuItems() {
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    staleTime: FIVE_MINUTES,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featuredProducts"],
    queryFn: getFeaturedProducts,
    staleTime: FIVE_MINUTES,
  });
}

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    staleTime: FIVE_MINUTES,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: FIVE_MINUTES,
    enabled: Boolean(id),
  });
}
