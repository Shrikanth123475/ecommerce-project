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

const PAGE_SIZE = 5;

export default function OrdersScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<Order>>(null);
  const [page, setPage] = useState(1);
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
    // The backend returns newest first. Show 5 per page.
    const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const pageOrders = orders.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    const goTo = (next: number) => {
      setPage(next);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    return (
      <FlatList
        ref={listRef}
        data={pageOrders}
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
                  <Text style={styles.orderId}>Order #{order.orderNumber}</Text>
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
                {order.items.map((item) => `${item.productName}${item.size ? ` (${item.size})` : ""} × ${item.quantity}`).join(", ")}
              </Text>
              <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          pageCount > 1 ? (
            <View style={styles.pager}>
              <Text style={styles.pagerInfo}>
                Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, orders.length)} of {orders.length} orders
              </Text>
              <View style={styles.pagerRow}>
                <Pressable
                  style={[styles.pagerButton, current === 1 && styles.pagerDisabled]}
                  disabled={current === 1}
                  onPress={() => goTo(current - 1)}
                >
                  <Text style={styles.pagerButtonText}>‹ Prev</Text>
                </Pressable>
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === pageCount || Math.abs(n - current) <= 1)
                  .map((n, index, all) => (
                    <View key={n} style={styles.pagerRow}>
                      {index > 0 && n - all[index - 1] > 1 ? <Text style={styles.pagerDots}>…</Text> : null}
                      <Pressable style={[styles.pageNumber, n === current && styles.pageNumberActive]} onPress={() => goTo(n)}>
                        <Text style={[styles.pageNumberText, n === current && styles.pageNumberTextActive]}>{n}</Text>
                      </Pressable>
                    </View>
                  ))}
                <Pressable
                  style={[styles.pagerButton, current === pageCount && styles.pagerDisabled]}
                  disabled={current === pageCount}
                  onPress={() => goTo(current + 1)}
                >
                  <Text style={styles.pagerButtonText}>Next ›</Text>
                </Pressable>
              </View>
            </View>
          ) : undefined
        }
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
  pager: { alignItems: "center", gap: 10, paddingTop: 8, paddingBottom: 16 },
  pagerInfo: { fontSize: 12, color: "#71717A" },
  pagerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pagerButton: { paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  pagerDisabled: { opacity: 0.4 },
  pagerButtonText: { fontSize: 13, fontWeight: "700", color: "#18181B" },
  pagerDots: { color: "#71717A", marginHorizontal: 2 },
  pageNumber: { minWidth: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  pageNumberActive: { backgroundColor: Brand.accent, borderColor: Brand.accent },
  pageNumberText: { fontSize: 13, fontWeight: "700", color: "#18181B" },
  pageNumberTextActive: { color: Brand.onAccent },
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
