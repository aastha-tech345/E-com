/**
 * Frontend service layer - Real API Integration (with Mock Fallback)
 *
 * Calls REST APIs from FastAPI backend.
 * Falls back to mock data while backend is initializing.
 * API base: http://localhost:8000/api/v1
 */

import type {
  AssistantOrderCard,
  AssistantProductResult,
  AssistantReturnAction,
  ChatMessage,
  Order,
  Product,
} from "@/types";
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

export interface ProductUpdatePayload {
  category_id?: string;
  brand_id?: string | null;
  name?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  is_published?: boolean;
  sku?: string;
  price?: number;
  quantity_available?: number;
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
  description: string;
}

export interface CatalogBrandOption {
  id: string;
  name: string;
  slug: string;
  description: string;
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

function normalizeImageUrl(value?: string | null): string {
  const raw = value?.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    const googleImageUrl = url.searchParams.get("imgurl");
    if (googleImageUrl) return decodeURIComponent(googleImageUrl);
    const wrappedUrl = url.searchParams.get("url");
    if (wrappedUrl && /\.(avif|gif|jpe?g|png|webp)(\?|$)/i.test(wrappedUrl)) {
      return decodeURIComponent(wrappedUrl);
    }
  } catch {
    return raw;
  }

  return raw;
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
      .map((media) => normalizeImageUrl(media.media_url))
      .filter(Boolean),
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

function productSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function localProductPage(query?: ProductQuery): Paged<Product> {
  hydrateProductCache();
  const candidates = new Map<string, Product>();
  products.forEach((product) => candidates.set(product.id, product));
  productCache.forEach((product) => candidates.set(product.id, product));

  const searchTerm = query?.search?.trim().toLowerCase();
  let items = Array.from(candidates.values()).filter((product) => {
    if (product.status !== "active") return false;
    if (searchTerm) {
      const searchable = [
        product.name,
        product.brand,
        product.category,
        product.description,
        product.sku,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(searchTerm)) return false;
    }
    if (query?.category?.length && !query.category.includes(product.categorySlug)) return false;
    if (query?.brands?.length && !query.brands.includes(productSlug(product.brand))) return false;
    if (query?.minPrice !== undefined && product.price < query.minPrice) return false;
    if (query?.maxPrice !== undefined && product.price > query.maxPrice) return false;
    if (query?.minRating !== undefined && product.rating < query.minRating) return false;
    return true;
  });

  if (query?.sort === "price-low")
    items = [...items].sort((first, second) => first.price - second.price);
  if (query?.sort === "price-high")
    items = [...items].sort((first, second) => second.price - first.price);
  if (query?.sort === "rating")
    items = [...items].sort((first, second) => second.rating - first.rating);

  const perPage = query?.perPage || 12;
  const page = query?.page || 1;
  const total = items.length;
  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    total,
    page,
    perPage,
    pages: Math.ceil(total / perPage),
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

interface StoredAuthTokens {
  access_token: string;
  refresh_token: string;
}

function getStoredAuthTokens(): StoredAuthTokens | null {
  if (typeof window === "undefined") return null;

  const authTokens = localStorage.getItem("authTokens");
  if (authTokens) {
    try {
      const parsed = JSON.parse(authTokens) as { access_token?: unknown; refresh_token?: unknown };
      if (typeof parsed.access_token === "string" && typeof parsed.refresh_token === "string") {
        return { access_token: parsed.access_token, refresh_token: parsed.refresh_token };
      }
    } catch {
      /* ignore corrupt token storage */
    }
  }

  const shopState = localStorage.getItem(SHOP_STATE_KEY);
  if (!shopState) return null;
  try {
    const parsed = JSON.parse(shopState) as {
      tokens?: { access_token?: unknown; refresh_token?: unknown };
    };
    if (
      typeof parsed.tokens?.access_token === "string" &&
      typeof parsed.tokens.refresh_token === "string"
    ) {
      return {
        access_token: parsed.tokens.access_token,
        refresh_token: parsed.tokens.refresh_token,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getStoredAccessToken(): string | null {
  return getStoredAuthTokens()?.access_token ?? null;
}

function persistAuthTokens(tokens: StoredAuthTokens) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem("authTokens") ?? "{}") as { user?: unknown };
    localStorage.setItem(
      "authTokens",
      JSON.stringify({ ...tokens, ...(existing.user ? { user: existing.user } : {}) }),
    );
    const shopState = JSON.parse(localStorage.getItem(SHOP_STATE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    localStorage.setItem(SHOP_STATE_KEY, JSON.stringify({ ...shopState, tokens }));
  } catch {
    /* Storage failures should not prevent the current request from completing. */
  }
}

function clearStoredAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authTokens");
  try {
    const shopState = JSON.parse(localStorage.getItem(SHOP_STATE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    localStorage.setItem(SHOP_STATE_KEY, JSON.stringify({ ...shopState, tokens: null }));
  } catch {
    /* ignore corrupt persisted state */
  }
}

let refreshRequest: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const tokens = getStoredAuthTokens();
  if (!tokens) return false;
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const payload = (await response.json()) as StoredAuthTokens;
        if (!payload.access_token || !payload.refresh_token) return false;
        persistAuthTokens(payload);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshRequest = null;
      });
  }
  const refreshed = await refreshRequest;
  if (!refreshed) clearStoredAuthTokens();
  return refreshed;
}

function authHeaders(): HeadersInit {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function authenticatedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const request = () => fetch(url, { ...init, headers: { ...authHeaders(), ...init.headers } });
  let response = await request();
  if (response.status !== 401 || !(await refreshAccessToken())) return response;
  response = await request();
  return response;
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

  async upload(
    file: File,
    name?: string,
    description?: string,
  ): Promise<{ id: string; title: string; chunks: number }> {
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
  async replaceFile(
    id: string,
    file: File,
    name?: string,
    description?: string,
  ): Promise<{ id: string; title: string; chunks: number }> {
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
    return authenticatedJsonRequest("/cart/items", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },
  async addWishlistProduct(productId: string) {
    return authenticatedJsonRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  },
  async removeWishlistProduct(productId: string) {
    return authenticatedJsonRequest("/wishlist", {
      method: "DELETE",
      body: JSON.stringify({ product_id: productId }),
    });
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
    return authenticatedJsonRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }) as Promise<{ id: string; full_name: string; email: string; roles: string[] }>;
  },
  async addresses(): Promise<CustomerAddressRecord[]> {
    return authenticatedJsonRequest("/auth/me/addresses", { method: "GET" }) as Promise<
      CustomerAddressRecord[]
    >;
  },
  async saveAddress(
    payload: Omit<CustomerAddressRecord, "id">,
    id?: string,
  ): Promise<CustomerAddressRecord> {
    return authenticatedJsonRequest(id ? `/auth/me/addresses/${id}` : "/auth/me/addresses", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    }) as Promise<CustomerAddressRecord>;
  },
  async deleteAddress(id: string) {
    await authenticatedJsonRequest(`/auth/me/addresses/${id}`, { method: "DELETE" });
  },
};

async function authenticatedJsonRequest(path: string, init: RequestInit) {
  const response = await authenticatedFetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
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
  async adminList(): Promise<Product[]> {
    const response = await authenticatedFetch(`${API_BASE}/admin/products`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load admin products");
    }
    const data = (await response.json()) as {
      items: BackendProduct[];
      total: number;
      page: number;
      page_size: number;
      pages: number;
    };
    const items = data.items.map(mapApiProduct);
    rememberProducts(items);
    return items;
  },

  async create(
    payload: ProductCreatePayload,
    endpoint: "admin" | "seller" = "admin",
  ): Promise<Product> {
    const normalizedPayload: ProductCreatePayload = {
      ...payload,
      media: payload.media?.map((media) => ({
        ...media,
        media_url: normalizeImageUrl(media.media_url),
      })),
    };
    const response = await authenticatedFetch(`${API_BASE}/${endpoint}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(normalizedPayload),
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

    try {
      const response = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!response.ok) throw new Error(`Catalog request failed with status ${response.status}.`);
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
    } catch (error) {
      console.warn("Catalog API is unavailable; using the local product catalog.", error);
      return localProductPage(query);
    }
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
    return adminCatalogRequest<CatalogCategoryOption>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async deleteCategory(id: string) {
    await adminCatalogRequest<void>(`/admin/categories/${id}`, { method: "DELETE" });
  },
  async updateBrand(id: string, payload: { name: string; slug: string; description: string }) {
    return adminCatalogRequest<CatalogBrandOption>(`/admin/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
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
    const response = await authenticatedFetch(`${API_BASE}/admin/products?${query.toString()}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load products.");
    }
    const data = (await response.json()) as {
      items: BackendProduct[];
      total: number;
      page: number;
      page_size: number;
      pages: number;
    };
    const items = data.items.map(mapApiProduct);
    items.forEach((product) => productCache.set(product.id, product));
    return {
      items,
      total: data.total,
      page: data.page,
      perPage: data.page_size,
      pages: data.pages,
    };
  },
  async adminProduct(id: string): Promise<Product> {
    const response = await authenticatedFetch(`${API_BASE}/admin/products/${id}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load product.");
    }
    const product = mapApiProduct((await response.json()) as BackendProduct);
    rememberProducts([product]);
    return product;
  },
  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await authenticatedFetch(`${API_BASE}/admin/product-images`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to upload image.");
    }
    return ((await response.json()) as { media_url: string }).media_url;
  },
  async updateProduct(id: string, payload: ProductUpdatePayload) {
    return adminCatalogRequest<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async adminCategories(params: CatalogListParams = {}) {
    return adminCatalogListWithFallback<CatalogCategoryOption>(
      "/admin/categories",
      "/categories",
      params,
    );
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

async function adminCatalogList<T>(
  path: string,
  params: CatalogListParams,
): Promise<CatalogListResponse<T>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    page_size: String(params.pageSize ?? 10),
    sort_by: params.sortBy ?? "created_at",
    sort_order: params.sortOrder ?? "desc",
  });
  if (params.q?.trim()) query.set("q", params.q.trim());
  if (params.field && params.field !== "all") query.set("field", params.field);
  const response = await fetch(`${API_BASE}${path}?${query.toString()}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || "Catalog request failed.");
  }
  return response.json() as Promise<CatalogListResponse<T>>;
}

async function adminCatalogListWithFallback<T>(
  adminPath: string,
  publicPath: string,
  params: CatalogListParams,
): Promise<CatalogListResponse<T>> {
  try {
    return await adminCatalogList<T>(adminPath, params);
  } catch {
    const response = await fetch(`${API_BASE}${publicPath}`);
    if (!response.ok)
      throw new Error(
        "Unable to load catalog records. Run the latest database migration and restart the backend.",
      );
    const all = (await response.json()) as T[];
    const query = params.q?.trim().toLowerCase() ?? "";
    const matching = query
      ? all.filter((item) =>
          Object.values(item as Record<string, unknown>)
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
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
  const response = await authenticatedFetch(`${API_BASE}${path}`, {
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
  async adminList(
    params: { q?: string; field?: string; status?: string; page?: number; pageSize?: number } = {},
  ): Promise<AdminOrderPage> {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      page_size: String(params.pageSize ?? 10),
    });
    if (params.q) query.set("q", params.q);
    if (params.field) query.set("field", params.field);
    if (params.status) query.set("status", params.status);
    const response = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: authHeaders(),
    });
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

    const response = await authenticatedFetch(`${API_BASE}/orders`);

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

    const response = await authenticatedFetch(`${API_BASE}/orders/${id}`);

    if (response.status === 404) return undefined;
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load order");
    }

    return toOrder((await response.json()) as BackendOrder);
  },

  async itemTracking(itemId: string): Promise<OrderItemTracking> {
    const response = await authenticatedFetch(`${API_BASE}/orders/items/${itemId}/tracking`);
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load item tracking");
    }
    return response.json() as Promise<OrderItemTracking>;
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
  items: Array<{
    product_name: string;
    variant_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
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

  async confirmStripeCheckout(sessionId: string) {
    const response = await authenticatedFetch(
      `${API_BASE}/payments/stripe/checkout-session/${encodeURIComponent(sessionId)}/confirm`,
      { method: "POST" },
    );
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to confirm the Stripe payment.");
    }
    return response.json() as Promise<{ status: string }>;
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
  async list(): Promise<ReturnRequest[]> {
    const response = await authenticatedFetch(`${API_BASE}/returns`);
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load return requests");
    }
    return response.json() as Promise<ReturnRequest[]>;
  },
  async requestReturn(
    orderItemId: string,
    quantity: number,
    reason: string,
    proof?: { proofUrl: string; proofType: string; issueReason?: string },
  ): Promise<ReturnRequest> {
    return authenticatedJsonRequest("/returns", {
      method: "POST",
      body: JSON.stringify({
        order_item_id: orderItemId,
        quantity,
        reason,
        issue_reason: proof?.issueReason ?? "",
        proof_url: proof?.proofUrl ?? "",
        proof_type: proof?.proofType ?? "",
      }),
    }) as Promise<ReturnRequest>;
  },
  async requestReplacement(
    orderItemId: string,
    quantity: number,
    proof?: { proofUrl: string; proofType: string; issueReason?: string },
  ) {
    return this.requestReturn(orderItemId, quantity, "replacement", proof);
  },
  async uploadProof(file: File): Promise<{ proofUrl: string; proofType: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await authenticatedFetch(`${API_BASE}/returns/proof`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to upload proof.");
    }
    const payload = (await response.json()) as { proof_url: string; proof_type: string };
    return { proofUrl: payload.proof_url, proofType: payload.proof_type };
  },
};

export const adminReturnService = {
  async list(): Promise<ReturnRequest[]> {
    const response = await fetch(`${API_BASE}/admin/returns`, { headers: authHeaders() });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to load return requests.");
    }
    return response.json() as Promise<ReturnRequest[]>;
  },
  async decide(returnId: string, status: "approved" | "rejected") {
    const response = await fetch(`${API_BASE}/returns/${returnId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Unable to update return request.");
    }
    return response.json() as Promise<{ return_id: string; status: string; refund_amount: string }>;
  },
};

export interface ReturnRequest {
  id: string;
  order_id: string;
  order_item_id: string;
  quantity: number;
  reason: string;
  issue_reason?: string;
  proof_url?: string;
  proof_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

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

    const response = await authenticatedFetch(`${API_BASE}/cart`);

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

    const response = await authenticatedFetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    const response = await authenticatedFetch(`${API_BASE}/cart/items/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      if (response.status === 400 && detail?.detail === "Cart item not found.") return null;
      throw new Error(detail?.detail || "Unable to update cart item");
    }

    return (await response.json()) as BackendCartResponse;
  },

  async saveProductQuantity(
    productId: string,
    quantity: number,
  ): Promise<BackendCartResponse | null> {
    const updated = await this.updateProduct(productId, quantity);
    if (updated || quantity <= 0) return updated;
    return this.addProduct(productId, quantity);
  },

  async removeProduct(productId: string): Promise<BackendCartResponse | null> {
    return this.updateProduct(productId, 0);
  },

  async clear(): Promise<void> {
    if (!this.isAuthenticated()) return;
    const response = await authenticatedFetch(`${API_BASE}/cart`, {
      method: "DELETE",
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
  async adminList(
    params: { q?: string; field?: string; page?: number; pageSize?: number } = {},
  ): Promise<AdminCustomerPage> {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      page_size: String(params.pageSize ?? 10),
    });
    if (params.q) query.set("q", params.q);
    if (params.field && params.field !== "all") query.set("field", params.field);
    const response = await fetch(`${API_BASE}/admin/customers?${query.toString()}`, {
      headers: authHeaders(),
    });
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
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
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
        user: payload.user,
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
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      }),
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
        user: payload.user,
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
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      try {
        const parsed = JSON.parse(authTokens) as { user?: unknown };
        if (parsed.user) return parsed.user;
      } catch {
        /* ignore corrupt token storage */
      }
    }

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
    return this.getUserRoles().some((role) =>
      [
        "super_admin",
        "admin",
        "admin_catalog",
        "admin_orders",
        "admin_payments",
        "admin_customers",
        "admin_marketing",
        "admin_support",
      ].includes(role),
    );
  },

  isSeller() {
    return this.getUserRoles().includes("seller_owner");
  },
};

// ============================================================================
// CHATBOT SERVICE
// ============================================================================

export const chatbotService = {
  resetConversation() {
    assistantConversationId = undefined;
  },

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
          quick_replies?: string[];
          orchestrator?: string;
          order_cards?: AssistantOrderCard[];
          return_actions?: AssistantReturnAction[];
        };
      };

      assistantConversationId = payload.conversation_id;
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: sanitizeAssistantAnswer(payload.answer, payload.products.length),
        conversationId: payload.conversation_id,
        intent: payload.intent,
        usedTools: payload.used_tools ?? [],
        orchestrator: payload.metadata?.orchestrator,
        source: "backend",
        productResults: payload.products.map(toAssistantProductResult),
        orderCards: (payload.metadata?.order_cards ?? []).map(normalizeAssistantOrderCard),
        returnActions: (payload.metadata?.return_actions ?? []).map(normalizeAssistantReturnAction),
        suggestions:
          payload.metadata?.quick_replies ??
          payload.metadata?.suggestions ??
          payload.metadata?.popular_search_terms ??
          [],
      };
    } catch (err) {
      console.warn("Backend assistant failed, using local fallback:", err);
    }

    const lower = message.toLowerCase();
    const fallbackIntent = classifyLocalAssistantIntent(lower);
    if (fallbackIntent === "policy_help") {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Most eligible delivered items can be returned within the return window. If an item arrived damaged, please keep the packaging and share your order ID so we can check replacement, refund, or similar product options.",
        suggestions: [
          "My product arrived damaged",
          "How do I request a refund?",
          "Track my latest order",
        ],
        intent: "policy_help",
        source: "fallback",
      };
    }
    if (fallbackIntent === "return_support") {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I can help with that. Please share your order ID, then I can check whether replacement, refund, or similar product options are available.",
        suggestions: ["Where can I find my order ID?", "Request replacement", "Request refund"],
        intent: "return_support",
        source: "fallback",
      };
    }
    if (fallbackIntent === "order_support") {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I can check your order status after you sign in. Please share the order ID, or ask me to track your latest order.",
        suggestions: ["Track my latest order", "Show my recent orders", "Contact support"],
        intent: "order_support",
        source: "fallback",
      };
    }

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

function sanitizeAssistantAnswer(answer: string, productCount = 0) {
  const cleaned = answer
    .replace(
      /I searched the marketplace catalog and found the most relevant products for your request\.\s*/gi,
      productCount > 0 ? "Here are the closest products I found for you. " : "",
    )
    .replace(
      /I could not find an exact match\. Try a broader category, brand, budget, or product use\./gi,
      "I could not find matching products right now. Try a category, brand, budget, or product name.",
    )
    // Keep Markdown structure intact so the chat UI can render policy headings and lists.
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return (
    cleaned ||
    (productCount > 0
      ? "Here are the closest products I found for you."
      : "I could not find matching products right now.")
  );
}

function classifyLocalAssistantIntent(message: string) {
  if (/(policy)/i.test(message)) return "policy_help";
  if (/(return|retuen|retrun|refund|exchange|replace|replacement)/i.test(message)) return "return_support";
  if (/(damage|damaged|broken|defective)/i.test(message)) return "return_support";
  if (/(order|track|delivery|shipment|courier)/i.test(message)) return "order_support";
  return "product_search";
}

interface BackendAssistantProduct {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  is_published?: boolean;
  category_name?: string | null;
  category_slug?: string | null;
  brand_name?: string | null;
  average_rating?: number;
  review_count?: number;
  variants: Array<{
    id?: string;
    sku?: string;
    price: string | number;
    currency: string;
    quantity_available: number;
    inventory_reserved?: number;
    is_default: boolean;
  }>;
  media: Array<{
    media_url: string;
    sort_order: number;
  }>;
}

function toAssistantProductResult(product: BackendAssistantProduct): AssistantProductResult {
  const mapped = productService.remember(
    mapApiProduct({
      ...product,
      is_published: product.is_published ?? true,
      variants: product.variants.map((variant) => ({
        id: variant.id ?? "",
        sku: variant.sku ?? product.slug,
        price: variant.price,
        quantity_available: variant.quantity_available,
        inventory_reserved: variant.inventory_reserved ?? 0,
        is_default: variant.is_default,
      })),
    }),
  );

  return {
    id: mapped.id,
    defaultVariantId: mapped.defaultVariantId,
    sku: mapped.sku,
    name: mapped.name,
    slug: mapped.slug,
    brand: mapped.brand,
    category: mapped.category,
    categorySlug: mapped.categorySlug,
    description: mapped.shortDescription || mapped.description,
    shortDescription: mapped.shortDescription,
    image: mapped.images[0],
    images: mapped.images,
    price: mapped.price,
    currency:
      product.variants.find((item) => item.is_default)?.currency ??
      product.variants[0]?.currency ??
      "INR",
    stock: mapped.stock,
    rating: mapped.rating,
    reviewCount: mapped.reviewCount,
  };
}

function normalizeAssistantOrderCard(order: AssistantOrderCard): AssistantOrderCard {
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      image: normalizeImageUrl(item.image),
    })),
  };
}

function normalizeAssistantReturnAction(
  action: AssistantReturnAction & {
    order_item_id?: string;
    product_name?: string;
    proof_required?: boolean;
    issue_reason?: string;
  },
): AssistantReturnAction {
  return {
    ...action,
    orderItemId: action.orderItemId ?? action.order_item_id,
    productName: action.productName ?? action.product_name,
    proofRequired: action.proofRequired ?? action.proof_required,
    issueReason: action.issueReason ?? action.issue_reason,
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
  product_image?: string;
  item_number: string;
  status: string;
  tracking_number?: string;
  shipping_partner?: string;
  estimated_delivery?: string | null;
  delivered_at?: string | null;
}

export interface OrderItemTracking {
  item_id: string;
  item_number: string;
  order_id: string;
  order_number: string;
  product_name: string;
  product_image: string;
  status: string;
  tracking_number: string;
  shipping_partner: string;
  estimated_delivery: string | null;
  shipping_name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  events: Array<{ status: string; note: string; created_at: string }>;
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
  payment_status: string;
  payment_method: string;
}

function toOrder(order: BackendOrder): Order {
  const subtotal = Number(order.subtotal ?? 0);
  const items = order.items.map((item) => ({
    id: item.id,
    itemNumber: item.item_number,
    productId: item.product_id,
    name: item.product_name,
    image: item.product_image || "",
    variant: item.variant_name || item.sku,
    price: Number(item.unit_price ?? 0),
    quantity: item.quantity,
    status: normalizeOrderStatus(item.status),
    trackingNumber: item.tracking_number || "",
    shippingPartner: item.shipping_partner || "",
    estimatedDelivery:
      item.estimated_delivery ||
      new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: item.delivered_at || undefined,
  }));
  const normalizedStatus = normalizeOrderStatus(order.status);

  return {
    id: order.id,
    order_number: order.order_number,
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
      method: order.payment_method === "card" ? "Stripe" : order.payment_method,
      status: order.payment_status === "captured" ? "paid" : "pending",
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
  if (
    [
      "pending",
      "processing",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
      "replacement_requested",
      "return_requested",
      "return_approved",
      "replacement_approved",
      "partially_shipped",
      "partially_delivered",
    ].includes(status)
  ) {
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
