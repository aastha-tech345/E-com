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

export interface CatalogCategoryOption {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CatalogBrandOption {
  id: string;
  name: string;
  slug: string;
  description: string;
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
    sku: string;
    price: string | number;
    quantity_available: number;
    inventory_reserved?: number;
    is_default: boolean;
  }>;
  media: Array<{ media_url: string; sort_order: number }>;
}

const productCache = new Map<string, Product>();

function mapApiProduct(product: BackendProduct): Product {
  const variant = product.variants.find((item) => item.is_default) ?? product.variants[0];
  const price = Number(variant?.price ?? 0);

  return {
    id: product.id,
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
  description: string;
  created_at: string;
}

export const policyService = {
  async list(): Promise<PolicyDocument[]> {
    const response = await fetch(`${API_BASE}/admin/policies`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Unable to load policies.");
    return response.json();
  },

  async upload(file: File, name?: string, description?: string): Promise<{ id: string; title: string; chunks: number }> {
    const body = new FormData();
    body.append("file", file);
    if (name) body.append("name", name);
    if (description) body.append("description", description);
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
  async rename(id: string, title: string, description: string) {
    return adminCatalogRequest<{ id: string; title: string }>(`/admin/policies/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
    });
  },
  async replaceFile(id: string, file: File, name?: string, description?: string): Promise<{ id: string; title: string; chunks: number }> {
    const body = new FormData();
    body.append("file", file);
    if (name) body.append("name", name);
    if (description) body.append("description", description);
    const response = await fetch(`${API_BASE}/admin/policies/${id}/file`, {
      method: "PUT",
      headers: authHeaders(),
      body,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to replace policy file.");
    }
    return response.json();
  },
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/admin/policies/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error("Unable to delete policy.");
  },
};

export const customerDataService = {
  async addCartProduct(productId: string, quantity: number) {
    return authenticatedJsonRequest("/cart/items", { method: "POST", body: JSON.stringify({ product_id: productId, quantity }) });
  },
  async addWishlistProduct(productId: string) {
    return authenticatedJsonRequest("/wishlist", { method: "POST", body: JSON.stringify({ product_id: productId }) });
  },
  async removeWishlistProduct(productId: string) {
    return authenticatedJsonRequest("/wishlist", { method: "DELETE", body: JSON.stringify({ product_id: productId }) });
  },
};

export interface CustomerAddressRecord {
  id: string;
  recipient_name: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
}

export const profileService = {
  async update(payload: { full_name: string; email: string }) {
    return authenticatedJsonRequest("/auth/me", { method: "PUT", body: JSON.stringify(payload) }) as Promise<{ id: string; full_name: string; email: string; roles: string[] }>;
  },
  async addresses(): Promise<CustomerAddressRecord[]> {
    return authenticatedJsonRequest("/auth/me/addresses", { method: "GET" }) as Promise<CustomerAddressRecord[]>;
  },
  async saveAddress(payload: Omit<CustomerAddressRecord, "id">, id?: string): Promise<CustomerAddressRecord> {
    return authenticatedJsonRequest(id ? `/auth/me/addresses/${id}` : "/auth/me/addresses", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) }) as Promise<CustomerAddressRecord>;
  },
  async deleteAddress(id: string) {
    await authenticatedJsonRequest(`/auth/me/addresses/${id}`, { method: "DELETE" });
  },
};

async function authenticatedJsonRequest(path: string, init: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init.headers },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || "Unable to save customer data.");
  }
  return response.status === 204 ? undefined : response.json();
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
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
    items.forEach((product) => productCache.set(product.id, product));
    return {
      items,
      total: data.total,
      page: data.page,
      perPage: data.per_page,
      pages: data.pages,
    };
  },

  byId(id: string): Product | undefined {
    return productCache.get(id) ?? products.find((product) => product.id === id);
  },

  byIds(ids: string[]): Product[] {
    return ids.map((id) => this.byId(id)).filter((product): product is Product => Boolean(product));
  },

  all(): Product[] {
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

  async createCategory(payload: { name: string; slug: string; description: string }) {
    return adminCatalogRequest<CatalogCategoryOption>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async createBrand(payload: { name: string; slug: string; description: string }) {
    return adminCatalogRequest<CatalogBrandOption>("/admin/brands", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async updateCategory(id: string, payload: { name: string; slug: string; description: string }) {
    return adminCatalogRequest<CatalogCategoryOption>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  async deleteCategory(id: string) {
    await adminCatalogRequest<void>(`/admin/categories/${id}`, { method: "DELETE" });
  },
  async updateBrand(id: string, payload: { name: string; slug: string; description: string }) {
    return adminCatalogRequest<CatalogBrandOption>(`/admin/brands/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  async deleteBrand(id: string) {
    await adminCatalogRequest<void>(`/admin/brands/${id}`, { method: "DELETE" });
  },
  async deleteProduct(id: string) {
    await adminCatalogRequest<void>(`/admin/products/${id}`, { method: "DELETE" });
  },
  async adminProducts(params: CatalogListParams = {}): Promise<Paged<Product>> {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      page_size: String(params.pageSize ?? 10),
      field: params.field ?? "all",
    });
    if (params.q) query.set("q", params.q);
    const response = await fetch(`${API_BASE}/admin/products?${query.toString()}`, { headers: authHeaders() });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load products.");
    }
    const data = (await response.json()) as { items: BackendProduct[]; total: number; page: number; page_size: number; pages: number };
    const items = data.items.map(mapApiProduct);
    items.forEach((product) => productCache.set(product.id, product));
    return { items, total: data.total, page: data.page, perPage: data.page_size, pages: data.pages };
  },
  async updateProduct(id: string, payload: Record<string, unknown>) {
    return adminCatalogRequest(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },

  async adminCategories(params: CatalogListParams = {}) {
    return adminCatalogListWithFallback<CatalogCategoryOption>("/admin/categories", "/categories", params);
  },

  async adminBrands(params: CatalogListParams = {}) {
    return adminCatalogListWithFallback<CatalogBrandOption>("/admin/brands", "/brands", params);
  },

  async adminAttributes(params: CatalogListParams = {}) {
    return adminCatalogList<CatalogAttribute>("/admin/attributes", params);
  },

  async createAttribute(payload: CatalogAttributeInput) {
    return adminCatalogRequest<CatalogAttribute>("/admin/attributes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateAttribute(id: string, payload: CatalogAttributeInput) {
    return adminCatalogRequest<CatalogAttribute>(`/admin/attributes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteAttribute(id: string) {
    await adminCatalogRequest<void>(`/admin/attributes/${id}`, { method: "DELETE" });
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

export interface CatalogListParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  field?: string;
}

export interface CatalogListResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface CatalogAttribute {
  id: string;
  name: string;
  slug: string;
  attribute_type: string;
  values: string[];
  created_at: string;
}

export interface CatalogAttributeInput {
  name: string;
  slug: string;
  attribute_type: string;
  values: string[];
}

async function adminCatalogList<T>(path: string, params: CatalogListParams): Promise<CatalogListResponse<T>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    page_size: String(params.pageSize ?? 10),
    sort_by: params.sortBy ?? "created_at",
    sort_order: params.sortOrder ?? "desc",
  });
  if (params.q?.trim()) query.set("q", params.q.trim());
  if (params.field && params.field !== "all") query.set("field", params.field);
  const response = await fetch(`${API_BASE}${path}?${query.toString()}`, { headers: authHeaders() });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || "Catalog request failed.");
  }
  return response.json() as Promise<CatalogListResponse<T>>;
}

async function adminCatalogListWithFallback<T>(adminPath: string, publicPath: string, params: CatalogListParams): Promise<CatalogListResponse<T>> {
  try {
    return await adminCatalogList<T>(adminPath, params);
  } catch {
    const response = await fetch(`${API_BASE}${publicPath}`);
    if (!response.ok) throw new Error("Unable to load catalog records. Run the latest database migration and restart the backend.");
    const all = (await response.json()) as T[];
    const query = params.q?.trim().toLowerCase() ?? "";
    const matching = query
      ? all.filter((item) => Object.values(item as Record<string, unknown>).join(" ").toLowerCase().includes(query))
      : all;
    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;
    return {
      items: matching.slice((page - 1) * pageSize, page * pageSize),
      total: matching.length,
      page,
      page_size: pageSize,
      pages: Math.ceil(matching.length / pageSize),
    };
  }
}

async function adminCatalogRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init.headers },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || "Catalog request failed.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ============================================================================
// ORDER SERVICE
// ============================================================================

export const orderService = {
  async adminList(params: { q?: string; field?: string; status?: string; page?: number; pageSize?: number } = {}): Promise<AdminOrderPage> {
    const query = new URLSearchParams({ page: String(params.page ?? 1), page_size: String(params.pageSize ?? 10) });
    if (params.q) query.set("q", params.q);
    if (params.field) query.set("field", params.field);
    if (params.status) query.set("status", params.status);
    const response = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, { headers: authHeaders() });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load admin orders.");
    }
    return response.json() as Promise<AdminOrderPage>;
  },
  async updateStatus(orderId: string, status: string): Promise<{ id: string; status: string }> {
    const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to update order status.");
    }
    return response.json() as Promise<{ id: string; status: string }>;
  },
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

export interface AdminOrder {
  id: string;
  order_number: string;
  customer: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: { line1: string; city: string; state: string; postal_code: string };
  items: Array<{ product_name: string; variant_name: string; sku: string; quantity: number; unit_price: number; line_total: number }>;
}

export interface AdminOrderPage {
  items: AdminOrder[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ============================================================================
// PAYMENT SERVICE
// ============================================================================

export const paymentService = {
  async createStripeCheckoutSession(payload: StripeCheckoutRequest) {
    if (!getStoredAccessToken()) {
      throw new Error("Please sign in before starting checkout.");
    }
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

export const checkoutService = {
  async placeOrder(payload: {
    shipping_name: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    payment_method: string;
    payment_reference: string;
    idempotency_key: string;
    coupon_code?: string | null;
  }) {
    return authenticatedJsonRequest("/checkout", { method: "POST", body: JSON.stringify(payload) });
  },
};

export const returnService = {
  async requestReplacement(orderItemId: string, quantity: number) {
    return authenticatedJsonRequest("/returns", {
      method: "POST",
      body: JSON.stringify({ order_item_id: orderItemId, quantity, reason: "replacement" }),
    });
  },
};

// ============================================================================
// CUSTOMER SERVICE
// ============================================================================

export const customerService = {
  async adminList(params: { q?: string; field?: string; page?: number; pageSize?: number } = {}): Promise<AdminCustomerPage> {
    const query = new URLSearchParams({ page: String(params.page ?? 1), page_size: String(params.pageSize ?? 10) });
    if (params.q) query.set("q", params.q);
    if (params.field && params.field !== "all") query.set("field", params.field);
    const response = await fetch(`${API_BASE}/admin/customers?${query.toString()}`, { headers: authHeaders() });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load customers.");
    }
    return response.json() as Promise<AdminCustomerPage>;
  },
  async adminById(id: string): Promise<AdminCustomerDetail> {
    const response = await fetch(`${API_BASE}/admin/customers/${id}`, { headers: authHeaders() });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load customer details.");
    }
    return response.json() as Promise<AdminCustomerDetail>;
  },
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

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export interface AdminCustomerPage {
  items: AdminCustomer[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface AdminCustomerDetail extends AdminCustomer {
  orders_count: number;
  total_spent: number;
  addresses: Array<{
    id: string;
    recipient_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    updated_at: string;
  }>;
}

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
    id: item.id,
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
  if (["pending", "processing", "shipped", "delivered", "cancelled", "replacement_requested"].includes(status)) {
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
