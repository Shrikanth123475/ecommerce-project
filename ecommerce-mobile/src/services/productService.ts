import { api } from "./api";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  category: string | null;
  brand: string | null;
  seller: string | null;
  distributor: string | null;
  warranty: string | null;
  specifications: string | null;
  /** Original price before discount (null = not discounted). */
  mrp: number | null;
  /** Gallery photos (hero first). */
  images: string[];
  /** Clothing sizes, e.g. ["S","M","L"] (empty for other products). */
  sizes: string[];
  /** JSON string: {"columns": [...], "rows": [[...]]} */
  sizeChart: string | null;
  /** Campaign tags: sale50, clearance, festive */
  offers: string[];
};

export type OfferTag = "sale50" | "clearance" | "festive";

export type SortOption = "" | "priceLow" | "priceHigh";

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  sort?: SortOption;
};

export async function getProducts({ search, category, brand, sort }: ProductFilters = {}) {
  const { data } = await api.get<Product[]>("/products/filter", {
    params: {
      search: search || undefined,
      category: category || undefined,
      brand: brand || undefined,
      sort: sort || undefined,
    },
  });
  return data;
}

export async function getProduct(id: number | string) {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await api.get<string[]>("/products/categories");
  return data;
}

export async function getBrands() {
  const { data } = await api.get<string[]>("/products/brands");
  return data;
}
