export type ProductStatus = "active" | "draft" | "inactive";

export interface Product {
  id: string;
  defaultVariantId?: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  images: string[];
  mrp: number;
  price: number;
  costPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  reserved: number;
  minStock: number;
  colors: string[];
  sizes: string[];
  specifications: { label: string; value: string }[];
  tags: string[];
  status: ProductStatus;
  createdAt: string;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  deal: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  status: "active" | "inactive";
  subcategories: { id: string; name: string; slug: string; status: "active" | "inactive" }[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
  status: "active" | "inactive";
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customer: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: "published" | "pending" | "rejected";
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "replacement_requested";

export interface OrderItem {
  id?: string;
  productId: string;
  name: string;
  image: string;
  variant?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment: { method: string; status: "paid" | "pending" | "refunded" };
  address: Address;
  timeline: { label: string; date: string; done: boolean }[];
}

export interface Address {
  id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type?: "home" | "work";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joined: string;
  orders: number;
  spent: number;
  status: "active" | "blocked";
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  usage: number;
  limit: number;
  expiry: string;
  status: "active" | "expired";
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  placement: "hero" | "strip" | "grid";
  status: "active" | "inactive";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Manager" | "Support" | "Catalog";
  lastActive: string;
  status: "active" | "inactive";
}

export interface CartLine {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: string[];
  productResults?: AssistantProductResult[];
  suggestions?: string[];
  conversationId?: string;
  intent?: string;
  usedTools?: string[];
  orchestrator?: string;
  source?: "backend" | "fallback";
}

export interface AssistantProductResult {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  price: number;
  currency: string;
  stock: number;
}
