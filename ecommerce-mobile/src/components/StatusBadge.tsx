import { StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  PLACED: { label: "Placed", color: "#388E3C" },
  CANCELLED: { label: "Cancelled", color: Brand.error },
};

export function StatusBadge({ status }: { status: string }) {
  const { label, color } = STATUS_STYLES[status] ?? { label: status, color: "#60646C" };
  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "700" },
});
