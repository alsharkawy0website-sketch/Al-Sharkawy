export * from "./database.types";

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number | null;
};

export type ProductSize = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  is_active: boolean | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price: number | null;
  discount_type: "none" | "percentage" | "fixed" | null;
  discount_value: number | null;
  is_active: boolean | null;
  tag?: string | null;
  spicy?: boolean | null;
  product_sizes?: ProductSize[];
};

export type Offer = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_type: "percentage" | "fixed" | null;
  discount_value: number | null;
  is_active: boolean | null;
  product_id?: string | null;
  old_price?: number | null;
  new_price?: number | null;
  expires_in?: string | null;
  savings?: string | null;
};

export type MenuCategory = Pick<Category, "id" | "slug" | "name">;

// Cart line item stored client-side (localStorage).
export type CartLine = {
  key: string; // productId + optional sizeId (uniqueness key)
  productId: string;
  sizeId: string | null;
  sizeName: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
};
