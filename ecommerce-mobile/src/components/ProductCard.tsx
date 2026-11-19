import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import type { Product } from "@/services/productService";
import { formatPrice } from "@/utils/format";

type Props = {
  product: Product;
  width: number;
  onPress: () => void;
};

export function ProductCard({ product, width, onPress }: Props) {
  const outOfStock = product.quantity <= 0;

  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]}>
      <Image
        source={product.imageUrl ? { uri: product.imageUrl } : undefined}
        style={styles.image}
        contentFit="contain"
        transition={150}
      />
      <View style={styles.body}>
        {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        {outOfStock ? <Text style={styles.outOfStock}>Out of stock</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    overflow: "hidden",
  },
  image: { width: "100%", height: 130, backgroundColor: "#F5F6F8" },
  body: { padding: 10, gap: 3 },
  brand: { fontSize: 12, color: "#878787", fontWeight: "600" },
  name: { fontSize: 14, color: "#212121", minHeight: 36 },
  price: { fontSize: 16, fontWeight: "700", color: "#212121" },
  outOfStock: { fontSize: 12, color: Brand.error, fontWeight: "600" },
});
