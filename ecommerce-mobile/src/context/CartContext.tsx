import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { cartCount, getCart } from "@/services/cartService";

type CartValue = {
  count: number;
  /** Re-reads the cart from the server and updates the badge. */
  refresh: () => Promise<void>;
  /** Sets the badge directly when the caller already has the latest items. */
  setCount: (count: number) => void;
};

const CartContext = createContext<CartValue | null>(null);

// Keeps the number of items in the cart so the tab bar and header can show a badge.
export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }
    try {
      setCount(cartCount((await getCart()).items));
    } catch {
      // Keep the previous number if the request fails.
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = token ? await getCart().then((cart) => cartCount(cart.items)).catch(() => null) : 0;
      if (!cancelled && next !== null) setCount(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => ({ count, refresh, setCount }), [count, refresh]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
