import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ItemThumb } from "@/components/ItemThumb";
import { PrimaryButton } from "@/components/PrimaryButton";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import {
  cartCount,
  cartTotal,
  decrementItem,
  getCart,
  incrementItem,
  removeItem,
  type Cart,
  type CartItem,
} from "@/services/cartService";
import { placeOrder } from "@/services/orderService";
import { formatPrice } from "@/utils/format";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const hasLoaded = useRef(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    try {
      setCart(await getCart());
      setError(null);
      hasLoaded.current = true;
    } catch (e) {
      setError(getErrorMessage(e, "Couldn't load your cart."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const change = async (item: CartItem, action: (id: number) => Promise<void>) => {
    setBusyId(item.cartItemId);
    setError(null);
    try {
      await action(item.cartItemId);
      setCart(await getCart());
    } catch (e) {
      setError(getErrorMessage(e, "Couldn't update your cart."));
    } finally {
      setBusyId(null);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      const order = await placeOrder();
      setCart((current) => (current ? { ...current, items: [] } : current));
      router.push({ pathname: "/order/[id]", params: { id: String(order.orderId), placed: "1" } });
    } catch (e) {
      setError(getErrorMessage(e, "Couldn't place your order."));
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items ?? [];

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <ActivityIndicator style={styles.center} size="large" color={Brand.primary} />
      </SafeAreaView>
    );
  }

  if (!cart) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
          <View style={styles.retry}>
            <PrimaryButton title="Retry" onPress={() => load()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart{items.length ? ` (${cartCount(items)})` : ""}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.cartItemId)}
        contentContainerStyle={items.length ? styles.list : styles.emptyList}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        ListHeaderComponent={
          items.length ? (
            <View style={styles.address}>
              <Text style={styles.addressLabel}>Deliver to</Text>
              <Text style={styles.addressText}>
                {user?.name}
                {user?.address ? `, ${user.address}` : " (no address saved)"}
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(item.productId) } })}
            >
              <ItemThumb uri={item.imageUrl} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </View>
            </Pressable>
            <View style={styles.actions}>
              <QuantityStepper
                quantity={item.quantity}
                disabled={busyId === item.cartItemId}
                onIncrement={() => change(item, incrementItem)}
                onDecrement={() => change(item, decrementItem)}
              />
              <Pressable onPress={() => change(item, removeItem)} disabled={busyId === item.cartItemId} hitSlop={8}>
                <Text style={styles.remove}>REMOVE</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          items.length ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Price details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Price ({cartCount(items)} items)</Text>
                <Text style={styles.priceValue}>{formatPrice(cartTotal(items))}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery</Text>
                <Text style={[styles.priceValue, { color: "#388E3C" }]}>Free</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total amount</Text>
                <Text style={styles.totalValue}>{formatPrice(cartTotal(items))}</Text>
              </View>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.message}>Add items to it now.</Text>
            <View style={styles.retry}>
              <PrimaryButton title="Shop now" onPress={() => router.navigate("/home")} />
            </View>
          </View>
        }
      />

      {items.length ? (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTotal}>{formatPrice(cartTotal(items))}</Text>
            <Text style={styles.footerHint}>Total</Text>
          </View>
          <View style={styles.footerButton}>
            <PrimaryButton title="Place Order" onPress={handlePlaceOrder} loading={placing} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F3F6" },
  header: { backgroundColor: Brand.primary, paddingHorizontal: 16, paddingVertical: 14 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  error: { backgroundColor: "#FDECEA", color: Brand.error, padding: 12, fontSize: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  retry: { marginTop: 16, alignSelf: "stretch" },
  list: { padding: 12, gap: 10 },
  emptyList: { flexGrow: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 6 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#212121" },
  address: { backgroundColor: "#fff", borderRadius: 8, padding: 12 },
  addressLabel: { fontSize: 12, color: "#878787", marginBottom: 2 },
  addressText: { fontSize: 14, color: "#212121" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 12, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  info: { flex: 1, gap: 6 },
  name: { fontSize: 15, color: "#212121" },
  price: { fontSize: 17, fontWeight: "700", color: "#212121" },
  actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  remove: { color: "#60646C", fontSize: 13, fontWeight: "700" },
  sectionTitle: { fontSize: 14, color: "#878787", fontWeight: "700" },
  priceRow: { flexDirection: "row", justifyContent: "space-between" },
  priceLabel: { fontSize: 14, color: "#212121" },
  priceValue: { fontSize: 14, color: "#212121" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#EEF0F4", paddingTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#212121" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#212121" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF0F4",
  },
  footerTotal: { fontSize: 18, fontWeight: "800", color: "#212121" },
  footerHint: { fontSize: 12, color: "#878787" },
  footerButton: { width: 180 },
});
