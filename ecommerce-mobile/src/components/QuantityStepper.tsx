import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";

type Props = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
};

export function QuantityStepper({ quantity, onIncrement, onDecrement, disabled = false }: Props) {
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <Pressable onPress={onDecrement} disabled={disabled} style={styles.button} hitSlop={6}>
        <Text style={styles.symbol}>−</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable onPress={onIncrement} disabled={disabled} style={styles.button} hitSlop={6}>
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  disabled: { opacity: 0.5 },
  button: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  symbol: { fontSize: 18, color: "#212121", lineHeight: 20 },
  quantity: { minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: "600", color: "#212121" },
});
