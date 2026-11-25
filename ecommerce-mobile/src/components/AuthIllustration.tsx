import { StyleSheet, Text, View } from "react-native";

import { LogoMark } from "@/components/Logo";
import { Brand } from "@/constants/theme";


export function AuthIllustration({ scale = 1 }: { scale?: number }) {
  return (
    <View style={{ width: 300 * scale, height: 220 * scale, alignItems: "center", justifyContent: "center" }}>
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <View style={[styles.blob, { left: 20, top: 150, width: 46, height: 46, borderRadius: 23, backgroundColor: "#D9F99D" }]} />
        <View style={[styles.blob, { left: 232, top: 14, width: 30, height: 30, borderRadius: 15, backgroundColor: "#BEF264" }]} />

        {/* phone */}
        <View style={styles.phone}>
          <View style={styles.notch} />
          <View style={styles.phoneLogo}>
            <LogoMark size={44} />
          </View>
          <View style={styles.field}>
            <View style={styles.dots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.field}>
            <View style={styles.dots}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.phoneButton} />
        </View>

        {/* floating items */}
        <Text style={[styles.float, { left: 14, top: 40, fontSize: 30 }]}>🛒</Text>
        <Text style={[styles.float, { left: 200, top: 4, fontSize: 24 }]}>🎁</Text>
        <Text style={[styles.float, { left: 6, top: 104, fontSize: 22 }]}>⭐</Text>

        {/* shopper */}
        <View style={styles.person}>
          <Text style={styles.bagInHand}>🛍️</Text>
          <View style={styles.hair} />
          <View style={styles.head} />
          <View style={styles.torso} />
          <View style={styles.legs}>
            <View style={styles.leg} />
            <View style={styles.leg} />
          </View>
        </View>
      </View>
    </View>
  );
}

const INK = "#27272A";

const styles = StyleSheet.create({
  canvas: { width: 300, height: 220 },
  blob: { position: "absolute" },
  phone: {
    position: "absolute",
    left: 62,
    top: 4,
    width: 128,
    height: 206,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 6,
    borderColor: "#E4E4E7",
    alignItems: "center",
    paddingTop: 8,
  },
  notch: { width: 40, height: 7, borderRadius: 4, backgroundColor: "#E4E4E7" },
  phoneLogo: { marginTop: 14, marginBottom: 14 },
  field: { width: 88, marginBottom: 12 },
  dots: { flexDirection: "row", gap: 4, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Brand.primary },
  line: { height: 1.5, backgroundColor: "#D4D4D8" },
  phoneButton: { alignSelf: "flex-end", marginRight: 20, marginTop: 4, width: 38, height: 14, borderRadius: 7, backgroundColor: Brand.accent },
  float: { position: "absolute" },
  person: { position: "absolute", left: 206, top: 52, width: 56, height: 160, alignItems: "center" },
  bagInHand: { position: "absolute", left: -26, top: 60, fontSize: 28, zIndex: 3 },
  hair: { position: "absolute", top: 0, width: 30, height: 18, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: INK, zIndex: 2 },
  head: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#F5C6A5", marginTop: 4 },
  torso: { width: 48, height: 64, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: Brand.accent, marginTop: 4 },
  legs: { flexDirection: "row", gap: 4, marginTop: -2 },
  leg: { width: 18, height: 56, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, backgroundColor: INK },
});
