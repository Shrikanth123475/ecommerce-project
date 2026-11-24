import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";

type WishlistValue = {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);

// Favourites are saved on the device, separately for each logged-in user.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = user ? `wishlist:${user.id}` : null;
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = key ? await AsyncStorage.getItem(key) : null;
      if (!cancelled) setIds(stored ? JSON.parse(stored) : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const toggle = useCallback(
    (id: number) => {
      setIds((current) => {
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
        if (key) AsyncStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const value = useMemo(() => ({ ids, has: (id: number) => ids.includes(id), toggle }), [ids, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
