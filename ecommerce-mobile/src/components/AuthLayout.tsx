import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "@/components/Logo";
import { Brand } from "@/constants/theme";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const PERKS = ["🚚 Free delivery", "🔒 Secure login", "↩️ Easy cancellation"];

export function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Logo size={58} light tagline />
            <View style={styles.perks}>
              {PERKS.map((perk) => (
                <Text key={perk} style={styles.perk}>
                  {perk}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              <View style={styles.form}>{children}</View>
            </View>
            <Text style={styles.footnote}>By continuing, you agree to ShopEase&apos;s Terms of Use and Privacy Policy.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.primary },
  flex: { flex: 1, backgroundColor: Brand.primary },
  scroll: { flexGrow: 1, backgroundColor: Brand.primary },
  hero: {
    backgroundColor: Brand.primary,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 16,
    gap: 18,
  },
  perks: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 14 },
  perk: { color: "#DCE8FF", fontSize: 12, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 16, paddingBottom: 32, alignItems: "center", gap: 16 },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#212121" },
  subtitle: { fontSize: 14, color: "#60646C", marginTop: 6, lineHeight: 20 },
  form: { marginTop: 22 },
  footnote: { fontSize: 11, color: "#DCE8FF", textAlign: "center", maxWidth: 360 },
});
