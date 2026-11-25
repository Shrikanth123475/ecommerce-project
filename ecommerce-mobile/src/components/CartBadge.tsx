import { StyleSheet, Text, View } from "react-native";

import { useCart } from "@/context/CartContext";

// Small red bubble with the number of items in the cart, like Flipkart / Amazon.
export function CartBadge() {
  const { count } = useCart();
  if (count <= 0) return null;
  return (
    <View style={styles.badge} pointerEvents="none">
      <Text style={styles.text}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
