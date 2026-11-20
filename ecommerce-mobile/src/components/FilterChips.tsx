import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { Brand } from "@/constants/theme";

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  allLabel: string;
};

export function FilterChips({ options, selected, onSelect, allLabel }: Props) {
  const items = [{ value: "", label: allLabel }, ...options.map((value) => ({ value, label: value }))];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <Pressable
            key={item.value || "all"}
            onPress={() => onSelect(item.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  label: { fontSize: 13, color: "#333", fontWeight: "500" },
  labelActive: { color: "#fff" },
});
