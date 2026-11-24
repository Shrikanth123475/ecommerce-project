import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterSheet } from "@/components/FilterSheet";
import { LogoMark } from "@/components/Logo";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner, type BannerTarget } from "@/components/PromoBanner";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useResponsive } from "@/hooks/use-responsive";
import { getErrorMessage } from "@/services/api";
import { getProducts, type OfferTag, type Product, type SortOption } from "@/services/productService";
import { discountPercent, SECTIONS, sectionOf } from "@/utils/product";

const H_PADDING = 16;
const GAP = 14;
const MAX_WIDTH = 1440;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { contentWidth, columns, isDesktop } = useResponsive();
  const hPad = isDesktop ? 32 : H_PADDING;
  const cardWidth = (contentWidth - hPad * 2 - GAP * (columns - 1)) / columns;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState<SortOption>("");
  const [filterOpen, setFilterOpen] = useState(false);
  // Set when a promo banner is tapped: only products from that campaign are shown.
  const [offer, setOffer] = useState<OfferTag | "">("");
  const [offerTitle, setOfferTitle] = useState("");

  // Price range selected in the filter sheet (null = whole range).
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // "category" holds the selected section (Electronics / Clothing / Furniture / Watches).
  const sectionCategories = SECTIONS.find((x) => x.label === category)?.categories;
  const inSection = (p: Product) => !category || (sectionCategories ? sectionCategories.includes(p.category ?? "") : p.category === category);
  const sectionProducts = products.filter(inSection);
  const brands = Array.from(new Set(sectionProducts.map((p) => p.brand).filter((b): b is string => Boolean(b)))).sort();
  const prices = sectionProducts.map((p) => p.price);
  const priceMin = prices.length ? Math.floor(Math.min(...prices) / 500) * 500 : 0;
  const priceMax = prices.length ? Math.ceil(Math.max(...prices) / 500) * 500 : 0;
  const priceLow = priceRange ? Math.max(priceRange[0], priceMin) : priceMin;
  const priceHigh = priceRange ? Math.min(priceRange[1], priceMax) : priceMax;
  const priceActive = priceLow > priceMin || priceHigh < priceMax;

  const filtersActive = Boolean(debouncedSearch || category || brand || offer || priceActive);
  const extraFilters = (brand ? 1 : 0) + (sort ? 1 : 0) + (priceActive ? 1 : 0);

  const loadProducts = useCallback(
    async (isRefresh = false) => {
      const id = ++requestId.current;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const data = await getProducts({ search: debouncedSearch, sort });
        if (id === requestId.current) setProducts(data);
      } catch (e) {
        if (id === requestId.current) setError(getErrorMessage(e, "Couldn't load products."));
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [debouncedSearch, sort],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("");
    setPriceRange(null);
    setOffer("");
    setOfferTitle("");
  };

  const openBanner = (target: BannerTarget) => {
    setSearch("");
    setBrand("");
    setSort("");
    setPriceRange(null);
    setCategory(sectionOf(target.category));
    setOffer(target.offer ?? "");
    setOfferTitle(target.title);
  };

  // Campaign filter is applied on the loaded list; biggest discounts first.
  const matchesFilters = (p: Product) =>
    inSection(p) && (!brand || p.brand === brand) && p.price >= priceLow && p.price <= priceHigh;
  const filtered = products.filter(matchesFilters);
  const shownProducts = offer
    ? filtered
        .filter((p) => p.offers?.includes(offer))
        .sort((a, b) => (sort ? 0 : discountPercent(b) - discountPercent(a)))
    : filtered;

  const firstName = user?.name?.trim().split(" ")[0] ?? "there";
  const initial = (firstName[0] ?? "?").toUpperCase();

  const chips = [{ value: "", label: "All" }, ...SECTIONS.map((x) => ({ value: x.label, label: x.label }))];

  const renderBody = () => {
    if (loading) {
      return <ActivityIndicator style={styles.center} size="large" color={Brand.primary} />;
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
          <View style={styles.retry}>
            <PrimaryButton title="Retry" onPress={() => loadProducts()} />
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={shownProducts}
        keyExtractor={(item) => String(item.id)}
        key={columns}
        numColumns={columns}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.list, { paddingHorizontal: hPad }]}
        refreshing={refreshing}
        onRefresh={() => loadProducts(true)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {filtersActive ? null : <PromoBanner products={products} onSelect={openBanner} />}
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitle}>{offerTitle && offer ? offerTitle : category && !debouncedSearch ? category : filtersActive ? "Results" : "Special For You"}</Text>
              <Pressable onPress={clearAll} hitSlop={8}>
                <Text style={styles.seeAll}>{filtersActive ? "Clear" : "See All"}</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(item.id) } })}
          />
        )}
        ListEmptyComponent={<Text style={[styles.message, styles.empty]}>No products found.</Text>}
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.column1}>
        <View style={[styles.topRow, { paddingHorizontal: hPad }]}>
          <Pressable style={styles.greeting} onPress={() => router.navigate("/profile")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.greetingText} numberOfLines={1}>
              Hey, {firstName}
            </Text>
          </Pressable>
          <LogoMark size={40} />
          <Pressable style={styles.roundButton} onPress={() => router.navigate("/cart")} accessibilityLabel="Cart">
            <Ionicons name="bag-handle-outline" size={22} color="#18181B" />
          </Pressable>
        </View>

        <View style={[styles.searchRow, { paddingHorizontal: hPad }]}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#71717A" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Explore products"
              placeholderTextColor="#A1A1AA"
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>
          <Pressable style={styles.filterButton} onPress={() => setFilterOpen(true)} accessibilityLabel="Filters">
            <Ionicons name="options-outline" size={22} color={Brand.onAccent} />
            {extraFilters > 0 ? (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{extraFilters}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chips, { paddingHorizontal: hPad }]} keyboardShouldPersistTaps="handled">
          {chips.map((chip) => {
            const active = chip.value === category;
            return (
              <Pressable
                key={chip.value || "all"}
                onPress={() => {
                  setCategory(chip.value);
                  setBrand("");
                  setPriceRange(null);
                  setOffer("");
                  setOfferTitle("");
                }} style={[styles.chip, active && styles.chipActive]}>
                {active ? <Ionicons name="sparkles" size={14} color={Brand.accent} /> : null}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {category && brands.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.brandChips, { paddingHorizontal: hPad }]} keyboardShouldPersistTaps="handled">
            {["", ...brands].map((value) => {
              const active = value === brand;
              return (
                <Pressable key={value || "all-brands"} onPress={() => setBrand(value)} style={[styles.brandChip, active && styles.brandChipActive]}>
                  <Text style={[styles.brandChipText, active && styles.brandChipTextActive]}>{value || "All brands"}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      <View style={[styles.column1, styles.flex]}>{renderBody()}</View>

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        brands={brands}
        brand={brand}
        onBrand={setBrand}
        sort={sort}
        onSort={setSort}
        priceMin={priceMin}
        priceMax={priceMax}
        priceLow={priceLow}
        priceHigh={priceHigh}
        onPrice={(low, high) => setPriceRange(low <= priceMin && high >= priceMax ? null : [low, high])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  column1: { width: "100%", maxWidth: MAX_WIDTH, alignSelf: "center" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: H_PADDING, paddingTop: 8, gap: 10 },
  greeting: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 24, borderWidth: 1, borderColor: Brand.border, paddingVertical: 6, paddingLeft: 6, paddingRight: 14, alignSelf: "flex-start", maxWidth: 190 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Brand.accent, alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800", color: Brand.onAccent },
  greetingText: { fontSize: 15, fontWeight: "700", color: "#18181B", flexShrink: 1 },
  roundButton: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: Brand.border, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: H_PADDING, marginTop: 14 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Brand.surface, borderRadius: 26, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, fontSize: 15, color: "#18181B", height: 50 },
  filterButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: Brand.accent, alignItems: "center", justifyContent: "center" },
  filterBadge: { position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  filterBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  chips: { paddingHorizontal: H_PADDING, gap: 10, paddingVertical: 14 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22, backgroundColor: Brand.surface },
  chipActive: { backgroundColor: Brand.primary },
  chipText: { fontSize: 14, color: "#52525B", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  brandChips: { gap: 8, paddingBottom: 12 },
  brandChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: Brand.border, backgroundColor: "#fff" },
  brandChipActive: { borderColor: Brand.primary, backgroundColor: "#EEF3E3" },
  brandChipText: { fontSize: 13, color: "#52525B", fontWeight: "600" },
  brandChipTextActive: { color: Brand.primary },
  list: { paddingHorizontal: H_PADDING, paddingBottom: 24 },
  listHeader: { gap: 16, paddingBottom: 14 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#18181B" },
  seeAll: { fontSize: 13, color: "#71717A", fontWeight: "600" },
  column: { gap: GAP, marginBottom: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  empty: { marginTop: 48 },
  retry: { marginTop: 16, alignSelf: "stretch" },
});
