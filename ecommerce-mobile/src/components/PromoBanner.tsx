import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ScrollViewInstance,
} from "react-native";

import { Brand } from "@/constants/theme";
import type { OfferTag, Product } from "@/services/productService";
import { formatPrice } from "@/utils/format";
import { discountPercent, galleryOf } from "@/utils/product";

export type BannerTarget = { offer?: OfferTag; category?: string; title: string };

type Slide = {
  key: string;
  title: string;
  highlight: string;
  text: string;
  cta: string;
  bg: string;
  accent: string;
  target: BannerTarget;
  preview: Product[];
};

const AUTO_ADVANCE_MS = 4500;

// Banners are built from the real catalogue: every number shown comes from the products behind the banner,
// and tapping a banner opens exactly those products.
function buildSlides(products: Product[]): Slide[] {
  const tagged = (tag: OfferTag) => products.filter((p) => p.offers?.includes(tag) && p.quantity > 0);
  const range = (list: Product[]) => {
    const values = list.map(discountPercent).filter((v) => v > 0);
    return { min: Math.min(...values), max: Math.max(...values) };
  };
  const label = (list: Product[]) => {
    const { min, max } = range(list);
    return min === max ? `Flat ${max}% OFF` : `Up to ${max}% OFF`;
  };

  const slides: Slide[] = [];

  const sale = tagged("sale50");
  if (sale.length) {
    slides.push({
      key: "sale50",
      title: "Mega Sale",
      highlight: label(sale),
      text: "On fashion, furniture & more",
      cta: "Shop 50% Off",
      bg: "#232326",
      accent: Brand.accent,
      target: { offer: "sale50", title: "50% Off Deals" },
      preview: sale,
    });
  }

  const clearance = tagged("clearance");
  if (clearance.length) {
    slides.push({
      key: "clearance",
      title: "Clearance Sale",
      highlight: label(clearance),
      text: "Last few pieces - grab them before they go",
      cta: "Shop Clearance",
      bg: "#2B1B1B",
      accent: "#FB923C",
      target: { offer: "clearance", title: "Clearance Sale" },
      preview: clearance,
    });
  }

  const festive = tagged("festive");
  if (festive.length) {
    slides.push({
      key: "festive",
      title: "Festive Sale",
      highlight: label(festive),
      text: "Fashion, furniture & electronics",
      cta: "Shop Festive Deals",
      bg: "#2A2410",
      accent: "#FACC15",
      target: { offer: "festive", title: "Festive Sale" },
      preview: festive,
    });
  }

  const furniture = products.filter((p) => p.category === "Furniture" && p.quantity > 0);
  if (furniture.length) {
    const from = Math.min(...furniture.map((p) => p.price));
    slides.push({
      key: "furniture",
      title: "Home & Furniture",
      highlight: `Starting ${formatPrice(from)}`,
      text: "Sofas, beds, chairs, tables & more",
      cta: "Explore Furniture",
      bg: "#17251F",
      accent: "#4ADE80",
      target: { category: "Furniture", title: "Home & Furniture" },
      preview: furniture,
    });
  }

  return slides;
}

export function PromoBanner({ products, onSelect }: { products: Product[]; onSelect: (target: BannerTarget) => void }) {
  const slides = useMemo(() => buildSlides(products), [products]);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const scroller = useRef<ScrollViewInstance>(null);
  const indexRef = useRef(0);
  const count = slides.length;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Rotate banners automatically, like the big shopping sites do.
  useEffect(() => {
    if (count < 2 || width === 0) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      scroller.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count, width]);

  if (count === 0) return null;

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout}>
      {width > 0 ? (
        <ScrollView
          ref={scroller}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          scrollEventThrottle={16}
        >
          {slides.map((slide) => (
            <Pressable key={slide.key} style={{ width }} onPress={() => onSelect(slide.target)}>
              <View style={[styles.card, { backgroundColor: slide.bg }]}>
                <View style={styles.text}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={[styles.highlight, { color: slide.accent }]}>{slide.highlight}</Text>
                  <Text style={styles.sub}>{slide.text}</Text>
                  <View style={[styles.cta, { backgroundColor: slide.accent }]}>
                    <Text style={styles.ctaText}>{slide.cta}</Text>
                  </View>
                </View>
                <View style={styles.art}>
                  <View style={[styles.ring, { borderColor: slide.accent }]} />
                  {slide.preview.slice(0, 3).map((product, i) => {
                    const uri = galleryOf(product)[0];
                    return uri ? (
                      <Image
                        key={product.id}
                        source={{ uri }}
                        style={[styles.bubble, { right: 4 + i * 44, top: 14 + (i % 2) * 36, zIndex: 3 - i, borderColor: slide.bg }]}
                        contentFit="cover"
                      />
                    ) : null;
                  })}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <View style={styles.dots}>
        {slides.map((slide, i) => (
          <View key={slide.key} style={[styles.dot, i === index && { width: 18, backgroundColor: slide.accent }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 20, minHeight: 176, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  text: { flex: 1, gap: 4, zIndex: 1 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  highlight: { fontSize: 24, fontWeight: "900" },
  sub: { color: "#A1A1AA", fontSize: 12, marginTop: 2 },
  cta: { alignSelf: "flex-start", marginTop: 12, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 9 },
  ctaText: { color: "#18181B", fontWeight: "800", fontSize: 13 },
  art: { width: 150, height: 140, marginRight: -6 },
  ring: { position: "absolute", right: -40, top: -4, width: 150, height: 150, borderRadius: 75, borderWidth: 2, opacity: 0.35 },
  bubble: { position: "absolute", width: 84, height: 84, borderRadius: 42, borderWidth: 3, backgroundColor: "#fff" },
  dots: { flexDirection: "row", gap: 5, alignSelf: "center", marginTop: -14, marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.4)" },
});
