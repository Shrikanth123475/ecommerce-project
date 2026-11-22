import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Brand } from "@/constants/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9AA0AA"
          autoCapitalize="none"
          secureTextEntry={isPassword && hidden}
          {...rest}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden((value) => !value)} hitSlop={8}>
            <Text style={styles.toggle}>{hidden ? "Show" : "Hide"}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, color: "#60646C", marginBottom: 6, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 8,
    backgroundColor: "#FAFBFC",
    paddingHorizontal: 12,
  },
  inputError: { borderColor: Brand.error },
  input: { flex: 1, fontSize: 16, paddingVertical: 12, color: "#111" },
  toggle: { color: Brand.primary, fontWeight: "600", fontSize: 14 },
  error: { color: Brand.error, fontSize: 12, marginTop: 4 },
});
