import { StyleSheet, Text, View } from "react-native";

const INK = "#1C1C1E";
const LIME = "#A3E635";
const LIME_DARK = "#65A30D";

// ShopEase logo mark drawn with Views (no image): a smiling shopping bag on a rounded badge.
export function LogoMark({ size = 44 }: { size?: number }) {
  const bagW = size * 0.54;
  const bagH = size * 0.44;
  const handleW = bagW * 0.52;
  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <View
        style={{
          width: handleW,
          height: bagH * 0.6,
          borderWidth: Math.max(2, size * 0.055),
          borderBottomWidth: 0,
          borderColor: INK,
          borderTopLeftRadius: handleW / 2,
          borderTopRightRadius: handleW / 2,
          marginBottom: -bagH * 0.22,
        }}
      />
      <View style={[styles.bag, { width: bagW, height: bagH, borderRadius: size * 0.08 }]}>
        <View style={[styles.eyes, { gap: bagW * 0.22, marginBottom: bagH * 0.05 }]}>
          <View style={[styles.dot, { width: size * 0.06, height: size * 0.06 }]} />
          <View style={[styles.dot, { width: size * 0.06, height: size * 0.06 }]} />
        </View>
        <View
          style={{
            width: bagW * 0.5,
            height: bagH * 0.24,
            borderBottomWidth: Math.max(2, size * 0.05),
            borderColor: LIME,
            borderBottomLeftRadius: bagW,
            borderBottomRightRadius: bagW,
          }}
        />
      </View>
      <View
        style={[
          styles.spark,
          { width: size * 0.13, height: size * 0.13, borderRadius: size * 0.065, top: size * 0.12, right: size * 0.1 },
        ]}
      />
    </View>
  );
}

// Mark + "ShopEase" wordmark (+ optional tagline). `light` = white text for the blue headers.
export function Logo({ size = 56, light = false, tagline = false }: { size?: number; light?: boolean; tagline?: boolean }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} />
      <View>
        <Text style={[styles.name, { fontSize: size * 0.62, color: light ? "#fff" : INK }]}>
          Shop<Text style={{ color: light ? LIME : LIME_DARK }}>Ease</Text>
        </Text>
        {tagline ? (
          <Text style={[styles.tagline, { fontSize: Math.max(9, size * 0.16), color: light ? "#D4D4D8" : "#71717A" }]}>
            SHOPPING MADE SIMPLE
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  bag: { backgroundColor: INK, alignItems: "center", justifyContent: "center" },
  eyes: { flexDirection: "row" },
  dot: { borderRadius: 10, backgroundColor: LIME },
  spark: { position: "absolute", backgroundColor: LIME },
  name: { fontWeight: "900", letterSpacing: 0.3 },
  tagline: { fontWeight: "600", letterSpacing: 2, marginTop: 1 },
});
