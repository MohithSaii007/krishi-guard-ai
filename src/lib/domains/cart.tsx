import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartDomain = {
  name: string;
  price: number;
  renewalPrice: number;
  currency: string;
};

type CartContextValue = {
  items: CartDomain[];
  add: (item: CartDomain) => void;
  remove: (name: string) => void;
  clear: () => void;
  has: (name: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "krishi-domains-cart";

export function DomainCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartDomain[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved) as CartDomain[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    add: (item) => setItems((current) => current.some((entry) => entry.name === item.name) ? current : [...current, item]),
    remove: (name) => setItems((current) => current.filter((entry) => entry.name !== name)),
    clear: () => setItems([]),
    has: (name) => items.some((entry) => entry.name === name),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useDomainCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useDomainCart must be used within DomainCartProvider");
  return context;
}