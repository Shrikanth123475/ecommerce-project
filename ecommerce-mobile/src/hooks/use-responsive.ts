import { useWindowDimensions } from "react-native";

// Phone: 2 product columns. Laptop / wide window: more columns, using the whole screen width.
export function useResponsive() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const columns = width < 600 ? 2 : width < 900 ? 3 : width < 1200 ? 4 : 5;
  const contentWidth = Math.min(width, 1440);
  return { width, isDesktop, columns, contentWidth };
}

// Readable width for single-column pages (cart, orders, profile...) on big screens.
export const PAGE_MAX_WIDTH = 820;
