import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterChips } from "@/components/FilterChips";
import { HomeHighlights } from "@/components/HomeHighlights";
import { LogoMark } from "@/components/Logo";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Brand } from "@/constants/theme";
import { getErrorMessage } from "@/services/api";
import {
  getBrands,
  getCategories,
  getProducts,
  type Product,
  type SortOption,
} from "@/services/productService";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "", label: "Relevance" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
];

const H_PADDING = 16;
const GAP = 12;

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState<SortOption>("");

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getBrands().then(setBrands).catch(() => {});
  }, []);

  const filtersActive = Boolean(debouncedSearch || category || brand);

  const loadProducts = useCallback(
    async (isRefresh = false) => {
      const id = ++requestId.current;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const data = await getProducts({ search: debouncedSearch, category, brand, sort });
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
    [debouncedSearch, category, brand, sort],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const cycleSort = () => {
    const index = SORT_OPTIONS.findIndex((option) => option.value === sort);
    setSort(SORT_OPTIONS[(index + 1) % SORT_OPTIONS.length].value);
  };

  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label;

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
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={() => loadProducts(true)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={filtersActive ? undefined : <HomeHighlights products={products} />}
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
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <LogoMark size={42} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for products"
            placeholderTextColor="#9AA0AA"
            style={styles.search}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.filters}>
        <FilterChips options={categories} selected={category} onSelect={setCategory} allLabel="All" />
        <FilterChips options={brands} selected={brand} onSelect={setBrand} allLabel="All brands" />
      </View>

      <View style={styles.summary}>
        <Text style={styles.count}>{loading ? " " : `${products.length} products`}</Text>
        <Pressable onPress={cycleSort} hitSlop={8}>
          <Text style={styles.sort}>Sort: {sortLabel}</Text>
        </Pressable>
      </View>

      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F3F6" },
  header: { backgroundColor: Brand.primary, paddingHorizontal: H_PADDING, paddingBottom: 12 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10 },
  search: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
  },
  filters: { backgroundColor: "#fff", paddingVertical: 8, gap: 6 },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 10,
  },
  count: { color: "#60646C", fontSize: 13 },
  sort: { color: Brand.primary, fontSize: 13, fontWeight: "700" },
  list: { paddingHorizontal: H_PADDING, paddingBottom: 24 },
  column: { gap: GAP, marginBottom: GAP },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  empty: { marginTop: 48 },
  retry: { marginTop: 16, alignSelf: "stretch" },
});
