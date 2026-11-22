import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "info";

type ToastState = { message: string; type: ToastType };

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const COLORS: Record<ToastType, string> = {
  success: "#2E7D32",
  error: "#D32F2F",
  info: "#323232",
};

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

const useNativeDriver = Platform.OS !== "web";

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [progress] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver }).start(({ finished }) => {
      // If a newer toast interrupted this animation, keep it on screen.
      if (finished) setToast(null);
    });
  }, [progress]);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type });
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 200, useNativeDriver }).start();
      timer.current = setTimeout(hide, type === "error" ? 4000 : 2500);
    },
    [hide, progress],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.wrap,
              {
                top: insets.top + 8,
                opacity: progress,
                transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
              },
            ]}
          >
            <Pressable onPress={hide} style={[styles.toast, { backgroundColor: COLORS[toast.type] }]}>
              <View style={styles.iconBubble}>
                <Text style={styles.icon}>{ICONS[toast.type]}</Text>
              </View>
              <Text style={styles.message}>{toast.message}</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wrap: { position: "absolute", left: 16, right: 16, zIndex: 1000, elevation: 10, alignItems: "center" },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: 480,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  iconBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { color: "#fff", fontSize: 13, fontWeight: "800" },
  message: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600" },
});
