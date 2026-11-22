import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import type { Product } from "@/services/productService";
import { formatPrice } from "@/utils/format";

// Only offers that are really true in the app are advertised here.
const OFFERS = [
  { icon: "🚚", title: "Free delivery", text: "On every order, no minimum", color: "#E8F5E9", accent: "#2E7D32" },
  { icon: "⭐", title: "Best deals", text: "Top picks at great prices", color: "#FFF3E0", accent: "#E65100" },
  { icon: "↩️", title: "Easy cancellation", text: "Cancel placed orders anytime", color: "#E3EEFF", accent: Brand.primary },
];

type Props = {
  products: Product[];
};

export function HomeHighlights({ products }: Props) {
  const router = useRouter();

  const deals = products
    .filter((product) => product.quantity > 0 && product.quantity <= 10)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 8);

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {OFFERS.map((offer) => (
          <View key={offer.title} style={[styles.offer, { backgroundColor: offer.color }]}>
            <Text style={styles.offerIcon}>{offer.icon}</Text>
            <View>
              <Text style={[styles.offerTitle, { color: offer.accent }]}>{offer.title}</Text>
              <Text style={styles.offerText}>{offer.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {deals.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Best deals – selling fast</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {deals.map((product) => (
              <Pressable
                key={product.id}
                style={styles.deal}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(product.id) } })}
              >
                <Image
                  source={product.imageUrl ? { uri: product.imageUrl } : undefined}
                  style={styles.dealImage}
                  contentFit="contain"
                />
                <Text style={styles.dealName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.dealPrice}>{formatPrice(product.price)}</Text>
                <Text style={styles.dealStock}>Only {product.quantity} left</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Text style={[styles.sectionTitle, styles.allTitle]}>All products</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: -16, gap: 14, paddingBottom: 6 },
  row: { paddingHorizontal: 16, gap: 10 },
  offer: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, width: 230 },
  offerIcon: { fontSize: 28 },
  offerTitle: { fontSize: 15, fontWeight: "800" },
  offerText: { fontSize: 12, color: "#424242", marginTop: 2 },
  section: { gap: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#212121" },
  allTitle: { paddingHorizontal: 16 },
  deal: { width: 140, backgroundColor: "#fff", borderRadius: 8, padding: 10, gap: 3, borderWidth: 1, borderColor: "#EEF0F4" },
  dealImage: { width: "100%", height: 90, backgroundColor: "#F5F6F8", borderRadius: 6 },
  dealName: { fontSize: 13, color: "#212121", marginTop: 4 },
  dealPrice: { fontSize: 14, fontWeight: "700", color: "#212121" },
  dealStock: { fontSize: 12, fontWeight: "700", color: "#E65100" },
});
