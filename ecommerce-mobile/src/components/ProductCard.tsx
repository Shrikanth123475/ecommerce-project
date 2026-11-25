import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
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
  const { refresh: refreshCart } = useCart();
  const wishlist = useWishlist();
  const liked = wishlist.has(product.id);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Press feedback: the card shrinks and its photo gets a green frame. It fades back slowly, and a
  // quick tap still holds the effect for a moment so it is easy to see.
  const scale = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const pressIn = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    Animated.timing(glow, { toValue: 1, duration: 120, useNativeDriver: false }).start();
  };
  const pressOut = () => {
    Animated.timing(scale, { toValue: 0, duration: 350, delay: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    Animated.timing(glow, { toValue: 0, duration: 350, delay: 150, useNativeDriver: false }).start();
  };
  const cardScale = scale.interpolate({ inputRange: [0, 1], outputRange: [1, 0.94] });
  const frameColor = glow.interpolate({ inputRange: [0, 1], outputRange: ["rgba(163,230,53,0)", Brand.accent] });

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
      refreshCart();
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
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={[styles.card, styles.pointer, { width }]}>
      {({ hovered }: { hovered?: boolean }) => (
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <Animated.View style={[styles.imageBox, { height: Math.round(width * 1.0), borderColor: frameColor }, hovered && styles.imageBoxHover]}>
        <Image
          source={hero ? { uri: hero } : undefined}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
        <Pressable style={({ pressed }) => [styles.heart, styles.pointer, pressed && styles.btnPressed]} onPress={() => wishlist.toggle(product.id)} hitSlop={8}>
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
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.meta} numberOfLines={1}>
            {[product.category, product.brand].filter(Boolean).join(" · ")}
          </Text>
          <Text style={[styles.name, hovered && styles.nameHover]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {off > 0 && product.mrp ? <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text> : null}
          </View>
        </View>
        <Pressable style={({ pressed }) => [styles.add, styles.pointer, pressed && styles.btnPressed]} onPress={handleAdd} disabled={adding} hitSlop={6}>
          <Ionicons name={added ? "checkmark" : "add"} size={20} color={Brand.onAccent} />
        </Pressable>
      </View>
      </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff" },
  pointer: { cursor: "pointer" },
  btnPressed: { opacity: 0.7, transform: [{ scale: 0.82 }] },
  imageBoxHover: { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6, transform: [{ scale: 1.02 }] },
  nameHover: { fontWeight: "800", textDecorationLine: "underline" },
  imageBox: { borderRadius: 20, borderWidth: 3, margin: -3, overflow: "hidden" },
  image: { width: "100%", height: "100%", backgroundColor: Brand.surface },
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
