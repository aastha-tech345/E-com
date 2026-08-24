import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { productService } from "@/services";
import type { Address, CartLine, ChatMessage, Product } from "@/types";

interface User {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  recentSearches: string[];
  user: User | null;
  admin: User | null;
  tokens: AuthTokens | null;
  addresses: Address[];
  chat: ChatMessage[];
  coupon: string | null;
}

const EMPTY: ShopState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  recentSearches: [],
  user: null,
  admin: null,
  tokens: null,
  addresses: [
    {
      id: "AD1",
      name: "Aastha Sharma",
      phone: "+91 98765 43210",
      line1: "402, Sunrise Apartments, 12th Main",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      type: "home",
    },
  ],
  chat: [],
  coupon: null,
};

const KEY = "shopnest-state-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCartLine(value: unknown): value is CartLine {
  return (
    isRecord(value) &&
    typeof value["productId"] === "string" &&
    typeof value["quantity"] === "number" &&
    Number.isFinite(value["quantity"])
  );
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    typeof value["id"] === "string" &&
    (value["role"] === "user" || value["role"] === "assistant") &&
    typeof value["text"] === "string"
  );
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeStoredState(value: unknown): ShopState {
  if (!isRecord(value)) return EMPTY;

  return {
    ...EMPTY,
    cart: Array.isArray(value["cart"]) ? value["cart"].filter(isCartLine) : EMPTY.cart,
    wishlist: stringArray(value["wishlist"]),
    recentlyViewed: stringArray(value["recentlyViewed"]).slice(0, 12),
    recentSearches: stringArray(value["recentSearches"]).slice(0, 6),
    user: isRecord(value["user"]) ? (value["user"] as ShopState["user"]) : EMPTY.user,
    admin: isRecord(value["admin"]) ? (value["admin"] as ShopState["admin"]) : EMPTY.admin,
    addresses: Array.isArray(value["addresses"]) ? (value["addresses"] as Address[]) : EMPTY.addresses,
    chat: Array.isArray(value["chat"]) ? value["chat"].filter(isChatMessage) : EMPTY.chat,
    coupon: typeof value["coupon"] === "string" ? value["coupon"] : EMPTY.coupon,
  };
}

interface ShopContextValue extends ShopState {
  hydrated: boolean;
  cartProducts: { product: Product; line: CartLine }[];
  cartCount: number;
  totals: { subtotal: number; discount: number; shipping: number; total: number };
  addToCart: (productId: string, quantity?: number, opts?: { color?: string; size?: string }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  markViewed: (productId: string) => void;
  addRecentSearch: (term: string) => void;
  applyCoupon: (code: string) => void;
  setUser: (user: User | null, tokens?: AuthTokens) => void;
  logout: () => void;
  setAdmin: (admin: User | null, tokens?: AuthTokens) => void;
  adminLogout: () => void;
  addAddress: (address: Address) => void;
  pushChat: (message: ChatMessage) => void;
  resetChat: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(normalizeStoredState(JSON.parse(raw)));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: ShopState) => ShopState) => setState(fn), []);

  const addToCart: ShopContextValue["addToCart"] = useCallback(
    (productId, quantity = 1, opts) => {
      patch((s) => {
        const existing = s.cart.find((l) => l.productId === productId);
        const cart = existing
          ? s.cart.map((l) =>
              l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
            )
          : [
              ...s.cart,
              {
                productId,
                quantity,
                ...(opts?.color ? { color: opts.color } : {}),
                ...(opts?.size ? { size: opts.size } : {}),
              },
            ];
        return { ...s, cart };
      });
      toast.success("Added to cart");
    },
    [patch],
  );

  const value = useMemo<ShopContextValue>(() => {
    const cartProducts = state.cart
      .map((line) => {
        const product = productService.byId(line.productId);
        return product ? { product, line } : null;
      })
      .filter(Boolean) as { product: Product; line: CartLine }[];

    const subtotal = cartProducts.reduce(
      (sum, { product, line }) => sum + product.price * line.quantity,
      0,
    );
    const couponDiscount = state.coupon === "WELCOME10" ? Math.round(subtotal * 0.1)
      : state.coupon === "FLAT500" && subtotal >= 2999 ? 500
      : state.coupon === "BIGSALE25" && subtotal >= 4999 ? Math.round(subtotal * 0.25)
      : 0;
    const shipping = subtotal === 0 || subtotal > 999 ? 0 : 49;

    return {
      ...state,
      hydrated,
      cartProducts,
      cartCount: state.cart.reduce((n, l) => n + l.quantity, 0),
      totals: {
        subtotal,
        discount: couponDiscount,
        shipping,
        total: Math.max(0, subtotal - couponDiscount + shipping),
      },
      addToCart,
      updateQuantity: (productId, quantity) =>
        patch((s) => ({
          ...s,
          cart:
            quantity <= 0
              ? s.cart.filter((l) => l.productId !== productId)
              : s.cart.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        })),
      removeFromCart: (productId) => {
        patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== productId) }));
        toast.success("Removed from cart");
      },
      clearCart: () => patch((s) => ({ ...s, cart: [], coupon: null })),
      toggleWishlist: (productId) => {
        patch((s) => {
          const has = s.wishlist.includes(productId);
          toast.success(has ? "Removed from wishlist" : "Added to wishlist");
          return {
            ...s,
            wishlist: has
              ? s.wishlist.filter((id) => id !== productId)
              : [productId, ...s.wishlist],
          };
        });
        return !state.wishlist.includes(productId);
      },
      isWishlisted: (productId) => state.wishlist.includes(productId),
      markViewed: (productId) =>
        patch((s) => ({
          ...s,
          recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 12),
        })),
      addRecentSearch: (term) =>
        patch((s) => ({
          ...s,
          recentSearches: term.trim()
            ? [term.trim(), ...s.recentSearches.filter((t) => t !== term.trim())].slice(0, 6)
            : s.recentSearches,
        })),
      applyCoupon: (code) => {
        const valid = ["WELCOME10", "FLAT500", "BIGSALE25"].includes(code.toUpperCase());
        patch((s) => ({ ...s, coupon: valid ? code.toUpperCase() : null }));
        if (valid) toast.success(`Coupon ${code.toUpperCase()} applied`);
        else toast.error("Invalid coupon code");
      },
      setUser: (user, tokens) => {
        patch((s) => ({ ...s, user, tokens: tokens || null }));
        if (user) toast.success("Login successful");
      },
      logout: () => {
        patch((s) => ({ ...s, user: null, tokens: null }));
        localStorage.removeItem("authTokens");
        toast.success("Logged out");
      },
      setAdmin: (admin, tokens) => {
        patch((s) => ({ ...s, admin, tokens: tokens || null }));
        if (admin) toast.success("Admin login successful");
      },
      adminLogout: () => {
        patch((s) => ({ ...s, admin: null, tokens: null }));
        localStorage.removeItem("authTokens");
      },
      addAddress: (address) =>
        patch((s) => ({ ...s, addresses: [...s.addresses, { ...address, id: `AD${Date.now()}` }] })),
      pushChat: (message) => patch((s) => ({ ...s, chat: [...s.chat, message] })),
      resetChat: () => patch((s) => ({ ...s, chat: [] })),
    };
  }, [state, hydrated, addToCart, patch]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
