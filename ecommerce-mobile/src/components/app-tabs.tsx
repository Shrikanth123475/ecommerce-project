import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CartBadge } from "@/components/CartBadge";
import { Brand } from "@/constants/theme";

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];
type IconName = keyof typeof Ionicons.glyphMap;

const TABS: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  home: { label: "Home", icon: "home-outline", iconActive: "home" },
  cart: { label: "Cart", icon: "bag-handle-outline", iconActive: "bag-handle" },
  orders: { label: "Orders", icon: "cube-outline", iconActive: "cube" },
  wishlist: { label: "Wishlist", icon: "heart-outline", iconActive: "heart" },
  profile: { label: "Profile", icon: "person-outline", iconActive: "person" },
};

// Floating pill bar: the active tab expands into a lime pill with its label.
function FloatingTabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              onPress={() => navigateToTab(route.key)}
              style={[styles.item, focused ? styles.itemActive : styles.itemIdle]}
            >
              <Ionicons name={focused ? tab.iconActive : tab.icon} size={22} color={focused ? Brand.onAccent : "#52525B"} />
              {focused ? <Text style={styles.label}>{tab.label}</Text> : null}
              {route.name === "cart" ? <CartBadge /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: "#fff", paddingTop: 8, paddingHorizontal: 14 },
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", maxWidth: 520, width: "100%", alignSelf: "center" },
  item: { height: 48, borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  itemIdle: { width: 48, backgroundColor: Brand.surface },
  itemActive: { backgroundColor: Brand.accent, paddingHorizontal: 18 },
  label: { fontSize: 14, fontWeight: "800", color: Brand.onAccent },
});
