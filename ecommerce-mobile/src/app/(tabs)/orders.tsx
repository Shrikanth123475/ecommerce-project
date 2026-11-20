import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ItemThumb } from "@/components/ItemThumb";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { Brand } from "@/constants/theme";
import { getErrorMessage } from "@/services/api";
import { getOrders, type Order } from "@/services/orderService";
import { formatDate, formatPrice } from "@/utils/format";

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    try {
      setOrders(await getOrders());
      setError(null);
      hasLoaded.current = true;
    } catch (e) {
      setError(getErrorMessage(e, "Couldn't load your orders."));
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

  const renderBody = () => {
    if (loading) {
      return <ActivityIndicator style={styles.center} size="large" color={Brand.primary} />;
    }
    if (!orders) {
      return (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
          <View style={styles.retry}>
            <PrimaryButton title="Retry" onPress={() => load()} />
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={orders}
        keyExtractor={(order) => String(order.orderId)}
        contentContainerStyle={orders.length ? styles.list : styles.emptyList}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        renderItem={({ item: order }) => {
          const shown = order.items.slice(0, 3);
          const extra = order.items.length - shown.length;
          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push({ pathname: "/order/[id]", params: { id: String(order.orderId) } })}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.orderId}</Text>
                  <Text style={styles.date}>{formatDate(order.orderDate)}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>
              <View style={styles.thumbs}>
                {shown.map((item) => (
                  <ItemThumb key={item.productId} uri={item.imageUrl} size={56} />
                ))}
                {extra > 0 ? <Text style={styles.extra}>+{extra} more</Text> : null}
              </View>
              <Text style={styles.names} numberOfLines={2}>
                {order.items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")}
              </Text>
              <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.message}>When you place an order, it will show up here.</Text>
            <View style={styles.retry}>
              <PrimaryButton title="Start shopping" onPress={() => router.navigate("/home")} />
            </View>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F3F6" },
  header: { backgroundColor: Brand.primary, paddingHorizontal: 16, paddingVertical: 14 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  message: { color: "#60646C", fontSize: 15, textAlign: "center" },
  retry: { marginTop: 16, alignSelf: "stretch" },
  list: { padding: 12, gap: 10 },
  emptyList: { flexGrow: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 6 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#212121" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 12, gap: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 15, fontWeight: "700", color: "#212121" },
  date: { fontSize: 12, color: "#878787", marginTop: 2 },
  thumbs: { flexDirection: "row", alignItems: "center", gap: 8 },
  extra: { fontSize: 13, color: "#60646C", fontWeight: "600" },
  names: { fontSize: 13, color: "#60646C" },
  total: { fontSize: 17, fontWeight: "800", color: "#212121" },
});
