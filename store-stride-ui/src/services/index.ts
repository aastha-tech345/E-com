/**
 * Frontend service layer - Real API Integration (with Mock Fallback)
 * 
 * Calls REST APIs from FastAPI backend.
 * Falls back to mock data while backend is initializing.
 * API base: http://localhost:8000/api/v1
 */

import type { ChatMessage, Order, Product } from "@/types";
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

// ============================================================================
// AUTH SERVICE
// ============================================================================

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    roles: string[];
  };
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export const authService = {
  async register(email: string, full_name: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Registration failed");
    }
    const data = await response.json();
    this.saveTokens(data.access_token, data.refresh_token);
    this.saveUser(data.user);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Login failed");
    }
    const data = await response.json();
    this.saveTokens(data.access_token, data.refresh_token);
    this.saveUser(data.user);
    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const tokens = this.getTokens();
    if (!tokens) throw new Error("No refresh token available");
    
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    });
    if (!response.ok) {
      this.clearTokens();
      throw new Error("Token refresh failed");
    }
    const data = await response.json();
    this.saveTokens(data.access_token, data.refresh_token);
    this.saveUser(data.user);
    return data;
  },

  async me(): Promise<AuthResponse["user"]> {
    const tokens = this.getTokens();
    if (!tokens) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user profile");
    const user = await response.json();
    this.saveUser(user);
    return user;
  },

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("authTokens", JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
  },

  saveUser(user: AuthResponse["user"]) {
    localStorage.setItem("authUser", JSON.stringify(user));
  },

  getTokens(): AuthTokens | null {
    const stored = localStorage.getItem("authTokens");
    return stored ? JSON.parse(stored) : null;
  },

  getUser(): AuthResponse["user"] | null {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  },

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.access_token || null;
  },

  getUserRoles(): string[] {
    const user = this.getUser();
    return user?.roles || [];
  },

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes("super_admin") || roles.includes("admin");
  },

  isSeller(): boolean {
    const roles = this.getUserRoles();
    return roles.includes("seller_owner");
  },

  clearTokens() {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("authUser");
  },

  logout() {
    this.clearTokens();
  },
};

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
    // Return products by array of IDs
    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p) => p !== undefined) as Product[];
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
// ============================================================================
// CHATBOT SERVICE
// ============================================================================

export const chatbotService = {
  async reply(message: string, history: ChatMessage[]): Promise<string> {
    // Mock chatbot response
    const responses: string[] = [
      "How can I help you find the perfect product?",
      "Have you checked our latest deals?",
      "Would you like me to recommend something?",
      "Our customer service team is here to help!",
    ];
    return responses[Math.floor(Math.random() * responses.length)]!;
  },
};
