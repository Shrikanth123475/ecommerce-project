import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeChartModal } from "@/components/SizeChartModal";
import { Brand } from "@/constants/theme";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage, isStockError } from "@/services/api";
import { showAlert, showSuccess } from "@/utils/confirm";
import { addToCart } from "@/services/cartService";
import { getProduct, type Product } from "@/services/productService";
import { formatPrice } from "@/utils/format";
import { discountPercent, galleryOf, parseSizeChart } from "@/utils/product";
import { PAGE_MAX_WIDTH } from "@/hooks/use-responsive";

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then((data) => !cancelled && setProduct(data))
      .catch((e) => !cancelled && setError(getErrorMessage(e, "Couldn't load this product.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "" }} />
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "" }} />
        <Text style={styles.message}>{error ?? "Product not found."}</Text>
        <View style={styles.retry}>
          <PrimaryButton title="Retry" onPress={() => setAttempt((n) => n + 1)} />
        </View>
      </View>
    );
  }

  const outOfStock = product.quantity <= 0;
  const lowStock = !outOfStock && product.quantity <= 5;

  const needsSize = product.sizes.length > 0;
  const chart = parseSizeChart(product.sizeChart);
  const off = discountPercent(product);

  const handleAddToCart = async () => {
    if (needsSize && !size) {
      showAlert("Select a size", "Please choose your size before adding this item to your cart.");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1, size);
      setAdded(true);
      setAdding(false);
      const goToCart = await showSuccess(
        "Added to cart",
        `${product.name}${size ? ` (Size ${size})` : ""} has been added to your cart successfully.`,
        "Go to cart",
        "Continue shopping",
      );
      if (goToCart) router.navigate("/cart");
    } catch (e) {
      if (isStockError(e)) {
        showAlert("Limited stock", getErrorMessage(e));
        getProduct(id).then(setProduct).catch(() => {}); // refresh stock label
      } else {
        toast.show(getErrorMessage(e, "Couldn't add this item to your cart."), "error");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.screen}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: product.brand ?? "Product" }} />
      <ProductGallery images={galleryOf(product)} badge={off > 0 ? `${off}% OFF` : null} />

      <View style={styles.section}>
        {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {off > 0 && product.mrp ? (
            <>
              <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text>
              <Text style={styles.off}>{off}% off</Text>
            </>
          ) : null}
        </View>
        {off > 0 && product.mrp ? (
          <Text style={styles.save}>You save {formatPrice(product.mrp - product.price)}</Text>
        ) : null}
        {outOfStock ? (
          <Text style={[styles.stock, { color: Brand.error }]}>Out of stock</Text>
        ) : lowStock ? (
          <Text style={[styles.stock, { color: Brand.warning }]}>Only {product.quantity} left</Text>
        ) : (
          <Text style={[styles.stock, { color: "#388E3C" }]}>In stock</Text>
        )}
      </View>

      {needsSize ? (
        <View style={styles.section}>
          <View style={styles.sizeHeader}>
            <Text style={styles.heading}>Select size</Text>
            {chart ? (
              <Pressable onPress={() => setChartOpen(true)} hitSlop={8}>
                <Text style={styles.chartLink}>Size chart</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.sizes}>
            {product.sizes.map((option) => (
              <Pressable key={option} onPress={() => setSize(option)} style={[styles.sizeChip, size === option && styles.sizeChipActive]}>
                <Text style={[styles.sizeText, size === option && styles.sizeTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {product.description ? (
        <View style={styles.section}>
          <Text style={styles.heading}>Description</Text>
          <Text style={styles.body}>{product.description}</Text>
        </View>
      ) : null}

      {product.specifications ? (
        <View style={styles.section}>
          <Text style={styles.heading}>Specifications</Text>
          <Text style={styles.body}>{product.specifications}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.heading}>Details</Text>
        <InfoRow label="Category" value={product.category} />
        <InfoRow label="Seller" value={product.seller} />
        <InfoRow label="Distributor" value={product.distributor} />
        <InfoRow label="Warranty" value={product.warranty} />
      </View>
    </ScrollView>

    {chart ? <SizeChartModal visible={chartOpen} chart={chart} selected={size} onClose={() => setChartOpen(false)} /> : null}

    <View style={styles.footer}>
      {outOfStock ? (
        <Text style={styles.soldOut}>Currently out of stock</Text>
      ) : added ? (
        <PrimaryButton title="Go to cart" onPress={() => router.navigate("/cart")} />
      ) : (
        <PrimaryButton title="Add to cart" onPress={handleAddToCart} loading={adding} />
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F3F6" },
  scroll: { flex: 1 },
  content: { maxWidth: PAGE_MAX_WIDTH, width: "100%", alignSelf: "center", paddingBottom: 32 },
  footer: { backgroundColor: "#fff", padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: "#EEF0F4" },
  soldOut: { textAlign: "center", color: Brand.error, fontWeight: "700", paddingVertical: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  retry: { marginTop: 16, alignSelf: "stretch" },
  image: { width: "100%", height: 300, backgroundColor: "#fff" },
  section: { backgroundColor: "#fff", padding: 16, marginTop: 8, gap: 6 },
  brand: { fontSize: 13, color: "#878787", fontWeight: "600" },
  name: { fontSize: 20, fontWeight: "600", color: "#212121" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginTop: 4 },
  price: { fontSize: 26, fontWeight: "800", color: "#212121" },
  mrp: { fontSize: 16, color: "#878787", textDecorationLine: "line-through" },
  off: { fontSize: 16, fontWeight: "800", color: "#16A34A" },
  save: { fontSize: 13, color: "#16A34A", fontWeight: "600" },
  sizeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chartLink: { fontSize: 14, fontWeight: "700", color: Brand.primary, textDecorationLine: "underline" },
  sizes: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  sizeChip: { minWidth: 52, height: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1.5, borderColor: Brand.border, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  sizeChipActive: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  sizeText: { fontSize: 15, fontWeight: "700", color: "#27272A" },
  sizeTextActive: { color: "#fff" },
  stock: { fontSize: 14, fontWeight: "600" },
  heading: { fontSize: 16, fontWeight: "700", color: "#212121", marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 21, color: "#424242" },
  infoRow: { flexDirection: "row", paddingVertical: 4 },
  infoLabel: { width: 110, color: "#878787", fontSize: 14 },
  infoValue: { flex: 1, color: "#212121", fontSize: 14 },
});
