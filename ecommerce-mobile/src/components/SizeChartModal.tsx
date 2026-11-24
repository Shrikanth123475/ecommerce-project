import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import type { SizeChart } from "@/utils/product";

type Props = {
  visible: boolean;
  chart: SizeChart;
  selected?: string | null;
  onClose: () => void;
};

export function SizeChartModal({ visible, chart, selected, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>Size chart</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={[styles.row, styles.headRow]}>
                {chart.columns.map((column) => (
                  <Text key={column} style={[styles.cell, styles.headCell]}>
                    {column}
                  </Text>
                ))}
              </View>
              {chart.rows.map((row) => (
                <View key={row[0]} style={[styles.row, row[0] === selected && styles.rowActive]}>
                  {row.map((value, i) => (
                    <Text key={chart.columns[i]} style={[styles.cell, i === 0 && styles.sizeCell]}>
                      {value}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.note}>Measurements are body measurements in inches. If you are between two sizes, we suggest the larger one.</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end", alignItems: "center" },
  sheet: { width: "100%", maxWidth: 560, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#D4D4D8", marginBottom: 14 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 20, fontWeight: "800", color: "#18181B" },
  close: { fontSize: 14, fontWeight: "700", color: Brand.primary },
  table: { borderRadius: 12, borderWidth: 1, borderColor: Brand.border, overflow: "hidden", minWidth: "100%" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F4F4F5" },
  headRow: { backgroundColor: Brand.surface },
  rowActive: { backgroundColor: "#ECFCCB" },
  cell: { flex: 1, minWidth: 90, paddingVertical: 12, paddingHorizontal: 12, fontSize: 14, color: "#27272A", textAlign: "center" },
  headCell: { fontWeight: "800", color: "#18181B", fontSize: 12 },
  sizeCell: { fontWeight: "800" },
  note: { fontSize: 12, color: "#71717A", marginTop: 12, lineHeight: 17 },
});
