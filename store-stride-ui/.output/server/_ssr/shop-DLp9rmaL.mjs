import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DLp9rmaL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Deterministic pseudo random so SSR and client agree. */
function rng(seed) {
	let s = seed;
	return () => {
		s = (s * 1103515245 + 12345) % 2147483648;
		return s / 2147483648;
	};
}
var img = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
var categories = [
	{
		id: "CAT01",
		name: "Electronics",
		slug: "electronics",
		image: img("electronics-cat", 600, 600),
		description: "Audio, wearables, mobiles and smart devices.",
		status: "active",
		subcategories: [
			{
				id: "SUB01",
				name: "Headphones",
				slug: "headphones",
				status: "active"
			},
			{
				id: "SUB02",
				name: "Smart Watches",
				slug: "smart-watches",
				status: "active"
			},
			{
				id: "SUB03",
				name: "Speakers",
				slug: "speakers",
				status: "active"
			}
		]
	},
	{
		id: "CAT02",
		name: "Fashion",
		slug: "fashion",
		image: img("fashion-cat", 600, 600),
		description: "Everyday and occasion wear for all.",
		status: "active",
		subcategories: [
			{
				id: "SUB04",
				name: "T-Shirts",
				slug: "t-shirts",
				status: "active"
			},
			{
				id: "SUB05",
				name: "Footwear",
				slug: "footwear",
				status: "active"
			},
			{
				id: "SUB06",
				name: "Jackets",
				slug: "jackets",
				status: "active"
			}
		]
	},
	{
		id: "CAT03",
		name: "Beauty",
		slug: "beauty",
		image: img("beauty-cat", 600, 600),
		description: "Skincare, fragrance and grooming.",
		status: "active",
		subcategories: [{
			id: "SUB07",
			name: "Skincare",
			slug: "skincare",
			status: "active"
		}, {
			id: "SUB08",
			name: "Fragrance",
			slug: "fragrance",
			status: "active"
		}]
	},
	{
		id: "CAT04",
		name: "Home",
		slug: "home",
		image: img("home-cat", 600, 600),
		description: "Kitchen, decor and furnishing essentials.",
		status: "active",
		subcategories: [{
			id: "SUB09",
			name: "Kitchen",
			slug: "kitchen",
			status: "active"
		}, {
			id: "SUB10",
			name: "Decor",
			slug: "decor",
			status: "active"
		}]
	},
	{
		id: "CAT05",
		name: "Grocery",
		slug: "grocery",
		image: img("grocery-cat", 600, 600),
		description: "Daily staples and gourmet picks.",
		status: "active",
		subcategories: [{
			id: "SUB11",
			name: "Beverages",
			slug: "beverages",
			status: "active"
		}, {
			id: "SUB12",
			name: "Snacks",
			slug: "snacks",
			status: "active"
		}]
	},
	{
		id: "CAT06",
		name: "Sports",
		slug: "sports",
		image: img("sports-cat", 600, 600),
		description: "Fitness gear and outdoor equipment.",
		status: "active",
		subcategories: [{
			id: "SUB13",
			name: "Fitness",
			slug: "fitness",
			status: "active"
		}, {
			id: "SUB14",
			name: "Outdoor",
			slug: "outdoor",
			status: "active"
		}]
	},
	{
		id: "CAT07",
		name: "Accessories",
		slug: "accessories",
		image: img("accessories-cat", 600, 600),
		description: "Bags, eyewear and travel add-ons.",
		status: "active",
		subcategories: [{
			id: "SUB15",
			name: "Bags",
			slug: "bags",
			status: "active"
		}, {
			id: "SUB16",
			name: "Eyewear",
			slug: "eyewear",
			status: "active"
		}]
	}
];
var brands = [
	"Auralis",
	"Nordvik",
	"Kaya",
	"Terrafit",
	"Lumen",
	"Meridian",
	"Orbit",
	"Saanvi"
].map((name, i) => ({
	id: `BR${String(i + 1).padStart(2, "0")}`,
	name,
	slug: name.toLowerCase(),
	logo: img(`brand-${name}`, 200, 200),
	productCount: 0,
	status: "active"
}));
var nouns = {
	headphones: [
		"Wireless Headphone",
		"Noise Cancelling Headset",
		"Studio Over-Ear"
	],
	"smart-watches": [
		"Smart Watch",
		"Fitness Band",
		"AMOLED Watch"
	],
	speakers: [
		"Bluetooth Speaker",
		"Party Speaker",
		"Soundbar"
	],
	"t-shirts": [
		"Cotton T-Shirt",
		"Oversized Tee",
		"Polo T-Shirt"
	],
	footwear: [
		"Running Shoes",
		"Casual Sneakers",
		"Trail Shoes"
	],
	jackets: [
		"Puffer Jacket",
		"Windcheater",
		"Denim Jacket"
	],
	skincare: [
		"Vitamin C Serum",
		"Hydrating Moisturiser",
		"Sunscreen SPF 50"
	],
	fragrance: [
		"Eau De Parfum",
		"Body Mist",
		"Oud Perfume"
	],
	kitchen: [
		"Cookware Set",
		"Air Fryer",
		"Steel Bottle"
	],
	decor: [
		"Table Lamp",
		"Wall Art Frame",
		"Ceramic Vase"
	],
	beverages: [
		"Cold Brew Coffee",
		"Green Tea Pack",
		"Protein Shake"
	],
	snacks: [
		"Trail Mix",
		"Roasted Almonds",
		"Millet Cookies"
	],
	fitness: [
		"Yoga Mat",
		"Adjustable Dumbbell",
		"Resistance Band Set"
	],
	outdoor: [
		"Trekking Backpack",
		"Camping Tent",
		"Insulated Flask"
	],
	bags: [
		"Laptop Backpack",
		"Duffle Bag",
		"Sling Bag"
	],
	eyewear: [
		"Polarized Sunglasses",
		"Blue Light Glasses",
		"Aviator Sunglasses"
	]
};
var colorPool = [
	"Black",
	"White",
	"Navy",
	"Beige",
	"Olive",
	"Rose"
];
var sizePool = [
	"S",
	"M",
	"L",
	"XL"
];
function build() {
	const rand = rng(42);
	const list = [];
	let n = 1e3;
	for (const cat of categories) for (const sub of cat.subcategories) {
		const names = nouns[sub.slug] ?? [sub.name];
		for (let i = 0; i < names.length; i++) {
			n += 1;
			const brand = brands[Math.floor(rand() * brands.length)];
			const mrp = Math.round((800 + rand() * 12e3) / 10) * 10;
			const price = Math.round(mrp * (.55 + rand() * .35) / 10) * 10;
			const stock = Math.floor(rand() * 90);
			const label = names[i];
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
				images: [
					1,
					2,
					3,
					4
				].map((k) => img(`${id}-${k}`)),
				mrp,
				price,
				costPrice: Math.round(price * .62),
				rating: Math.round((3.4 + rand() * 1.6) * 10) / 10,
				reviewCount: 20 + Math.floor(rand() * 1800),
				stock,
				reserved: Math.floor(rand() * 6),
				minStock: 10,
				colors: colorPool.slice(0, 2 + Math.floor(rand() * 3)),
				sizes: cat.slug === "fashion" ? sizePool : [],
				specifications: [
					{
						label: "Brand",
						value: brand.name
					},
					{
						label: "Category",
						value: `${cat.name} / ${sub.name}`
					},
					{
						label: "Warranty",
						value: "1 Year"
					},
					{
						label: "Country of Origin",
						value: "India"
					},
					{
						label: "Return Policy",
						value: "7 days replacement"
					}
				],
				tags: [
					cat.slug,
					sub.slug,
					brand.slug,
					label.toLowerCase()
				],
				status: rand() > .12 ? "active" : rand() > .5 ? "draft" : "inactive",
				createdAt: new Date(2026, 0, 1 + Math.floor(rand() * 200)).toISOString(),
				featured: rand() > .6,
				trending: rand() > .6,
				bestSeller: rand() > .65,
				deal: rand() > .7
			});
		}
	}
	list[0] = {
		...list[0],
		id: "WH1001",
		sku: "SKU-WH1001",
		name: "Auralis WH1001 Wireless Headphone",
		price: 2799,
		mrp: 4999,
		stock: 42,
		images: [
			1,
			2,
			3,
			4
		].map((k) => img(`WH1001-${k}`))
	};
	return list;
}
var products = build();
for (const b of brands) b.productCount = products.filter((p) => p.brand === b.name).length;
var customers = [
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
	"Tara Singh"
].map((name, i) => {
	const rand = rng(100 + i);
	return {
		id: `CUS${String(i + 1).padStart(3, "0")}`,
		name,
		email: `${name.split(" ")[0].toLowerCase()}@example.com`,
		phone: `+91 9${String(8e8 + Math.floor(rand() * 99999999)).slice(0, 9)}`,
		avatar: img(`avatar-${i}`, 120, 120),
		joined: new Date(2025, i % 12, 3 + i).toISOString(),
		orders: 1 + Math.floor(rand() * 18),
		spent: 2500 + Math.floor(rand() * 9e4),
		status: i % 9 === 0 ? "blocked" : "active"
	};
});
var statuses = [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
var orders = Array.from({ length: 28 }, (_, i) => {
	const rand = rng(500 + i);
	const cust = customers[i % customers.length];
	const items = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => {
		const p = products[Math.floor(rand() * products.length)];
		return {
			productId: p.id,
			name: p.name,
			image: p.images[0],
			variant: p.sizes.length ? `Size ${p.sizes[0]}` : p.colors[0],
			price: p.price,
			quantity: 1 + Math.floor(rand() * 2)
		};
	});
	const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
	const discount = Math.round(subtotal * .05);
	const shipping = subtotal > 999 ? 0 : 49;
	const status = statuses[i % statuses.length];
	const date = new Date(2026, 6, 1 + i % 28).toISOString();
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
			method: [
				"UPI",
				"Credit Card",
				"Cash on Delivery",
				"Wallet"
			][i % 4],
			status: status === "cancelled" ? "refunded" : status === "pending" ? "pending" : "paid"
		},
		address: {
			name: cust.name,
			phone: cust.phone,
			line1: `${12 + i} Lotus Residency, Sector ${3 + i % 20}`,
			city: [
				"Bengaluru",
				"Mumbai",
				"Pune",
				"Delhi"
			][i % 4],
			state: [
				"Karnataka",
				"Maharashtra",
				"Maharashtra",
				"Delhi"
			][i % 4],
			pincode: `56${String(1e3 + i).slice(0, 4)}`
		},
		timeline: [
			{
				label: "Order placed",
				date,
				done: true
			},
			{
				label: "Payment confirmed",
				date,
				done: status !== "pending"
			},
			{
				label: "Shipped",
				date,
				done: ["shipped", "delivered"].includes(status)
			},
			{
				label: "Delivered",
				date,
				done: status === "delivered"
			}
		]
	};
});
var reviews = Array.from({ length: 24 }, (_, i) => {
	const p = products[i * 3 % products.length];
	return {
		id: `REV${100 + i}`,
		productId: p.id,
		productName: p.name,
		customer: customers[i % customers.length].name,
		rating: 3 + i % 3,
		title: [
			"Great value",
			"Works as described",
			"Solid build quality"
		][i % 3],
		body: "Delivery was quick and the packaging was neat. Quality feels premium for the price and it has held up well over a few weeks of daily use.",
		date: new Date(2026, 5, 1 + i % 28).toISOString(),
		status: [
			"published",
			"pending",
			"rejected"
		][i % 3]
	};
});
var coupons = [
	{
		id: "CP1",
		code: "WELCOME10",
		type: "percent",
		value: 10,
		minOrder: 999,
		usage: 421,
		limit: 1e3,
		expiry: "2026-12-31",
		status: "active"
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
		status: "active"
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
		status: "active"
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
		status: "expired"
	}
];
var banners = [
	{
		id: "BN1",
		title: "Monsoon Edit",
		subtitle: "Up to 60% off on premium audio",
		image: img("banner-1", 1400, 700),
		cta: "Shop Electronics",
		placement: "hero",
		status: "active"
	},
	{
		id: "BN2",
		title: "Wardrobe Refresh",
		subtitle: "New season fashion drops",
		image: img("banner-2", 1e3, 600),
		cta: "Explore Fashion",
		placement: "grid",
		status: "active"
	},
	{
		id: "BN3",
		title: "Home Essentials",
		subtitle: "Everyday value, curated",
		image: img("banner-3", 1e3, 600),
		cta: "Shop Home",
		placement: "grid",
		status: "active"
	},
	{
		id: "BN4",
		title: "Free delivery over ₹999",
		subtitle: "On all prepaid orders",
		image: img("banner-4", 1400, 300),
		cta: "Know more",
		placement: "strip",
		status: "inactive"
	}
];
var adminUsers = [
	{
		id: "AU1",
		name: "Priya Menon",
		email: "priya@shop.admin",
		role: "Super Admin",
		lastActive: "2026-08-21",
		status: "active"
	},
	{
		id: "AU2",
		name: "Rahul Das",
		email: "rahul@shop.admin",
		role: "Manager",
		lastActive: "2026-08-20",
		status: "active"
	},
	{
		id: "AU3",
		name: "Fatima Sheikh",
		email: "fatima@shop.admin",
		role: "Catalog",
		lastActive: "2026-08-18",
		status: "active"
	},
	{
		id: "AU4",
		name: "Dev Patel",
		email: "dev@shop.admin",
		role: "Support",
		lastActive: "2026-07-30",
		status: "inactive"
	}
];
var productAttributes = [
	{
		id: "AT1",
		name: "Color",
		type: "Swatch",
		values: colorPool,
		usedIn: 42
	},
	{
		id: "AT2",
		name: "Size",
		type: "Dropdown",
		values: sizePool,
		usedIn: 18
	},
	{
		id: "AT3",
		name: "Material",
		type: "Text",
		values: [
			"Cotton",
			"Leather",
			"Steel",
			"Plastic"
		],
		usedIn: 26
	},
	{
		id: "AT4",
		name: "Warranty",
		type: "Dropdown",
		values: [
			"6 Months",
			"1 Year",
			"2 Years"
		],
		usedIn: 33
	}
];
var popularSearches = [
	"wireless headphones",
	"running shoes",
	"vitamin c serum",
	"air fryer",
	"trekking backpack",
	"smart watch"
];
var API_BASE = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_API_URL"] || "http://localhost:8000/api/v1";
var productCache = /* @__PURE__ */ new Map();
function mapApiProduct(product) {
	const variant = product.variants?.find((item) => item.is_default) || product.variants?.[0] || {};
	return {
		id: product.id,
		sku: variant.sku || product.slug,
		name: product.name,
		slug: product.slug,
		brand: product.brand_name || "Unbranded",
		category: product.category_name || "Uncategorized",
		categorySlug: product.category_slug || "uncategorized",
		subcategory: "",
		description: product.description || "",
		shortDescription: product.short_description || "",
		images: [...product.media || []].sort((a, b) => a.sort_order - b.sort_order).map((media) => media.media_url),
		mrp: Number(variant.price || 0),
		price: Number(variant.price || 0),
		costPrice: 0,
		rating: Number(product.average_rating || 0),
		reviewCount: Number(product.review_count || 0),
		stock: Number(variant.quantity_available || 0),
		reserved: Number(variant.inventory_reserved || 0),
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
		deal: false
	};
}
var authService = {
	async register(email, full_name, password) {
		const response = await fetch(`${API_BASE}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				full_name,
				password
			})
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
	async login(email, password) {
		const response = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				password
			})
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
	async refresh() {
		const tokens = this.getTokens();
		if (!tokens) throw new Error("No refresh token available");
		const response = await fetch(`${API_BASE}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token: tokens.refresh_token })
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
	async me() {
		const tokens = this.getTokens();
		if (!tokens) throw new Error("Not authenticated");
		const response = await fetch(`${API_BASE}/auth/me`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${tokens.access_token}`,
				"Content-Type": "application/json"
			}
		});
		if (!response.ok) throw new Error("Failed to fetch user profile");
		const user = await response.json();
		this.saveUser(user);
		return user;
	},
	saveTokens(accessToken, refreshToken) {
		localStorage.setItem("authTokens", JSON.stringify({
			access_token: accessToken,
			refresh_token: refreshToken
		}));
	},
	saveUser(user) {
		localStorage.setItem("authUser", JSON.stringify(user));
	},
	getTokens() {
		const stored = localStorage.getItem("authTokens");
		return stored ? JSON.parse(stored) : null;
	},
	getUser() {
		const stored = localStorage.getItem("authUser");
		return stored ? JSON.parse(stored) : null;
	},
	getAccessToken() {
		return this.getTokens()?.access_token || null;
	},
	getUserRoles() {
		return this.getUser()?.roles || [];
	},
	isAdmin() {
		const roles = this.getUserRoles();
		return roles.includes("super_admin") || roles.includes("admin");
	},
	isSeller() {
		return this.getUserRoles().includes("seller_owner");
	},
	clearTokens() {
		localStorage.removeItem("authTokens");
		localStorage.removeItem("authUser");
	},
	logout() {
		this.clearTokens();
	}
};
var productService = {
	async list(query) {
		const params = new URLSearchParams();
		if (query?.search) params.set("q", query.search);
		query?.category?.forEach((value) => params.append("category", value));
		query?.brands?.forEach((value) => params.append("brand", value));
		if (query?.minPrice !== void 0) params.set("min_price", String(query.minPrice));
		if (query?.maxPrice !== void 0) params.set("max_price", String(query.maxPrice));
		if (query?.minRating !== void 0) params.set("min_rating", String(query.minRating));
		if (query?.sort) params.set("sort", query.sort);
		params.set("page", String(query?.page || 1));
		params.set("per_page", String(query?.perPage || 12));
		const response = await fetch(`${API_BASE}/products?${params.toString()}`);
		if (!response.ok) throw new Error("Unable to load products from the server.");
		const data = await response.json();
		const items = data.items.map(mapApiProduct);
		items.forEach((product) => productCache.set(product.id, product));
		return {
			items,
			total: data.total,
			page: data.page,
			perPage: data.per_page,
			pages: data.pages
		};
	},
	byId(id) {
		return productCache.get(id) || products.find((p) => p.id === id);
	},
	byIds(ids) {
		return ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== void 0);
	},
	all() {
		return Array.from(productCache.values());
	},
	async featured() {
		try {
			return (await this.list()).items.slice(0, 8);
		} catch (err) {
			console.warn("Featured products failed:", err);
			return [];
		}
	},
	async trending() {
		try {
			return (await this.list()).items.slice(0, 8);
		} catch (err) {
			console.warn("Trending products failed:", err);
			return [];
		}
	},
	async bestSellers() {
		try {
			return (await this.list()).items.slice(0, 8);
		} catch (err) {
			console.warn("Best sellers failed:", err);
			return [];
		}
	},
	async deals() {
		try {
			return (await this.list()).items.slice(0, 8);
		} catch (err) {
			console.warn("Deals failed:", err);
			return [];
		}
	},
	suggestions(_term) {
		return {
			categories: [],
			brands: [],
			products: []
		};
	},
	get popularSearches() {
		return popularSearches;
	}
};
var catalogService = {
	async categories() {
		const response = await fetch(`${API_BASE}/categories`);
		if (!response.ok) throw new Error("Failed to fetch categories");
		return response.json();
	},
	async brands() {
		const response = await fetch(`${API_BASE}/brands`);
		if (!response.ok) throw new Error("Failed to fetch brands");
		return response.json();
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
	}
};
var chatbotService = { async reply(message, history) {
	const responses = [
		"How can I help you find the perfect product?",
		"Have you checked our latest deals?",
		"Would you like me to recommend something?",
		"Our customer service team is here to help!"
	];
	return responses[Math.floor(Math.random() * responses.length)];
} };
var EMPTY = {
	cart: [],
	wishlist: [],
	recentlyViewed: [],
	recentSearches: [],
	user: null,
	admin: null,
	tokens: null,
	addresses: [{
		id: "AD1",
		name: "Aastha Sharma",
		phone: "+91 98765 43210",
		line1: "402, Sunrise Apartments, 12th Main",
		city: "Bengaluru",
		state: "Karnataka",
		pincode: "560038",
		type: "home"
	}],
	chat: [],
	coupon: null
};
var KEY = "shopnest-state-v1";
var ShopContext = (0, import_react.createContext)(null);
function ShopProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(EMPTY);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setState({
				...EMPTY,
				...JSON.parse(raw)
			});
			const authUserRaw = localStorage.getItem("authUser");
			if (authUserRaw) {
				const authUser = JSON.parse(authUserRaw);
				setState((s) => ({
					...s,
					user: authUser
				}));
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
	}, [state, hydrated]);
	const patch = (0, import_react.useCallback)((fn) => setState(fn), []);
	const addToCart = (0, import_react.useCallback)((productId, quantity = 1, opts) => {
		patch((s) => {
			const cart = s.cart.find((l) => l.productId === productId) ? s.cart.map((l) => l.productId === productId ? {
				...l,
				quantity: l.quantity + quantity
			} : l) : [...s.cart, {
				productId,
				quantity,
				...opts?.color ? { color: opts.color } : {},
				...opts?.size ? { size: opts.size } : {}
			}];
			return {
				...s,
				cart
			};
		});
		toast.success("Added to cart");
	}, [patch]);
	const value = (0, import_react.useMemo)(() => {
		const cartProducts = state.cart.map((line) => {
			const product = productService.byId(line.productId);
			return product ? {
				product,
				line
			} : null;
		}).filter(Boolean);
		const subtotal = cartProducts.reduce((sum, { product, line }) => sum + product.price * line.quantity, 0);
		const couponDiscount = state.coupon === "WELCOME10" ? Math.round(subtotal * .1) : state.coupon === "FLAT500" && subtotal >= 2999 ? 500 : state.coupon === "BIGSALE25" && subtotal >= 4999 ? Math.round(subtotal * .25) : 0;
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
				total: Math.max(0, subtotal - couponDiscount + shipping)
			},
			addToCart,
			updateQuantity: (productId, quantity) => patch((s) => ({
				...s,
				cart: quantity <= 0 ? s.cart.filter((l) => l.productId !== productId) : s.cart.map((l) => l.productId === productId ? {
					...l,
					quantity
				} : l)
			})),
			removeFromCart: (productId) => {
				patch((s) => ({
					...s,
					cart: s.cart.filter((l) => l.productId !== productId)
				}));
				toast.success("Removed from cart");
			},
			clearCart: () => patch((s) => ({
				...s,
				cart: [],
				coupon: null
			})),
			toggleWishlist: (productId) => {
				patch((s) => {
					const has = s.wishlist.includes(productId);
					toast.success(has ? "Removed from wishlist" : "Added to wishlist");
					return {
						...s,
						wishlist: has ? s.wishlist.filter((id) => id !== productId) : [productId, ...s.wishlist]
					};
				});
				return !state.wishlist.includes(productId);
			},
			isWishlisted: (productId) => state.wishlist.includes(productId),
			markViewed: (productId) => patch((s) => ({
				...s,
				recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 12)
			})),
			addRecentSearch: (term) => patch((s) => ({
				...s,
				recentSearches: term.trim() ? [term.trim(), ...s.recentSearches.filter((t) => t !== term.trim())].slice(0, 6) : s.recentSearches
			})),
			applyCoupon: (code) => {
				const valid = [
					"WELCOME10",
					"FLAT500",
					"BIGSALE25"
				].includes(code.toUpperCase());
				patch((s) => ({
					...s,
					coupon: valid ? code.toUpperCase() : null
				}));
				if (valid) toast.success(`Coupon ${code.toUpperCase()} applied`);
				else toast.error("Invalid coupon code");
			},
			setUser: (user, tokens) => {
				patch((s) => ({
					...s,
					user,
					tokens: tokens || null
				}));
				if (user) toast.success("Login successful");
			},
			logout: () => {
				patch((s) => ({
					...s,
					user: null,
					tokens: null
				}));
				localStorage.removeItem("authTokens");
				toast.success("Logged out");
			},
			setAdmin: (admin, tokens) => {
				patch((s) => ({
					...s,
					admin,
					tokens: tokens || null
				}));
				if (admin) toast.success("Admin login successful");
			},
			adminLogout: () => {
				patch((s) => ({
					...s,
					admin: null,
					tokens: null
				}));
				localStorage.removeItem("authTokens");
			},
			addAddress: (address) => patch((s) => ({
				...s,
				addresses: [...s.addresses, {
					...address,
					id: `AD${Date.now()}`
				}]
			})),
			pushChat: (message) => patch((s) => ({
				...s,
				chat: [...s.chat, message]
			})),
			resetChat: () => patch((s) => ({
				...s,
				chat: []
			}))
		};
	}, [
		state,
		hydrated,
		addToCart,
		patch
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContext.Provider, {
		value,
		children
	});
}
function useShop() {
	const ctx = (0, import_react.useContext)(ShopContext);
	if (!ctx) throw new Error("useShop must be used within ShopProvider");
	return ctx;
}
//#endregion
export { catalogService as a, orders as c, products as d, useShop as f, brands as i, productAttributes as l, adminUsers as n, categories as o, authService as r, chatbotService as s, ShopProvider as t, productService as u };
