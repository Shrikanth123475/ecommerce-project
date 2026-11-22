import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";
import { registerDialogHandler, type DialogRequest } from "@/utils/confirm";

// One app-styled popup used for every alert / confirmation (instead of the browser's "localhost says" box).
export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogRequest | null>(null);

  useEffect(() => {
    registerDialogHandler(setDialog);
    return () => registerDialogHandler(null);
  }, []);

  const close = useCallback(
    (result: boolean) => {
      dialog?.resolve(result);
      setDialog(null);
    },
    [dialog],
  );

  return (
    <>
      {children}
      <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={() => close(false)}>
        <Pressable style={styles.backdrop} onPress={() => (dialog?.confirmLabel ? close(false) : close(true))}>
          {/* inner Pressable swallows taps so touching the card doesn't dismiss it */}
          <Pressable style={styles.card} onPress={() => {}}>
            <View style={[styles.iconBubble, dialog?.tone === "danger" ? styles.iconDanger : styles.iconInfo]}>
              <Text style={[styles.icon, dialog?.tone === "danger" ? styles.iconDangerText : styles.iconInfoText]}>
                {dialog?.tone === "danger" ? "!" : "i"}
              </Text>
            </View>
            <Text style={styles.title}>{dialog?.title}</Text>
            <Text style={styles.message}>{dialog?.message}</Text>
            <View style={styles.buttons}>
              {dialog?.confirmLabel ? (
                <>
                  <Pressable style={[styles.button, styles.secondary]} onPress={() => close(false)}>
                    <Text style={styles.secondaryText}>{dialog.cancelLabel}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, dialog.tone === "danger" ? styles.danger : styles.primary]}
                    onPress={() => close(true)}
                  >
                    <Text style={styles.primaryText}>{dialog.confirmLabel}</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={[styles.button, styles.primary]} onPress={() => close(true)}>
                  <Text style={styles.primaryText}>Got it</Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.55)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  iconBubble: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  iconInfo: { backgroundColor: "#E3EEFF" },
  iconDanger: { backgroundColor: "#FDECEA" },
  icon: { fontSize: 26, fontWeight: "800" },
  iconInfoText: { color: Brand.primary },
  iconDangerText: { color: Brand.error },
  title: { fontSize: 18, fontWeight: "800", color: "#212121", textAlign: "center" },
  message: { fontSize: 14, color: "#60646C", textAlign: "center", marginTop: 8, lineHeight: 20 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 22, alignSelf: "stretch" },
  button: { flex: 1, minHeight: 46, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: Brand.primary },
  danger: { backgroundColor: Brand.error },
  secondary: { borderWidth: 1, borderColor: Brand.border, backgroundColor: "#fff" },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryText: { color: "#212121", fontSize: 15, fontWeight: "600" },
});
