import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { Brand } from "@/constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  /** "dark" = black pill (login), default = lime pill */
  tone?: "lime" | "dark";
};

export function PrimaryButton({ title, onPress, loading = false, tone = "lime" }: Props) {
  const dark = tone === "dark";
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: dark ? Brand.primary : Brand.accent },
        (pressed || loading) && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={dark ? "#fff" : Brand.onAccent} />
      ) : (
        <Text style={[styles.text, { color: dark ? "#fff" : Brand.onAccent }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  pressed: { opacity: 0.8 },
  text: { fontSize: 16, fontWeight: "800", userSelect: "none" },
});
