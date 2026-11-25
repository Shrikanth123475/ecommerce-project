import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const columns = width < 600 ? 2 : width < 900 ? 3 : width < 1200 ? 4 : 5;
  const contentWidth = Math.min(width, 1440);
  return { width, isDesktop, columns, contentWidth };
}

export const PAGE_MAX_WIDTH = 820;
