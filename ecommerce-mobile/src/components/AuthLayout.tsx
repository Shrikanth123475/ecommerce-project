import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthIllustration } from "@/components/AuthIllustration";
import { Logo } from "@/components/Logo";
import { useResponsive } from "@/hooks/use-responsive";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Smaller illustration for longer forms (sign up) on phones. */
  compact?: boolean;
};

export function AuthLayout({ title, subtitle, children, compact = false }: Props) {
  const { isDesktop } = useResponsive();

  const form = (
    <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.form}>{children}</View>
      <Text style={styles.footnote}>By continuing, you agree to ShopEase&apos;s Terms of Use and Privacy Policy.</Text>
    </View>
  );

  // Laptop / wide window: split screen. Illustration fills the left half, the form is centred on the right.
  if (isDesktop) {
    return (
      <View style={styles.split}>
        <View style={styles.splitLeft}>
          <Logo size={56} />
          <AuthIllustration scale={1.5} />
          <Text style={styles.leftTitle}>Shopping made simple</Text>
          <Text style={styles.leftText}>Browse, order and track everything in one place.</Text>
        </View>
        <KeyboardAvoidingView style={styles.splitRight}>
          <ScrollView contentContainerStyle={styles.splitScroll} keyboardShouldPersistTaps="handled">
            {form}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Phone: illustration on top, form below.
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.panel, compact && styles.panelCompact]}>
            <Logo size={compact ? 34 : 40} />
            <AuthIllustration scale={compact ? 0.62 : 0.9} />
          </View>
          {form}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  panel: {
    backgroundColor: "#EEF3E3",
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 14,
    gap: 6,
  },
  panelCompact: { paddingTop: 14, paddingBottom: 8, gap: 0 },
  body: { width: "100%", alignSelf: "center", paddingHorizontal: 28, paddingTop: 26, paddingBottom: 32 },
  bodyDesktop: { maxWidth: 480, paddingHorizontal: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#18181B" },
  subtitle: { fontSize: 14, color: "#71717A", marginTop: 4, lineHeight: 20 },
  form: { marginTop: 22 },
  footnote: { fontSize: 11, color: "#A1A1AA", textAlign: "center", marginTop: 20 },

  split: { flex: 1, flexDirection: "row", backgroundColor: "#fff" },
  splitLeft: { flex: 1, backgroundColor: "#EEF3E3", alignItems: "center", justifyContent: "center", gap: 18, padding: 32 },
  splitRight: { flex: 1, backgroundColor: "#E4F0D3" },
  splitScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 32 },
  leftTitle: { fontSize: 26, fontWeight: "800", color: "#18181B", marginTop: 8 },
  leftText: { fontSize: 15, color: "#52525B", textAlign: "center" },
});
