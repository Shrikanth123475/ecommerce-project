import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import { useWishlist } from "@/context/WishlistContext";
import { getErrorMessage, isStockError } from "@/services/api";
import { addToCart } from "@/services/cartService";
import type { Product } from "@/services/productService";
import { showAlert, showSuccess } from "@/utils/confirm";
import { formatPrice } from "@/utils/format";
import { discountPercent, galleryOf } from "@/utils/product";

type Props = {
  product: Product;
  width: number;
  onPress: () => void;
};

export function ProductCard({ product, width, onPress }: Props) {
  const outOfStock = product.quantity <= 0;
  const router = useRouter();
  const wishlist = useWishlist();
  const liked = wishlist.has(product.id);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const off = discountPercent(product);
  const hero = galleryOf(product)[0];

  const handleAdd = async () => {
    // Clothes need a size, so open the product page to choose one.
    if (product.sizes?.length) {
      onPress();
      return;
    }
    if (outOfStock) {
      showAlert("Out of stock", `${product.name} is out of stock right now.`);
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      setAdding(false);
      const goToCart = await showSuccess(
        "Added to cart",
        `${product.name} has been added to your cart successfully.`,
        "Go to cart",
        "Continue shopping",
      );
      if (goToCart) router.navigate("/cart");
    } catch (e) {
      showAlert(isStockError(e) ? "Limited stock" : "Couldn't add to cart", getErrorMessage(e, "Couldn't add this item to your cart."));
    } finally {
      setAdding(false);
    }
  };

  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]}>
      <View style={[styles.imageBox, { height: Math.round(width * 1.0) }]}>
        <Image
          source={hero ? { uri: hero } : undefined}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
        <Pressable style={styles.heart} onPress={() => wishlist.toggle(product.id)} hitSlop={8}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#E11D48" : "#27272A"} />
        </Pressable>
        {off > 0 ? (
          <View style={styles.offBadge}>
            <Text style={styles.offBadgeText}>{off}% OFF</Text>
          </View>
        ) : null}
        {outOfStock ? (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Out of stock</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.meta} numberOfLines={1}>
            {[product.category, product.brand].filter(Boolean).join(" · ")}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {off > 0 && product.mrp ? <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text> : null}
          </View>
        </View>
        <Pressable style={styles.add} onPress={handleAdd} disabled={adding} hitSlop={6}>
          <Ionicons name={added ? "checkmark" : "add"} size={20} color={Brand.onAccent} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff" },
  imageBox: { borderRadius: 20, backgroundColor: Brand.surface, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOut: { position: "absolute", left: 10, bottom: 10, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  soldOutText: { color: Brand.error, fontSize: 11, fontWeight: "700" },
  footer: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 10 },
  info: { flex: 1, gap: 2 },
  meta: { fontSize: 11, color: "#71717A" },
  name: { fontSize: 14, fontWeight: "600", color: "#18181B" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, flexWrap: "wrap" },
  price: { fontSize: 15, fontWeight: "800", color: "#18181B" },
  mrp: { fontSize: 12, color: "#A1A1AA", textDecorationLine: "line-through" },
  offBadge: { position: "absolute", left: 10, top: 10, backgroundColor: "#16A34A", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  offBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  add: { width: 34, height: 34, borderRadius: 17, backgroundColor: Brand.accent, alignItems: "center", justifyContent: "center" },
});
