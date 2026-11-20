import { NativeTabs } from "expo-router/native-tabs";

import { Brand } from "@/constants/theme";

const INACTIVE = "#60646C";

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#FFFFFF"
      indicatorColor="#E3EEFF"
      tintColor={Brand.primary}
      iconColor={{ default: INACTIVE, selected: Brand.primary }}
      labelStyle={{
        default: { color: INACTIVE },
        selected: { color: Brand.primary },
      }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Icon sf="cart.fill" md="shopping_cart" />
        <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Icon sf="shippingbox.fill" md="package_2" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
