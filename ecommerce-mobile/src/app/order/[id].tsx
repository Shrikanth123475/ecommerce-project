import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ItemThumb } from "@/components/ItemThumb";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/services/api";
import { cancelOrder, getOrder, type Order } from "@/services/orderService";
import { confirmAction } from "@/utils/confirm";
import { formatDate, formatPrice } from "@/utils/format";

export default function OrderDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrder(id)
      .then((data) => !cancelled && setOrder(data))
      .catch((e) => !cancelled && setError(getErrorMessage(e, "Couldn't load this order.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const handleCancel = async () => {
    if (!order) return;
    const ok = await confirmAction("Cancel order?", `Order #${order.orderNumber} will be cancelled.`, "Cancel order");
    if (!ok) return;
    setCancelling(true);
    setError(null);
    try {
      setOrder(await cancelOrder(order.orderId));
    } catch (e) {
      toast.show(getErrorMessage(e, "Couldn't cancel this order."), "error");
    } finally {
      setCancelling(false);
    }
  };

  const title = order ? `Order #${order.orderNumber}` : "Order";

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title }} />
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title }} />
        <Text style={styles.message}>{error ?? "Order not found."}</Text>
        <View style={styles.retry}>
          <PrimaryButton title="Retry" onPress={() => setAttempt((n) => n + 1)} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title }} />

      {placed === "1" ? (
        <View style={styles.success}>
          <Text style={styles.successTitle}>Order placed successfully!</Text>
          <Text style={styles.successText}>Thank you for shopping with ShopEase.</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>Order #{order.orderNumber}</Text>
          <StatusBadge status={order.status} />
        </View>
        {order.orderDate ? <Text style={styles.muted}>Placed on {formatDate(order.orderDate)}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Items</Text>
        {order.items.map((item) => (
          <Pressable
            key={item.productId}
            style={styles.item}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(item.productId) } })}
          >
            <ItemThumb uri={item.imageUrl} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={styles.muted}>
                {formatPrice(item.price)} × {item.quantity}
              </Text>
              <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Payment summary</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={[styles.label, { color: "#388E3C" }]}>Free</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.total}>Total amount</Text>
          <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
        </View>
      </View>

      {user?.address ? (
        <View style={styles.card}>
          <Text style={styles.heading}>Delivery address</Text>
          <Text style={styles.label}>{user.name}</Text>
          <Text style={styles.muted}>{user.address}</Text>
        </View>
      ) : null}

      {order.status === "PLACED" ? (
        <View style={styles.cancel}>
          <PrimaryButton title="Cancel order" onPress={handleCancel} loading={cancelling} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F3F6" },
  content: { padding: 12, gap: 10, paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  retry: { marginTop: 16, alignSelf: "stretch" },
  success: { backgroundColor: "#E8F5E9", borderRadius: 8, padding: 14, gap: 2 },
  successTitle: { color: "#2E7D32", fontSize: 16, fontWeight: "700" },
  successText: { color: "#388E3C", fontSize: 14 },
  error: { backgroundColor: "#FDECEA", color: Brand.error, padding: 12, borderRadius: 8, fontSize: 14 },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 14, gap: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heading: { fontSize: 15, fontWeight: "700", color: "#212121" },
  muted: { fontSize: 13, color: "#60646C" },
  label: { fontSize: 14, color: "#212121" },
  item: { flexDirection: "row", gap: 12 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, color: "#212121" },
  itemTotal: { fontSize: 15, fontWeight: "700", color: "#212121" },
  total: { fontSize: 16, fontWeight: "700", color: "#212121" },
  cancel: { marginTop: 4 },
});
