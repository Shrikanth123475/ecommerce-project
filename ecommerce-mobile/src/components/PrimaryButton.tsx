import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { Brand } from "@/constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export function PrimaryButton({ title, onPress, loading = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, (pressed || loading) && styles.pressed]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Brand.accent,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  pressed: { opacity: 0.8 },
  text: { color: "#fff", fontSize: 16, fontWeight: "700", userSelect: "none" },
});
