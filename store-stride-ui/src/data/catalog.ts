import type {
  AdminUser,
  Banner,
  Brand,
  Category,
  Coupon,
  Customer,
  Order,
  OrderStatus,
  Product,
  Review,
} from "@/types";

/** Deterministic pseudo random so SSR and client agree. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const img = (seed: string, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const categories: Category[] = [
  {
    id: "CAT01",
    name: "Electronics",
    slug: "electronics",
    image: img("electronics-cat", 600, 600),
    description: "Audio, wearables, mobiles and smart devices.",
    status: "active",
    subcategories: [
      { id: "SUB01", name: "Headphones", slug: "headphones", status: "active" },
      { id: "SUB02", name: "Smart Watches", slug: "smart-watches", status: "active" },
      { id: "SUB03", name: "Speakers", slug: "speakers", status: "active" },
    ],
  },
  {
    id: "CAT02",
    name: "Fashion",
    slug: "fashion",
    image: img("fashion-cat", 600, 600),
    description: "Everyday and occasion wear for all.",
    status: "active",
    subcategories: [
      { id: "SUB04", name: "T-Shirts", slug: "t-shirts", status: "active" },
      { id: "SUB05", name: "Footwear", slug: "footwear", status: "active" },
      { id: "SUB06", name: "Jackets", slug: "jackets", status: "active" },
    ],
  },
  {
    id: "CAT03",
    name: "Beauty",
    slug: "beauty",
    image: img("beauty-cat", 600, 600),
    description: "Skincare, fragrance and grooming.",
    status: "active",
    subcategories: [
      { id: "SUB07", name: "Skincare", slug: "skincare", status: "active" },
      { id: "SUB08", name: "Fragrance", slug: "fragrance", status: "active" },
    ],
  },
  {
    id: "CAT04",
    name: "Home",
    slug: "home",
    image: img("home-cat", 600, 600),
    description: "Kitchen, decor and furnishing essentials.",
    status: "active",
    subcategories: [
      { id: "SUB09", name: "Kitchen", slug: "kitchen", status: "active" },
      { id: "SUB10", name: "Decor", slug: "decor", status: "active" },
    ],
  },
  {
    id: "CAT05",
    name: "Grocery",
    slug: "grocery",
    image: img("grocery-cat", 600, 600),
    description: "Daily staples and gourmet picks.",
    status: "active",
    subcategories: [
      { id: "SUB11", name: "Beverages", slug: "beverages", status: "active" },
      { id: "SUB12", name: "Snacks", slug: "snacks", status: "active" },
    ],
  },
  {
    id: "CAT06",
    name: "Sports",
    slug: "sports",
    image: img("sports-cat", 600, 600),
    description: "Fitness gear and outdoor equipment.",
    status: "active",
    subcategories: [
      { id: "SUB13", name: "Fitness", slug: "fitness", status: "active" },
      { id: "SUB14", name: "Outdoor", slug: "outdoor", status: "active" },
    ],
  },
  {
    id: "CAT07",
    name: "Accessories",
    slug: "accessories",
    image: img("accessories-cat", 600, 600),
    description: "Bags, eyewear and travel add-ons.",
    status: "active",
    subcategories: [
      { id: "SUB15", name: "Bags", slug: "bags", status: "active" },
      { id: "SUB16", name: "Eyewear", slug: "eyewear", status: "active" },
    ],
  },
];

export const brands: Brand[] = [
  "Auralis",
  "Nordvik",
  "Kaya",
  "Terrafit",
  "Lumen",
  "Meridian",
  "Orbit",
  "Saanvi",
].map((name, i) => ({
  id: `BR${String(i + 1).padStart(2, "0")}`,
  name,
  slug: name.toLowerCase(),
  logo: img(`brand-${name}`, 200, 200),
  productCount: 0,
  status: "active" as const,
}));

const nouns: Record<string, string[]> = {
  headphones: ["Wireless Headphone", "Noise Cancelling Headset", "Studio Over-Ear"],
  "smart-watches": ["Smart Watch", "Fitness Band", "AMOLED Watch"],
  speakers: ["Bluetooth Speaker", "Party Speaker", "Soundbar"],
  "t-shirts": ["Cotton T-Shirt", "Oversized Tee", "Polo T-Shirt"],
  footwear: ["Running Shoes", "Casual Sneakers", "Trail Shoes"],
  jackets: ["Puffer Jacket", "Windcheater", "Denim Jacket"],
  skincare: ["Vitamin C Serum", "Hydrating Moisturiser", "Sunscreen SPF 50"],
  fragrance: ["Eau De Parfum", "Body Mist", "Oud Perfume"],
  kitchen: ["Cookware Set", "Air Fryer", "Steel Bottle"],
  decor: ["Table Lamp", "Wall Art Frame", "Ceramic Vase"],
  beverages: ["Cold Brew Coffee", "Green Tea Pack", "Protein Shake"],
  snacks: ["Trail Mix", "Roasted Almonds", "Millet Cookies"],
  fitness: ["Yoga Mat", "Adjustable Dumbbell", "Resistance Band Set"],
  outdoor: ["Trekking Backpack", "Camping Tent", "Insulated Flask"],
  bags: ["Laptop Backpack", "Duffle Bag", "Sling Bag"],
  eyewear: ["Polarized Sunglasses", "Blue Light Glasses", "Aviator Sunglasses"],
};

const colorPool = ["Black", "White", "Navy", "Beige", "Olive", "Rose"];
const sizePool = ["S", "M", "L", "XL"];

function build(): Product[] {
  const rand = rng(42);
  const list: Product[] = [];
  let n = 1000;
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      const names: string[] = nouns[sub.slug] ?? [sub.name];
      for (let i = 0; i < names.length; i++) {
        n += 1;
        const brand = brands[Math.floor(rand() * brands.length)]!;
        const mrp = Math.round((800 + rand() * 12000) / 10) * 10;
        const price = Math.round((mrp * (0.55 + rand() * 0.35)) / 10) * 10;
        const stock = Math.floor(rand() * 90);
        const label = names[i]!;
        const name = `${brand.name} ${label}`;
        const id = `${cat.slug.slice(0, 2).toUpperCase()}${n}`;
        list.push({
          id,
          sku: `SKU-${id}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          brand: brand.name,
          category: cat.name,
          categorySlug: cat.slug,
          subcategory: sub.name,
          shortDescription: `${label} by ${brand.name} — built for everyday performance with a premium finish.`,
          description: `The ${name} blends thoughtful engineering with a refined design language. Crafted from durable materials and tested for daily use, it offers dependable performance, comfortable ergonomics and a finish that holds up over time. Backed by a 1 year brand warranty and easy 7-day returns.`,
          images: [1, 2, 3, 4].map((k) => img(`${id}-${k}`)),
          mrp,
          price,
          costPrice: Math.round(price * 0.62),
          rating: Math.round((3.4 + rand() * 1.6) * 10) / 10,
          reviewCount: 20 + Math.floor(rand() * 1800),
          stock,
          reserved: Math.floor(rand() * 6),
          minStock: 10,
          colors: colorPool.slice(0, 2 + Math.floor(rand() * 3)),
          sizes: cat.slug === "fashion" ? sizePool : [],
          specifications: [
            { label: "Brand", value: brand.name },
            { label: "Category", value: `${cat.name} / ${sub.name}` },
            { label: "Warranty", value: "1 Year" },
            { label: "Country of Origin", value: "India" },
            { label: "Return Policy", value: "7 days replacement" },
          ],
          tags: [cat.slug, sub.slug, brand.slug, label.toLowerCase()],
          status: rand() > 0.12 ? "active" : rand() > 0.5 ? "draft" : "inactive",
          createdAt: new Date(2026, 0, 1 + Math.floor(rand() * 200)).toISOString(),
          featured: rand() > 0.6,
          trending: rand() > 0.6,
          bestSeller: rand() > 0.65,
          deal: rand() > 0.7,
        });
      }
    }
  }
  // Guarantee the demo product referenced by the assistant.
  list[0] = {
    ...list[0]!,
    id: "WH1001",
    sku: "SKU-WH1001",
    name: "Auralis WH1001 Wireless Headphone",
    price: 2799,
    mrp: 4999,
    stock: 42,
    images: [1, 2, 3, 4].map((k) => img(`WH1001-${k}`)),
  };
  return list;
}

export const products: Product[] = build();

for (const b of brands) {
  b.productCount = products.filter((p) => p.brand === b.name).length;
}

export const customers: Customer[] = [
  "Aarav Sharma",
  "Diya Nair",
  "Kabir Mehta",
  "Ishita Rao",
  "Rohan Verma",
  "Ananya Iyer",
  "Vivaan Gupta",
  "Meera Joshi",
  "Arjun Reddy",
  "Sara Khan",
  "Nikhil Bose",
  "Tara Singh",
].map((name, i) => {
  const rand = rng(100 + i);
  return {
    id: `CUS${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.split(" ")[0]!.toLowerCase()}@example.com`,
    phone: `+91 9${String(800000000 + Math.floor(rand() * 99999999)).slice(0, 9)}`,
    avatar: img(`avatar-${i}`, 120, 120),
    joined: new Date(2025, i % 12, 3 + i).toISOString(),
    orders: 1 + Math.floor(rand() * 18),
    spent: 2500 + Math.floor(rand() * 90000),
    status: i % 9 === 0 ? "blocked" : "active",
  };
});

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const orders: Order[] = Array.from({ length: 28 }, (_, i) => {
  const rand = rng(500 + i);
  const cust = customers[i % customers.length]!;
  const items = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => {
    const p = products[Math.floor(rand() * products.length)]!;
    return {
      productId: p.id,
      name: p.name,
      image: p.images[0]!,
      variant: p.sizes.length ? `Size ${p.sizes[0]}` : p.colors[0]!,
      price: p.price,
      quantity: 1 + Math.floor(rand() * 2),
    };
  });
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const discount = Math.round(subtotal * 0.05);
  const shipping = subtotal > 999 ? 0 : 49;
  const status = statuses[i % statuses.length]!;
  const date = new Date(2026, 6, 1 + (i % 28)).toISOString();
  return {
    id: `ORD${10240 + i}`,
    customerId: cust.id,
    customerName: cust.name,
    email: cust.email,
    date,
    items,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    status,
    payment: {
      method: ["UPI", "Credit Card", "Cash on Delivery", "Wallet"][i % 4]!,
      status: status === "cancelled" ? "refunded" : status === "pending" ? "pending" : "paid",
    },
    address: {
      name: cust.name,
      phone: cust.phone,
      line1: `${12 + i} Lotus Residency, Sector ${3 + (i % 20)}`,
      city: ["Bengaluru", "Mumbai", "Pune", "Delhi"][i % 4]!,
      state: ["Karnataka", "Maharashtra", "Maharashtra", "Delhi"][i % 4]!,
      pincode: `56${String(1000 + i).slice(0, 4)}`,
    },
    timeline: [
      { label: "Order placed", date, done: true },
      { label: "Payment confirmed", date, done: status !== "pending" },
      {
        label: "Shipped",
        date,
        done: ["shipped", "delivered"].includes(status),
      },
      { label: "Delivered", date, done: status === "delivered" },
    ],
  };
});

export const reviews: Review[] = Array.from({ length: 24 }, (_, i) => {
  const p = products[(i * 3) % products.length]!;
  return {
    id: `REV${100 + i}`,
    productId: p.id,
    productName: p.name,
    customer: customers[i % customers.length]!.name,
    rating: 3 + (i % 3),
    title: ["Great value", "Works as described", "Solid build quality"][i % 3]!,
    body: "Delivery was quick and the packaging was neat. Quality feels premium for the price and it has held up well over a few weeks of daily use.",
    date: new Date(2026, 5, 1 + (i % 28)).toISOString(),
    status: (["published", "pending", "rejected"] as const)[i % 3]!,
  };
});

export const coupons: Coupon[] = [
  {
    id: "CP1",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 999,
    usage: 421,
    limit: 1000,
    expiry: "2026-12-31",
    status: "active",
  },
  {
    id: "CP2",
    code: "FLAT500",
    type: "flat",
    value: 500,
    minOrder: 2999,
    usage: 189,
    limit: 500,
    expiry: "2026-10-31",
    status: "active",
  },
  {
    id: "CP3",
    code: "BIGSALE25",
    type: "percent",
    value: 25,
    minOrder: 4999,
    usage: 78,
    limit: 300,
    expiry: "2026-09-15",
    status: "active",
  },
  {
    id: "CP4",
    code: "SUMMER15",
    type: "percent",
    value: 15,
    minOrder: 1499,
    usage: 500,
    limit: 500,
    expiry: "2026-06-30",
    status: "expired",
  },
];

export const banners: Banner[] = [
  {
    id: "BN1",
    title: "Monsoon Edit",
    subtitle: "Up to 60% off on premium audio",
    image: img("banner-1", 1400, 700),
    cta: "Shop Electronics",
    placement: "hero",
    status: "active",
  },
  {
    id: "BN2",
    title: "Wardrobe Refresh",
    subtitle: "New season fashion drops",
    image: img("banner-2", 1000, 600),
    cta: "Explore Fashion",
    placement: "grid",
    status: "active",
  },
  {
    id: "BN3",
    title: "Home Essentials",
    subtitle: "Everyday value, curated",
    image: img("banner-3", 1000, 600),
    cta: "Shop Home",
    placement: "grid",
    status: "active",
  },
  {
    id: "BN4",
    title: "Free delivery over ₹999",
    subtitle: "On all prepaid orders",
    image: img("banner-4", 1400, 300),
    cta: "Know more",
    placement: "strip",
    status: "inactive",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "AU1",
    name: "Priya Menon",
    email: "priya@shop.admin",
    role: "Super Admin",
    lastActive: "2026-08-21",
    status: "active",
  },
  {
    id: "AU2",
    name: "Rahul Das",
    email: "rahul@shop.admin",
    role: "Manager",
    lastActive: "2026-08-20",
    status: "active",
  },
  {
    id: "AU3",
    name: "Fatima Sheikh",
    email: "fatima@shop.admin",
    role: "Catalog",
    lastActive: "2026-08-18",
    status: "active",
  },
  {
    id: "AU4",
    name: "Dev Patel",
    email: "dev@shop.admin",
    role: "Support",
    lastActive: "2026-07-30",
    status: "inactive",
  },
];

export const productAttributes = [
  { id: "AT1", name: "Color", type: "Swatch", values: colorPool, usedIn: 42 },
  { id: "AT2", name: "Size", type: "Dropdown", values: sizePool, usedIn: 18 },
  {
    id: "AT3",
    name: "Material",
    type: "Text",
    values: ["Cotton", "Leather", "Steel", "Plastic"],
    usedIn: 26,
  },
  {
    id: "AT4",
    name: "Warranty",
    type: "Dropdown",
    values: ["6 Months", "1 Year", "2 Years"],
    usedIn: 33,
  },
];

export const popularSearches = [
  "wireless headphones",
  "running shoes",
  "vitamin c serum",
  "air fryer",
  "trekking backpack",
  "smart watch",
];
