import { TabList, TabSlot, Tabs, TabTrigger, type TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/theme";

const TABS = [
  { name: "home", href: "/home", label: "Home" },
  { name: "cart", href: "/cart", label: "Cart" },
  { name: "orders", href: "/orders", label: "Orders" },
  { name: "profile", href: "/profile", label: "Profile" },
] as const;

export default function AppTabs() {
  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={styles.tabList}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <TabButton>{tab.label}</TabButton>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={styles.tabButton}>
      <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
      <Text style={[styles.label, isFocused && styles.labelActive]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  slot: { flex: 1 },
  tabList: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  tabButton: { flex: 1, alignItems: "center", paddingBottom: 12 },
  indicator: { height: 3, alignSelf: "stretch", backgroundColor: "transparent", marginBottom: 10 },
  indicatorActive: { backgroundColor: Brand.primary },
  label: { fontSize: 13, color: "#60646C", fontWeight: "600" },
  labelActive: { color: Brand.primary },
});
