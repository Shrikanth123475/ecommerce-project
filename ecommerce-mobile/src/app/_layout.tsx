import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { Brand } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DialogProvider } from "@/context/DialogContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={Boolean(token)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: true, headerBackTitle: "Back", headerTintColor: Brand.primary }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ headerShown: true, headerBackTitle: "Back", headerTintColor: Brand.primary }}
        />
        <Stack.Screen
          name="order/[id]"
          options={{ headerShown: true, headerBackTitle: "Back", headerTintColor: Brand.primary }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <DialogProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RootNavigator />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </DialogProvider>
    </ToastProvider>
  );
}
