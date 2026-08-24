/**
 * Frontend service layer - Real API Integration (with Mock Fallback)
 *
 * Calls REST APIs from FastAPI backend.
 * Falls back to mock data while backend is initializing.
 * API base: http://localhost:8000/api/v1
 */

import type { AssistantProductResult, ChatMessage, Order, Product } from "@/types";
import {
  adminUsers,
  banners,
  brands,
  categories,
  coupons,
  customers,
  orders,
  popularSearches,
  productAttributes,
  products,
  reviews,
} from "@/data/catalog";

const API_BASE = import.meta.env["VITE_API_URL"] || "http://localhost:8000/api/v1";
let assistantConversationId: string | undefined;
const SHOP_STATE_KEY = "shopnest-state-v1";
const PRODUCT_CACHE_KEY = "shopnest-product-cache-v1";

export interface ProductQuery {
  search?: string;
  category?: string[];
  subcategories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
  colors?: string[];
  sizes?: string[];
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface ProductCreatePayload {
  category_id: string;
  brand_id?: string | null;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  is_published?: boolean;
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    currency?: string;
    quantity_available: number;
    is_default?: boolean;
  }>;
  media?: Array<{
    media_url: string;
    alt_text?: string;
    sort_order?: number;
  }>;
}

export interface CatalogCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogBrandOption {
  id: string;
  name: string;
  slug: string;
}

export interface AnalyticsSummary {
  total_orders: number;
  total_revenue: string | number;
  total_customers: number;
  total_products: number;
  total_reviews: number;
  total_searches: number;
  cached?: boolean;
}

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  is_published: boolean;
  category_name?: string | null;
  category_slug?: string | null;
  brand_name?: string | null;
  average_rating?: number;
  review_count?: number;
  variants: Array<{
    id: string;
    sku: string;
    price: string | number;
    quantity_available: number;
    inventory_reserved?: number;
    is_default: boolean;
  }>;
  media: Array<{ media_url: string; sort_order: number }>;
}

const productCache = new Map<string, Product>();
let productCacheHydrated = false;

function hydrateProductCache() {
  if (productCacheHydrated || typeof window === "undefined") return;
  productCacheHydrated = true;

  try {
    const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return;

    const items = JSON.parse(raw) as unknown;
    if (!Array.isArray(items)) return;

    items.forEach((item) => {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as Product).id === "string" &&
        typeof (item as Product).name === "string"
      ) {
        productCache.set((item as Product).id, item as Product);
      }
    });
  } catch {
    /* ignore corrupt product cache */
  }
}

function rememberProducts(items: Product[]) {
  hydrateProductCache();
  items.forEach((product) => productCache.set(product.id, product));

  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(Array.from(productCache.values())));
  } catch {
    /* localStorage can fail if storage is full or blocked */
  }
}

function mapApiProduct(product: BackendProduct): Product {
  const variant = product.variants.find((item) => item.is_default) ?? product.variants[0];
  const price = Number(variant?.price ?? 0);

  return {
    id: product.id,
    defaultVariantId: variant?.id,
    sku: variant?.sku ?? product.slug,
    name: product.name,
    slug: product.slug,
    brand: product.brand_name ?? "Unbranded",
    category: product.category_name ?? "Uncategorized",
    categorySlug: product.category_slug ?? "uncategorized",
    subcategory: "",
    description: product.description,
    shortDescription: product.short_description,
    images: [...product.media]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((media) => media.media_url),
    mrp: price,
    price,
    costPrice: 0,
    rating: Number(product.average_rating ?? 0),
    reviewCount: Number(product.review_count ?? 0),
    stock: variant?.quantity_available ?? 0,
    reserved: variant?.inventory_reserved ?? 0,
    minStock: 0,
    colors: [],
    sizes: [],
    specifications: [],
    tags: [],
    status: product.is_published ? "active" : "draft",
    createdAt: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: false,
  };
}

export interface StripeCheckoutItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_amount: number;
  image?: string;
}

export interface StripeCheckoutRequest {
  items: StripeCheckoutItem[];
  customer_email?: string;
  shipping_name?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  success_path?: string;
  cancel_path?: string;
}

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const authTokens = localStorage.getItem("authTokens");
  if (authTokens) {
    try {
      const parsed = JSON.parse(authTokens) as { access_token?: unknown };
      if (typeof parsed.access_token === "string") return parsed.access_token;
    } catch {
      /* ignore corrupt token storage */
    }
  }

  const shopState = localStorage.getItem(SHOP_STATE_KEY);
  if (!shopState) return null;
  try {
    const parsed = JSON.parse(shopState) as { tokens?: { access_token?: unknown } };
    return typeof parsed.tokens?.access_token === "string" ? parsed.tokens.access_token : null;
  } catch {
    return null;
  }
}

function authHeaders(): HeadersInit {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface PolicyDocument {
  id: string;
  title: string;
  created_at: string;
}

export const policyService = {
  async list(): Promise<PolicyDocument[]> {
    const response = await fetch(`${API_BASE}/admin/policies`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Unable to load policies.");
    return response.json();
  },

  async upload(file: File, name?: string): Promise<{ id: string; title: string; chunks: number }> {
    const body = new FormData();
    body.append("file", file);
    if (name) body.append("name", name);
    const response = await fetch(`${API_BASE}/admin/policies`, {
      method: "POST",
      headers: authHeaders(),
      body,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to upload policy.");
    }
    return response.json();
  },
};

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
  async adminList(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/admin/products`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load admin products");
    }
    const items = ((await response.json()) as BackendProduct[]).map(mapApiProduct);
    rememberProducts(items);
    return items;
  },

  async create(payload: ProductCreatePayload, endpoint: "admin" | "seller" = "admin"): Promise<Product> {
    const response = await fetch(`${API_BASE}/${endpoint}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to create product");
    }

    const product = mapApiProduct((await response.json()) as BackendProduct);
    rememberProducts([product]);
    return product;
  },

  async list(query?: ProductQuery): Promise<Paged<Product>> {
    const params = new URLSearchParams();
    if (query?.search) params.set("q", query.search);
    query?.category?.forEach((value) => params.append("category", value));
    query?.brands?.forEach((value) => params.append("brand", value));
    if (query?.minPrice !== undefined) params.set("min_price", String(query.minPrice));
    if (query?.maxPrice !== undefined) params.set("max_price", String(query.maxPrice));
    if (query?.minRating !== undefined) params.set("min_rating", String(query.minRating));
    if (query?.sort) params.set("sort", query.sort);
    params.set("page", String(query?.page || 1));
    params.set("per_page", String(query?.perPage || 12));

    const response = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!response.ok) throw new Error("Unable to load products from the server.");
    const data = (await response.json()) as {
      items: BackendProduct[];
      total: number;
      page: number;
      per_page: number;
      pages: number;
    };
    const items = data.items.map(mapApiProduct);
    rememberProducts(items);
    return {
      items,
      total: data.total,
      page: data.page,
      perPage: data.per_page,
      pages: data.pages,
    };
  },

  byId(id: string): Product | undefined {
    hydrateProductCache();
    return productCache.get(id) ?? products.find((product) => product.id === id);
  },

  remember(product: Product): Product {
    rememberProducts([product]);
    return product;
  },

  byIds(ids: string[]): Product[] {
    return ids.map((id) => this.byId(id)).filter((product): product is Product => Boolean(product));
  },

  all(): Product[] {
    hydrateProductCache();
    return Array.from(productCache.values());
  },

  async featured(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Featured products failed:", err);
      return [];
    }
  },

  async trending(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Trending products failed:", err);
      return [];
    }
  },

  async bestSellers(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Best sellers failed:", err);
      return [];
    }
  },

  async deals(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Deals failed:", err);
      return [];
    }
  },

  suggestions(_term: string): {
    categories: CatalogCategoryOption[];
    brands: CatalogBrandOption[];
    products: Product[];
  } {
    return {
      // Search results are loaded from the backend after submission.
      categories: [],
      brands: [],
      products: [],
    };
  },

  get popularSearches() {
    return popularSearches;
  },
};

// ============================================================================
// CATALOG SERVICE (Categories, Brands, Attributes, Banners, etc.)
// ============================================================================

export const catalogService = {
  async categories() {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return (await response.json()) as CatalogCategoryOption[];
  },

  async brands() {
    const response = await fetch(`${API_BASE}/brands`);
    if (!response.ok) throw new Error("Failed to fetch brands");
    return (await response.json()) as CatalogBrandOption[];
  },

  async createCategory(payload: { name: string; slug: string }) {
    return adminCatalogRequest<CatalogCategoryOption>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async createBrand(payload: { name: string; slug: string }) {
    return adminCatalogRequest<CatalogBrandOption>("/admin/brands", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  attributes() {
    return productAttributes;
  },

  banners() {
    return banners;
  },

  coupons() {
    return coupons;
  },

  async reviews() {
    return reviews;
  },
};

async function adminCatalogRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init.headers },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || "Catalog request failed.");
  }
  return response.json() as Promise<T>;
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export const analyticsService = {
  async summary(): Promise<AnalyticsSummary> {
    const response = await fetch(`${API_BASE}/admin/analytics/summary`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Failed to load analytics");
    }
    return (await response.json()) as AnalyticsSummary;
  },
};

// ============================================================================
// ORDER SERVICE
// ============================================================================

export const orderService = {
  async list(): Promise<Order[]> {
    const token = getStoredAccessToken();
    if (!token) return [];

    const response = await fetch(`${API_BASE}/orders`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load orders");
    }

    const payload = (await response.json()) as BackendOrder[];
    return payload.map(toOrder);
  },

  async byId(id: string): Promise<Order | undefined> {
    const token = getStoredAccessToken();
    if (!token) return undefined;

    const response = await fetch(`${API_BASE}/orders/${id}`, {
      headers: authHeaders(),
    });

    if (response.status === 404) return undefined;
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load order");
    }

    return toOrder((await response.json()) as BackendOrder);
  },

  async byStatus(status: string): Promise<Order[]> {
    const list = await this.list();
    return list.filter((order) => order.status === status);
  },

  async byCustomer(customerId: string): Promise<Order[]> {
    const list = await this.list();
    return list.filter((order) => order.customerId === customerId);
  },
};

// ============================================================================
// PAYMENT SERVICE
// ============================================================================

export const paymentService = {
  async createStripeCheckoutSession(payload: StripeCheckoutRequest) {
    const response = await fetch(`${API_BASE}/payments/stripe/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to start Stripe checkout");
    }

    return (await response.json()) as { session_id: string; checkout_url: string };
  },
};

// ============================================================================
// CART SERVICE
// ============================================================================

export interface BackendCartLine {
  id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  quantity: number;
  unit_price: string | number;
  currency: string;
  line_total: string | number;
  available_quantity: number;
}

export interface BackendCartResponse {
  id: string;
  currency: string;
  total_items: number;
  subtotal: string | number;
  items: BackendCartLine[];
}

function getDefaultVariantId(productId: string): string | undefined {
  return productService.byId(productId)?.defaultVariantId;
}

export const cartService = {
  isAuthenticated(): boolean {
    return Boolean(getStoredAccessToken());
  },

  async current(): Promise<BackendCartResponse | null> {
    if (!this.isAuthenticated()) return null;

    const response = await fetch(`${API_BASE}/cart`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load backend cart");
    }

    return (await response.json()) as BackendCartResponse;
  },

  async addProduct(productId: string, quantity = 1): Promise<BackendCartResponse | null> {
    if (!this.isAuthenticated()) return null;
    const variantId = getDefaultVariantId(productId);
    if (!variantId) return null;

    const response = await fetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to save cart item");
    }

    return (await response.json()) as BackendCartResponse;
  },

  async updateProduct(productId: string, quantity: number): Promise<BackendCartResponse | null> {
    if (!this.isAuthenticated()) return null;
    const variantId = getDefaultVariantId(productId);
    if (!variantId) return null;

    const response = await fetch(`${API_BASE}/cart/items/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      if (response.status === 400 && detail?.detail === "Cart item not found.") return null;
      throw new Error(detail?.detail || "Unable to update cart item");
    }

    return (await response.json()) as BackendCartResponse;
  },

  async saveProductQuantity(productId: string, quantity: number): Promise<BackendCartResponse | null> {
    const updated = await this.updateProduct(productId, quantity);
    if (updated || quantity <= 0) return updated;
    return this.addProduct(productId, quantity);
  },

  async removeProduct(productId: string): Promise<BackendCartResponse | null> {
    return this.updateProduct(productId, 0);
  },

  async clear(): Promise<void> {
    if (!this.isAuthenticated()) return;
    const response = await fetch(`${API_BASE}/cart`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to clear backend cart");
    }
  },
};

// ============================================================================
// CUSTOMER SERVICE
// ============================================================================

export const customerService = {
  async list() {
    return customers;
  },

  async byId(id: string) {
    return customers.find((c) => c.id === id);
  },

  async orders(customerId: string) {
    return [];
  },
};

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Login failed");
    }

    const payload = await response.json();
    localStorage.setItem(
      "authTokens",
      JSON.stringify({
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
      }),
    );
    return payload;
  },

  async adminLogin(email: string, password: string) {
    return this.login(email, password);
  },

  async register(email: string, fullName: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: fullName, password }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Registration failed");
    }

    const payload = await response.json();
    localStorage.setItem(
      "authTokens",
      JSON.stringify({
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
      }),
    );
    return payload;
  },

  logout() {
    localStorage.removeItem("authTokens");
  },

  getAccessToken() {
    return getStoredAccessToken();
  },

  getUser() {
    if (typeof window === "undefined") return null;
    const shopState = localStorage.getItem(SHOP_STATE_KEY);
    if (!shopState) return null;
    try {
      const parsed = JSON.parse(shopState) as { user?: unknown; admin?: unknown };
      return parsed.user ?? parsed.admin ?? null;
    } catch {
      return null;
    }
  },

  getUserRoles(): string[] {
    const user = this.getUser() as { roles?: unknown } | null;
    return Array.isArray(user?.roles)
      ? user.roles.filter((role): role is string => typeof role === "string")
      : [];
  },

  isAdmin() {
    return this.getUserRoles().some((role) => ["super_admin", "admin_catalog"].includes(role));
  },

  isSeller() {
    return this.getUserRoles().includes("seller_owner");
  },
};

// ============================================================================
// CHATBOT SERVICE
// ============================================================================

export const chatbotService = {
  async reply(message: string): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_BASE}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          prompt: message,
          conversation_id: assistantConversationId,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.detail || "Assistant request failed");
      }

      const payload = (await response.json()) as {
        conversation_id: string;
        answer: string;
        products: BackendAssistantProduct[];
        intent?: string;
        used_tools?: string[];
        metadata?: {
          suggestions?: string[];
          popular_search_terms?: string[];
          orchestrator?: string;
        };
      };

      assistantConversationId = payload.conversation_id;
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: payload.answer,
        conversationId: payload.conversation_id,
        intent: payload.intent,
        usedTools: payload.used_tools ?? [],
        orchestrator: payload.metadata?.orchestrator,
        source: "backend",
        productResults: payload.products.map(toAssistantProductResult),
        suggestions: payload.metadata?.suggestions ?? payload.metadata?.popular_search_terms ?? [],
      };
    } catch (err) {
      console.warn("Backend assistant failed, using local fallback:", err);
    }

    const lower = message.toLowerCase();
    const matchedProducts = products
      .filter((product) => {
        const haystack = [
          product.id,
          product.name,
          product.brand,
          product.category,
          product.subcategory,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase();
        return lower
          .split(/\s+/)
          .filter((part) => part.length > 2)
          .some((part) => haystack.includes(part));
      })
      .slice(0, 3);

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text:
        matchedProducts.length > 0
          ? "I found a few products that match what you're looking for."
          : "I can help you find products, compare prices, or look up product IDs.",
      products: matchedProducts.map((product) => product.id),
      suggestions: ["Try headphones", "Show running shoes", "Find deals"],
      source: "fallback",
    };
  },
};

interface BackendAssistantProduct {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  variants: Array<{
    price: string | number;
    currency: string;
    quantity_available: number;
    is_default: boolean;
  }>;
  media: Array<{
    media_url: string;
    sort_order: number;
  }>;
}

function toAssistantProductResult(product: BackendAssistantProduct): AssistantProductResult {
  const variant = product.variants.find((item) => item.is_default) ?? product.variants[0];
  const media = [...product.media].sort((a, b) => a.sort_order - b.sort_order)[0];
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.short_description || product.description,
    image: media?.media_url,
    price: Number(variant?.price ?? 0),
    currency: variant?.currency ?? "INR",
    stock: variant?.quantity_available ?? 0,
  };
}

interface BackendOrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
}

interface BackendOrder {
  id: string;
  order_number: string;
  status: string;
  currency: string;
  subtotal: string | number;
  shipping_name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  created_at: string;
  items: BackendOrderItem[];
}

function toOrder(order: BackendOrder): Order {
  const subtotal = Number(order.subtotal ?? 0);
  const items = order.items.map((item) => ({
    productId: item.product_id,
    name: item.product_name,
    image: "",
    variant: item.variant_name || item.sku,
    price: Number(item.unit_price ?? 0),
    quantity: item.quantity,
  }));
  const normalizedStatus = normalizeOrderStatus(order.status);

  return {
    id: order.id,
    customerId: "",
    customerName: order.shipping_name,
    email: "",
    date: order.created_at,
    items,
    subtotal,
    discount: 0,
    shipping: 0,
    total: subtotal,
    status: normalizedStatus,
    payment: {
      method: "Stripe",
      status: normalizedStatus === "pending" ? "pending" : "paid",
    },
    address: {
      name: order.shipping_name,
      phone: "",
      line1: order.address_line1,
      city: order.city,
      state: order.state,
      pincode: order.postal_code,
    },
    timeline: buildOrderTimeline(normalizedStatus, order.created_at),
  };
}

function normalizeOrderStatus(status: string): Order["status"] {
  if (["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
    return status as Order["status"];
  }
  if (status === "paid") return "processing";
  return "pending";
}

function buildOrderTimeline(status: Order["status"], date: string) {
  return [
    { label: "Order placed", date, done: true },
    { label: "Payment confirmed", date, done: status !== "pending" && status !== "cancelled" },
    { label: "Shipped", date, done: ["shipped", "delivered"].includes(status) },
    { label: "Delivered", date, done: status === "delivered" },
  ];
}
