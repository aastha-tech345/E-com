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

export interface ProductQuery {
  search?: string;
  category?: string;
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

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
  async list(query?: ProductQuery): Promise<Paged<Product>> {
    // Use mock data - API not fully implemented yet
    return {
      items: products.slice(0, 20),
      total: products.length,
      page: 1,
      perPage: 20,
      pages: Math.ceil(products.length / 20),
    };
  },

  byId(id: string): Product | undefined {
    // Use mock data only - API not implemented yet
    return products.find((p) => p.id === id);
  },

  byIds(ids: string[]): Product[] {
    return ids
      .map((id) => this.byId(id))
      .filter((product): product is Product => Boolean(product));
  },

  all(): Product[] {
    // Return all products from mock data
    return products;
  },

  async featured(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Featured products failed:", err);
      return products.filter((p) => p.featured).slice(0, 8);
    }
  },

  async trending(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Trending products failed:", err);
      return products.filter((p) => p.trending).slice(0, 8);
    }
  },

  async bestSellers(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Best sellers failed:", err);
      return products.filter((p) => p.bestSeller).slice(0, 8);
    }
  },

  async deals(): Promise<Product[]> {
    try {
      const all = await this.list();
      return all.items.slice(0, 8);
    } catch (err) {
      console.warn("Deals failed:", err);
      return products.filter((p) => p.deal).slice(0, 8);
    }
  },

  suggestions(term: string) {
    const lowerTerm = term.toLowerCase();
    return {
      categories: categories.filter(c => c.name.toLowerCase().includes(lowerTerm)).slice(0, 3),
      brands: brands.filter(b => b.name.toLowerCase().includes(lowerTerm)).slice(0, 3),
      products: products.filter(p => p.name.toLowerCase().includes(lowerTerm)).slice(0, 5),
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
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (err) {
      console.warn("Categories API failed, using mock data:", err);
      return categories;
    }
  },

  async brands() {
    try {
      const response = await fetch(`${API_BASE}/brands`);
      if (!response.ok) throw new Error("Failed to fetch brands");
      return await response.json();
    } catch (err) {
      console.warn("Brands API failed, using mock data:", err);
      return brands;
    }
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

// ============================================================================
// ORDER SERVICE
// ============================================================================

export const orderService = {
  async list(): Promise<Order[]> {
    // TODO: Implement with backend API
    return [];
  },

  async byId(id: string): Promise<Order | undefined> {
    // TODO: Implement with backend API
    return undefined;
  },

  async byStatus(status: string): Promise<Order[]> {
    // TODO: Implement with backend API
    return [];
  },

  async byCustomer(customerId: string): Promise<Order[]> {
    // TODO: Implement with backend API
    return [];
  },
};

// ============================================================================
// PAYMENT SERVICE
// ============================================================================

export const paymentService = {
  async createStripeCheckoutSession(payload: StripeCheckoutRequest) {
    const response = await fetch(`${API_BASE}/payments/stripe/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    // Mock for now - will be integrated with backend
    if (email && password.length >= 4) {
      return {
        id: "user-1",
        name: "Customer",
        email,
      };
    }
    throw new Error("Invalid credentials");
  },

  async adminLogin(email: string, password: string) {
    // Mock for now - will be integrated with backend
    if (email && password.length >= 4) {
      return {
        name: "Admin",
        email,
        role: "admin",
      };
    }
    throw new Error("Invalid credentials");
  },

  async register(email: string, password: string, name: string) {
    return {
      id: "user-new",
      name,
      email,
    };
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
        headers: { "Content-Type": "application/json" },
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
        metadata?: { suggestions?: string[]; popular_search_terms?: string[] };
      };

      assistantConversationId = payload.conversation_id;
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: payload.answer,
        conversationId: payload.conversation_id,
        intent: payload.intent,
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
