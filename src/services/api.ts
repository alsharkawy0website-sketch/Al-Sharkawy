import { supabase } from "@/lib/supabase";
import type { Category, MenuCategory, Offer, Product, ProductSize } from "@/types";

// ---- Categories ---------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c: any) => ({ id: c.id, slug: c.slug, name: c.name }));
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from("categories").insert(payload).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<true> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ---- Products -----------------------------------------------------------

const PRODUCT_SELECT = "*, product_sizes(*)";

export async function getMenuItems(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Product | null) ?? null;
}

export async function createProduct(
  productData: Partial<Product>,
  sizes: Array<Partial<ProductSize>>,
): Promise<Product> {
  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();
  if (error) throw error;
  if (sizes && sizes.length > 0) {
    const rows = sizes.map((s) => ({ ...s, product_id: (product as any).id }));
    const { error: sizeError } = await supabase.from("product_sizes").insert(rows);
    if (sizeError) throw sizeError;
  }
  return product as Product;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>,
  sizes: Array<Partial<ProductSize>>,
): Promise<Product> {
  const { data: product, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  // Replace sizes: delete old, insert new.
  const { error: delErr } = await supabase.from("product_sizes").delete().eq("product_id", id);
  if (delErr) throw delErr;
  if (sizes && sizes.length > 0) {
    const rows = sizes.map((s) => ({ ...s, product_id: id }));
    const { error: insErr } = await supabase.from("product_sizes").insert(rows);
    if (insErr) throw insErr;
  }
  return product as Product;
}

export async function deleteProduct(id: string): Promise<true> {
  // Cascade sizes explicitly in case DB does not.
  const { error: sErr } = await supabase.from("product_sizes").delete().eq("product_id", id);
  if (sErr) throw sErr;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ---- Offers -------------------------------------------------------------

export async function getOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Offer[];
}

export async function getAdminOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Offer[];
}

export async function createOffer(payload: Partial<Offer>): Promise<Offer> {
  const { data, error } = await supabase.from("offers").insert(payload).select().single();
  if (error) throw error;
  return data as Offer;
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Offer;
}

export async function deleteOffer(id: string): Promise<true> {
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Convenience aggregate for callers already using the previous `api.*` surface.
export const api = {
  getCategories,
  getMenuCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getAdminProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOffers,
  getAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
