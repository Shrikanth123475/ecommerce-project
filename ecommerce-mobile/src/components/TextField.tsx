import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Brand } from "@/constants/theme";

// Web only: Chrome paints a square white box over autofilled inputs and a square outline on focus,
// which looks wrong inside a rounded field. Make both follow the field's rounded shape.
if (Platform.OS === "web" && typeof document !== "undefined" && !document.getElementById("shopease-input-fix")) {
  const tag = document.createElement("style");
  tag.id = "shopease-input-fix";
  tag.textContent = `
    input, textarea { outline: none !important; background: transparent !important; }
    input:-webkit-autofill, input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
      -webkit-text-fill-color: #111 !important;
      border-radius: 26px;
      caret-color: #111;
    }`;
  document.head.appendChild(tag);
}

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, rest.multiline && styles.multiline, focused && styles.inputFocused, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9AA0AA"
          autoCapitalize="none"
          secureTextEntry={isPassword && hidden}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
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
  label: { fontSize: 13, color: "#60646C", marginBottom: 6, marginLeft: 8, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 26,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    overflow: "hidden",
  },
  multiline: { borderRadius: 18, alignItems: "flex-start" },
  inputFocused: { borderColor: Brand.primary, borderWidth: 1.5 },
  inputError: { borderColor: Brand.error },
  input: { flex: 1, fontSize: 16, paddingVertical: 12, color: "#111" },
  toggle: { color: Brand.primary, fontWeight: "700", fontSize: 14 },
  error: { color: Brand.error, fontSize: 12, marginTop: 4, marginLeft: 8 },
});
