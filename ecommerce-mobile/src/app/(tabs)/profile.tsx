import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/services/orderService";
import { confirmAction } from "@/utils/confirm";

function Tile({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

function MenuRow({ icon, label, detail, onPress }: { icon: string; label: string; detail?: string; onPress: () => void }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuText}>
        <Text style={styles.menuLabel}>{label}</Text>
        {detail ? <Text style={styles.menuDetail}>{detail}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !value && styles.infoEmpty]}>{value || "Not added"}</Text>
    </View>
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      getOrders()
        .then((orders) => setOrderCount(orders.length))
        .catch(() => {});
    }, []),
  );

  const handleLogout = async () => {
    const ok = await confirmAction("Log out?", "You will need to log in again.", "Log out", "Cancel");
    if (!ok) return;
    await signOut();
  };

  const fields = [user?.name, user?.phone, user?.gender, user?.dateOfBirth, user?.address, user?.city, user?.pincode];
  const filled = fields.filter((value) => Boolean(value && value.trim())).length;
  const completion = Math.round((filled / fields.length) * 100);

  const initial = (user?.name?.trim()?.[0] ?? "?").toUpperCase();
  const location = [user?.city, user?.pincode].filter(Boolean).join(" - ");

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerName} numberOfLines={1}>
              Hi, {user?.name}
            </Text>
            <Text style={styles.headerEmail} numberOfLines={1}>
              {user?.email}
            </Text>
            {user?.phone ? <Text style={styles.headerEmail}>+91 {user.phone}</Text> : null}
          </View>
          <Pressable style={styles.editPill} onPress={() => router.push("/edit-profile")}>
            <Text style={styles.editPillText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.tiles}>
          <Tile icon="📦" label={orderCount === null ? "Orders" : `Orders (${orderCount})`} onPress={() => router.navigate("/orders")} />
          <Tile icon="🛒" label="Cart" onPress={() => router.navigate("/cart")} />
          <Tile icon="✏️" label="Edit profile" onPress={() => router.push("/edit-profile")} />
        </View>

        {completion < 100 ? (
          <Pressable style={styles.card} onPress={() => router.push("/edit-profile")}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Complete your profile</Text>
              <Text style={styles.percent}>{completion}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${completion}%` }]} />
            </View>
            <Text style={styles.hint}>Add your mobile number and address for faster checkout.</Text>
          </Pressable>
        ) : null}

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Personal information</Text>
            <Pressable onPress={() => router.push("/edit-profile")} hitSlop={8}>
              <Text style={styles.edit}>EDIT</Text>
            </Pressable>
          </View>
          <View style={styles.infoList}>
            <InfoRow label="Full name" value={user?.name} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Mobile number" value={user?.phone} />
            <InfoRow label="Gender" value={user?.gender} />
            <InfoRow label="Date of birth" value={user?.dateOfBirth} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Delivery address</Text>
            <Pressable onPress={() => router.push("/edit-profile")} hitSlop={8}>
              <Text style={styles.edit}>{user?.address ? "CHANGE" : "ADD"}</Text>
            </Pressable>
          </View>
          {user?.address ? (
            <View style={styles.infoList}>
              <Text style={styles.infoValue}>{user.name}</Text>
              <Text style={styles.addressText}>{user.address}</Text>
              {location ? <Text style={styles.addressText}>{location}</Text> : null}
            </View>
          ) : (
            <Text style={styles.infoEmpty}>No address saved yet.</Text>
          )}
        </View>

        <View style={styles.card}>
          <MenuRow icon="📦" label="My Orders" detail="Track, cancel or view past orders" onPress={() => router.navigate("/orders")} />
          <View style={styles.divider} />
          <MenuRow icon="🛒" label="My Cart" detail="Items waiting for checkout" onPress={() => router.navigate("/cart")} />
          <View style={styles.divider} />
          <MenuRow icon="🏠" label="Continue shopping" onPress={() => router.navigate("/home")} />
        </View>

        <Pressable style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.primary },
  flex: { flex: 1, backgroundColor: "#F1F3F6" },
  content: { paddingBottom: 32, gap: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Brand.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  avatarText: { color: Brand.primary, fontSize: 26, fontWeight: "800" },
  headerText: { flex: 1 },
  headerName: { color: "#fff", fontSize: 19, fontWeight: "700" },
  headerEmail: { color: "#DCE8FF", fontSize: 13, marginTop: 2 },
  editPill: { borderWidth: 1, borderColor: "#fff", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  editPillText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  tiles: { flexDirection: "row", gap: 10, marginHorizontal: 12, marginTop: -18 },
  tile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tileIcon: { fontSize: 22 },
  tileLabel: { fontSize: 12, fontWeight: "600", color: "#212121" },
  card: { backgroundColor: "#fff", marginHorizontal: 12, borderRadius: 8, padding: 14, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#212121" },
  percent: { fontSize: 14, fontWeight: "700", color: Brand.primary },
  track: { height: 6, borderRadius: 3, backgroundColor: "#E3EEFF", overflow: "hidden" },
  fill: { height: 6, backgroundColor: Brand.primary },
  hint: { fontSize: 12, color: "#878787" },
  edit: { color: Brand.primary, fontSize: 13, fontWeight: "700" },
  infoList: { gap: 12 },
  infoRow: { gap: 2 },
  infoLabel: { fontSize: 12, color: "#878787" },
  infoValue: { fontSize: 15, color: "#212121" },
  infoEmpty: { color: "#9AA0AA", fontSize: 14 },
  addressText: { fontSize: 14, color: "#60646C", lineHeight: 20 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  menuIcon: { fontSize: 20 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, color: "#212121" },
  menuDetail: { fontSize: 12, color: "#878787", marginTop: 1 },
  chevron: { fontSize: 22, color: "#878787" },
  divider: { height: 1, backgroundColor: "#EEF0F4" },
  logout: {
    marginHorizontal: 12,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Brand.error,
    backgroundColor: "#fff",
  },
  logoutText: { color: Brand.error, fontSize: 16, fontWeight: "700" },
});
