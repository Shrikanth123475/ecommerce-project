export const formatPrice = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

export function formatDate(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
