import type { Product } from "@/services/productService";

/** Whole-number discount percentage, or 0 when the product has no (real) discount. */
export function discountPercent(product: Pick<Product, "price" | "mrp">) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

export type SizeChart = { columns: string[]; rows: string[][] };

export function parseSizeChart(raw: string | null | undefined): SizeChart | null {
  if (!raw) return null;
  try {
    const chart = JSON.parse(raw);
    if (Array.isArray(chart.columns) && Array.isArray(chart.rows)) return chart as SizeChart;
  } catch {
    // ignore malformed data
  }
  return null;
}

/** Gallery for a product: always at least the hero image. */
export function galleryOf(product: Pick<Product, "images" | "imageUrl">) {
  if (product.images?.length) return product.images;
  return product.imageUrl ? [product.imageUrl] : [];
}

/** Shopping sections shown as tabs; each groups one or more backend categories. */
export const SECTIONS: { label: string; categories: string[] }[] = [
  { label: "Electronics", categories: ["Laptop", "Mobile", "Tablet", "Electronics"] },
  { label: "Clothing", categories: ["Men", "Women"] },
  { label: "Furniture", categories: ["Furniture"] },
  { label: "Watches", categories: ["Watches"] },
];

/** Section label for a backend category (falls back to the category itself). */
export function sectionOf(category: string | null | undefined) {
  if (!category) return "";
  return SECTIONS.find((s) => s.categories.includes(category))?.label ?? category;
}
