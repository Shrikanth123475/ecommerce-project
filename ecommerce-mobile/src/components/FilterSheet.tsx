import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PriceSlider } from "@/components/PriceSlider";
import { Brand } from "@/constants/theme";
import type { SortOption } from "@/services/productService";

type Props = {
  visible: boolean;
  onClose: () => void;
  brands: string[];
  brand: string;
  onBrand: (value: string) => void;
  sort: SortOption;
  onSort: (value: SortOption) => void;
  /** Price range available for the current section, and the selected range. */
  priceMin: number;
  priceMax: number;
  priceLow: number;
  priceHigh: number;
  onPrice: (low: number, high: number) => void;
};

const SORTS: { value: SortOption; label: string }[] = [
  { value: "", label: "Relevance" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function FilterSheet({ visible, onClose, brands, brand, onBrand, sort, onSort, priceMin, priceMax, priceLow, priceHigh, onPrice }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filter &amp; sort</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.section}>Sort by</Text>
            <View style={styles.chips}>
              {SORTS.map((option) => (
                <Chip key={option.label} label={option.label} active={sort === option.value} onPress={() => onSort(option.value)} />
              ))}
            </View>
            {priceMax > priceMin ? (
              <>
                <Text style={styles.section}>Price range</Text>
                <PriceSlider min={priceMin} max={priceMax} low={priceLow} high={priceHigh} onChange={onPrice} />
              </>
            ) : null}
            <Text style={styles.section}>Brand</Text>
            <View style={styles.chips}>
              <Chip label="All brands" active={brand === ""} onPress={() => onBrand("")} />
              {brands.map((value) => (
                <Chip key={value} label={value} active={brand === value} onPress={() => onBrand(value)} />
              ))}
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <Pressable
              style={styles.reset}
              onPress={() => {
                onBrand("");
                onSort("");
                onPrice(priceMin, priceMax);
              }}
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.apply} onPress={onClose}>
              <Text style={styles.applyText}>Show results</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end", alignItems: "center" },
  sheet: { width: "100%", maxWidth: 520, maxHeight: "75%", backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#D4D4D8", marginBottom: 14 },
  title: { fontSize: 20, fontWeight: "800", color: "#18181B", marginBottom: 4 },
  section: { fontSize: 14, fontWeight: "700", color: "#52525B", marginTop: 16, marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: Brand.surface },
  chipActive: { backgroundColor: Brand.primary },
  chipText: { fontSize: 13, color: "#27272A", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  actions: { flexDirection: "row", gap: 12, marginTop: 20 },
  reset: { flex: 1, minHeight: 50, borderRadius: 26, borderWidth: 1, borderColor: Brand.border, alignItems: "center", justifyContent: "center" },
  resetText: { fontSize: 15, fontWeight: "700", color: "#18181B" },
  apply: { flex: 1.6, minHeight: 50, borderRadius: 26, backgroundColor: Brand.accent, alignItems: "center", justifyContent: "center" },
  applyText: { fontSize: 15, fontWeight: "800", color: Brand.onAccent },
});
