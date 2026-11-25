import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Brand } from "@/constants/theme";
import { useResponsive } from "@/hooks/use-responsive";
import { useWishlist } from "@/context/WishlistContext";
import { getErrorMessage } from "@/services/api";
import { getProducts, type Product } from "@/services/productService";

const H_PADDING = 16;
const GAP = 14;
const MAX_WIDTH = 1440;

export default function Wishlist() {
  const router = useRouter();
  const { ids } = useWishlist();
  const { contentWidth, columns, isDesktop } = useResponsive();
  const hPad = isDesktop ? 32 : H_PADDING;
  const cardWidth = (contentWidth - hPad * 2 - GAP * (columns - 1)) / columns;
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProducts({ search: "", category: "", brand: "", sort: "" })
        .then((data) => {
          setProducts(data);
          setError(null);
        })
        .catch((e) => setError(getErrorMessage(e, "Couldn't load your wishlist.")));
    }, []),
  );

  const saved = (products ?? []).filter((product) => ids.includes(product.id));

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={[styles.header, { paddingHorizontal: hPad }]}>
        <Text style={styles.title}>Wishlist</Text>
        {saved.length ? <Text style={styles.count}>{saved.length} saved</Text> : null}
      </View>
      {products === null && !error ? (
        <ActivityIndicator style={styles.center} size="large" color={Brand.primary} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => String(item.id)}
          key={columns}
          numColumns={columns}
          columnWrapperStyle={styles.column}
          contentContainerStyle={saved.length ? [styles.list, { paddingHorizontal: hPad }] : styles.emptyList}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              width={cardWidth}
              onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(item.id) } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🤍</Text>
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.message}>Tap the heart on any product to save it here.</Text>
              <View style={styles.retry}>
                <PrimaryButton title="Explore products" onPress={() => router.navigate("/home")} />
              </View>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: H_PADDING, paddingVertical: 14, width: "100%", maxWidth: MAX_WIDTH, alignSelf: "center" },
  title: { fontSize: 24, fontWeight: "800", color: "#18181B" },
  count: { fontSize: 13, color: "#71717A", fontWeight: "600" },
  list: { paddingHorizontal: H_PADDING, paddingBottom: 24, width: "100%", maxWidth: MAX_WIDTH, alignSelf: "center" },
  column: { gap: GAP, marginBottom: 18 },
  emptyList: { flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 6 },
  emptyIcon: { fontSize: 44 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#18181B" },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  retry: { marginTop: 16, width: "100%", maxWidth: 320, alignSelf: "center" },
});
