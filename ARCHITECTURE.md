# Store Stride - Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STORE STRIDE                             │
│                    E-Commerce Platform                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                   ┌──────────────────────┐
│  CUSTOMER FRONTEND   │                   │   ADMIN FRONTEND     │
│  React + TanStack    │                   │  React + TanStack    │
│  - Homepage          │                   │  - Dashboard         │
│  - Products List     │◄──────────────────►  - Products Mgmt    │
│  - Product Details   │     HTTP/REST     │  - Categories       │
│  - Cart/Checkout     │                   │  - Orders            │
│  - Orders            │                   │  - Customers        │
│  - Account           │                   │  - Settings         │
└──────────────────────┘                   └──────────────────────┘
         │                                          │
         │             API Gateway                 │
         │          FastAPI Backend               │
         │                                        │
         └────────────────────────┬────────────────┘
                                  │
                    ┌─────────────────────────────┐
                    │     API Endpoints           │
                    │  /api/v1/products          │
                    │  /api/v1/categories        │
                    │  /api/v1/admin/products    │
                    │  /api/v1/admin/categories  │
                    │  etc...                    │
                    └─────────────────────────────┘
                                  │
                    ┌─────────────────────────────┐
                    │   Business Logic            │
                    │   Service Layer             │
                    │  - Product Service          │
                    │  - Catalog Service          │
                    │  - Order Service            │
                    │  - etc...                   │
                    └─────────────────────────────┘
                                  │
                    ┌─────────────────────────────┐
                    │   Data Access Layer         │
                    │   SQLAlchemy ORM            │
                    │  - Models                   │
                    │  - Repositories             │
                    └─────────────────────────────┘
                                  │
                    ┌─────────────────────────────┐
                    │   PostgreSQL Database       │
                    │  - users                    │
                    │  - products                 │
                    │  - categories               │
                    │  - orders                   │
                    │  - customers                │
                    │  - inventory                │
                    │  - etc...                   │
                    └─────────────────────────────┘
```

---

## Core Data Flows

### Flow 1: Admin Creates a Product

```
Admin Panel (Frontend)
    │
    ├─ User fills in product form
    │   - Name: "iPhone 15"
    │   - Category: "Electronics"
    │   - Price: ₹79,999
    │   - Stock: 50
    │   - Images: [URLs]
    │
    └─→ POST /api/v1/admin/products
            │
            ├─ FastAPI validates request
            │ ├─ Check category exists
            │ ├─ Validate price > 0
            │ └─ Validate SKU unique
            │
            └─→ Service Layer
                    │
                    ├─ Create Product record
                    │   INSERT INTO products (name, slug, ...)
                    │
                    ├─ Create ProductVariant record
                    │   INSERT INTO product_variants (sku, price, ...)
                    │
                    ├─ Create ProductMedia records
                    │   INSERT INTO product_media (media_url, ...)
                    │
                    ├─ Create InventoryItem record
                    │   INSERT INTO inventory_items (quantity, ...)
                    │
                    └─→ Database (PostgreSQL)
                            │
                            └─ Data persisted
                                    │
                                    └─→ Response to Admin
                                            │
                                            ├─ 201 Created
                                            ├─ Product ID
                                            └─ Success message

Customer Browsing Website (Meanwhile)
    │
    └─→ GET /api/v1/products
            │
            └─→ Service Layer queries database
                    │
                    └─→ Returns newly created iPhone 15
                            │
                            └─→ Frontend displays product
                                    │
                                    └─ iPhone 15 visible to customers!
```

### Flow 2: Admin Updates Product Price

```
Admin Updates Price
    │
    ├─ User edits product form
    │   - Original price: ₹79,999
    │   - New price: ₹74,999
    │
    └─→ PUT /api/v1/admin/products/{product_id}
            │
            ├─ Service layer updates Product record
            │   UPDATE products SET ... WHERE id = product_id
            │
            ├─ Updates ProductVariant pricing
            │   UPDATE product_variants SET price = 74999 WHERE ...
            │
            ├─ Updates pricing table
            │   UPDATE variant_prices SET amount = 74999 WHERE ...
            │
            └─→ Response: 200 OK

Customer Viewing Product
    │
    ├─ User is on product page
    │
    ├─ Frontend refetches product data
    │   GET /api/v1/products/iphone-15
    │
    └─→ Service layer queries latest data
            │
            └─→ Returns updated price: ₹74,999
                    │
                    └─→ Product page shows NEW price!
```

### Flow 3: Admin Deletes Product

```
Admin Deletes Product
    │
    ├─ Clicks delete button
    │
    └─→ DELETE /api/v1/admin/products/{product_id}
            │
            ├─ Soft delete OR hard delete
            │   - Option A: Set is_deleted = true
            │   - Option B: DELETE FROM products WHERE id = ...
            │
            └─→ Related records handled by CASCADE rules
                    │
                    ├─ product_variants → deleted
                    ├─ product_media → deleted
                    └─ inventory_items → deleted

Customer Browsing Products
    │
    ├─ Frontend requests product list
    │   GET /api/v1/products
    │
    └─→ Only non-deleted products returned
            │
            └─→ Deleted product NO LONGER visible!
```

### Flow 4: Customer Orders Product

```
Customer Checkout
    │
    ├─ User adds product to cart
    │   - Product ID: iPhone-15
    │   - Quantity: 1
    │   - Price: ₹74,999 (fetched from API)
    │
    ├─ User reviews cart
    │   - Total: ₹74,999
    │
    ├─ User initiates checkout
    │
    └─→ POST /api/v1/checkout/orders
            │
            ├─ Backend validates:
            │   ├─ Product exists
            │   ├─ Stock available (> 0)
            │   ├─ Current price (from DB)
            │   └─ No price tampering allowed
            │
            ├─ Creates Order record
            │   INSERT INTO orders (customer_id, total, status='pending')
            │
            ├─ Creates OrderItem records
            │   INSERT INTO order_items (order_id, product_id, quantity, price)
            │
            ├─ Reserves stock
            │   UPDATE inventory_items SET reserved = reserved + 1
            │
            └─→ Response: Order ID, confirmation

Admin Sees New Order
    │
    ├─ Admin Dashboard shows pending order
    │
    ├─ Admin clicks order to view details
    │   GET /api/v1/admin/orders/{order_id}
    │
    └─→ Returns:
            - Customer info
            - Products ordered
            - Price paid
            - Shipping address
            - Timeline of status changes
```

---

## Database Schema (Simplified)

```
products
├─ id (UUID, Primary Key)
├─ name (String)
├─ slug (String, Unique)
├─ description (Text)
├─ category_id (Foreign Key → categories)
├─ brand_id (Foreign Key → brands)
├─ is_published (Boolean)
├─ created_at (Timestamp)
└─ updated_at (Timestamp)

product_variants
├─ id (UUID, Primary Key)
├─ product_id (Foreign Key → products, CASCADE DELETE)
├─ sku (String, Unique)
├─ price (Decimal)
├─ quantity_available (Integer)
└─ is_default (Boolean)

product_media
├─ id (UUID, Primary Key)
├─ product_id (Foreign Key → products, CASCADE DELETE)
├─ media_url (String)
├─ alt_text (String)
└─ sort_order (Integer)

inventory_items
├─ id (UUID, Primary Key)
├─ variant_id (Foreign Key → product_variants)
├─ on_hand (Integer)
├─ reserved (Integer)
└─ available (Integer, calculated)

categories
├─ id (UUID, Primary Key)
├─ name (String)
├─ slug (String, Unique)
├─ parent_id (Foreign Key → categories, Nullable)
└─ created_at (Timestamp)

brands
├─ id (UUID, Primary Key)
├─ name (String)
├─ slug (String, Unique)
└─ created_at (Timestamp)

orders
├─ id (UUID, Primary Key)
├─ customer_id (Foreign Key → customers)
├─ total_amount (Decimal)
├─ status (Enum: pending, confirmed, processing, shipped, delivered, cancelled)
├─ created_at (Timestamp)
└─ updated_at (Timestamp)

order_items
├─ id (UUID, Primary Key)
├─ order_id (Foreign Key → orders, CASCADE DELETE)
├─ product_id (Foreign Key → products)
├─ variant_id (Foreign Key → product_variants)
├─ quantity (Integer)
├─ price_paid (Decimal)
└─ created_at (Timestamp)

customers
├─ id (UUID, Primary Key)
├─ email (String, Unique)
├─ name (String)
├─ phone (String)
├─ status (Enum: active, inactive)
├─ total_orders (Integer)
├─ total_spent (Decimal)
└─ created_at (Timestamp)
```

---

## API Contract

### Request/Response Example

#### Create Product (Admin)

**Request:**
```http
POST /api/v1/admin/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "iPhone 15",
  "slug": "iphone-15",
  "category_id": "cat-electronics",
  "brand_id": "brand-apple",
  "short_description": "Latest iPhone",
  "description": "Advanced camera system...",
  "is_published": true,
  "variants": [
    {
      "name": "128GB",
      "sku": "IP15-128GB",
      "price": 79999,
      "currency": "INR",
      "quantity_available": 50,
      "is_default": true
    }
  ],
  "media": [
    {
      "media_url": "https://cdn.example.com/iphone-15.jpg",
      "alt_text": "iPhone 15 Front View",
      "sort_order": 0
    }
  ]
}
```

**Response:**
```http
201 Created
Content-Type: application/json

{
  "id": "prod-iphone-15",
  "name": "iPhone 15",
  "slug": "iphone-15",
  "category_id": "cat-electronics",
  "brand_id": "brand-apple",
  "short_description": "Latest iPhone",
  "description": "Advanced camera system...",
  "is_published": true,
  "variants": [
    {
      "id": "var-ip15-128gb",
      "name": "128GB",
      "sku": "IP15-128GB",
      "price": 79999,
      "currency": "INR",
      "quantity_available": 50,
      "inventory_on_hand": 50,
      "inventory_reserved": 0,
      "is_default": true
    }
  ],
  "media": [
    {
      "id": "media-1",
      "media_url": "https://cdn.example.com/iphone-15.jpg",
      "alt_text": "iPhone 15 Front View",
      "sort_order": 0
    }
  ]
}
```

#### Get Products (Customer)

**Request:**
```http
GET /api/v1/products?q=iphone&category=electronics&page=1&limit=20
```

**Response:**
```http
200 OK
Content-Type: application/json

{
  "items": [
    {
      "id": "prod-iphone-15",
      "name": "iPhone 15",
      "slug": "iphone-15",
      "category_id": "cat-electronics",
      "brand_id": "brand-apple",
      "short_description": "Latest iPhone",
      "is_published": true,
      "variants": [...],
      "media": [...]
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 20,
  "pages": 1
}
```

---

## Frontend Service Layer

```typescript
// src/services/index.ts

export const productService = {
  async list(query?: ProductQuery) {
    // GET /api/v1/products
    // - Returns paginated products
    // - Supports search, filters, sorting
  },
  
  async byId(id: string) {
    // GET /api/v1/products/{id}
    // - Returns single product
  },
  
  async featured() {
    // GET /api/v1/products?featured=true
    // - Returns featured products
  },
};

export const catalogService = {
  async categories() {
    // GET /api/v1/categories
    // - Returns all categories
  },
  
  async brands() {
    // GET /api/v1/brands
    // - Returns all brands
  },
};

// Usage in components:
function HomePage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    productService.list().then(setProducts);
  }, []);
  
  return <ProductGrid products={products} />;
}
```

---

## Admin Panel Component Hierarchy

```
AdminLayout (with auth guard)
├── AdminSidebar (navigation)
│   ├── Dashboard
│   ├── Catalog
│   │   ├── Categories
│   │   ├── Brands
│   │   ├── Products
│   │   │   ├── List Table
│   │   │   ├── Edit Form
│   │   │   └── Create Form
│   │   ├── Add Product (redirect to create)
│   │   └── Attributes
│   ├── Inventory
│   │   ├── Stock List
│   │   ├── Adjustment Form
│   │   └── Low Stock
│   ├── Orders
│   │   ├── List
│   │   ├── Details
│   │   └── Status Update
│   ├── Customers
│   │   ├── List
│   │   └── Details
│   ├── Marketing
│   │   ├── Coupons
│   │   ├── Banners
│   │   └── Promotions
│   ├── Reviews
│   ├── Users
│   ├── Reports
│   └── Settings
└── Main Content Area
    └─ Active page component
```

---

## State Management

### Global State (Context)

```typescript
// src/store/shop.tsx
interface ShopState {
  // Auth
  user: User | null;
  admin: AdminSession | null;
  
  // Shopping
  cart: CartLine[];
  wishlist: string[];
  coupon: string | null;
  
  // Browsing
  recentlyViewed: string[];
  recentSearches: string[];
  
  // Addresses
  addresses: Address[];
  
  // Chat
  chat: ChatMessage[];
}

// Hydration: localStorage → Memory
// Persistence: Memory → localStorage (on every change)
```

### Component State (React Hooks)

```typescript
function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  async function loadProducts() {
    setLoading(true);
    const data = await productService.list({ search });
    setProducts(data.items);
    setLoading(false);
  }
  
  return <ProductTable products={products} />;
}
```

---

## Security Architecture

### Current Implementation

1. **Frontend Route Guards**
   - `/admin/*` routes check `admin` state
   - Redirect to login if not authenticated

2. **Backend Access Control**
   - Endpoints marked with `@require_roles()`
   - Mock implementation currently

### Recommended for Production

1. **JWT Authentication**
   ```python
   @router.post("/login")
   def login(credentials: LoginRequest, db: Session = Depends(get_db)):
       user = authenticate_user(db, credentials)
       token = create_access_token(user)
       return {"access_token": token}
   
   @router.post("/products")
   def create_product(
       payload: ProductCreateRequest,
       token: str = Depends(get_current_user),
       db: Session = Depends(get_db)
   ):
       # Only authenticated users with admin role
   ```

2. **Role-Based Access Control**
   ```python
   @router.post("/products")
   def create_product(
       payload: ProductCreateRequest,
       current_user: User = Depends(require_admin),
       db: Session = Depends(get_db)
   ):
       # Only admins can create products
   ```

3. **Data Validation**
   - All inputs validated at endpoint (Pydantic)
   - Price/stock never calculated on frontend
   - Backend always trusts its own database

---

## Performance Considerations

### Implemented

- ✅ Server-side pagination ready
- ✅ Search via query parameter
- ✅ Proper database indexing (on slug, created_at, etc.)

### Recommended

1. **Pagination**
   ```python
   products = db.scalars(
       select(Product)
       .limit(20)
       .offset((page - 1) * 20)
   ).all()
   ```

2. **Query Optimization**
   ```python
   # Use selectinload to prevent N+1
   statement = select(Product).options(
       selectinload(Product.variants),
       selectinload(Product.media)
   )
   ```

3. **Caching**
   ```python
   @cache(ttl=300)  # 5 minutes
   def get_categories():
       return db.scalars(select(Category)).all()
   ```

4. **Async/Await**
   ```python
   @app.get("/products")
   async def products():  # async endpoint
       return await get_products_from_db()
   ```

---

## Deployment Architecture

### Development
```
Developer Machine
├── Frontend: npm run dev (localhost:3000)
├── Backend: uvicorn (localhost:8000)
└── Database: PostgreSQL (localhost:5432)
```

### Production
```
Cloud Provider (AWS, GCP, Azure, etc.)
├── Frontend (Static): CloudFront/CDN
├── API Server: ECS/App Engine
├── Database: RDS/Cloud SQL
└── Storage: S3/Cloud Storage (for images)
```

---

## Key Design Principles

1. **Single Source of Truth**: PostgreSQL database
2. **API-Driven**: Frontend always fetches from API
3. **Stateless Backend**: No session affinity needed
4. **Modular Architecture**: Each feature in separate module
5. **Layered Design**: Route → Service → Repository → Database
6. **Validation**: Always validate on backend
7. **Error Handling**: Meaningful error messages

---

## Future Enhancements

1. **Real-time Updates**: WebSocket for live inventory
2. **Search Engine**: Elasticsearch for advanced search
3. **Image Processing**: CDN with automatic resizing
4. **Analytics**: Comprehensive metrics and reports
5. **Recommendations**: ML-based product suggestions
6. **Multi-tenancy**: Support multiple stores
7. **Payment Gateway**: Stripe/Razorpay integration
8. **Notifications**: Email/SMS order updates

---

Last Updated: August 21, 2026
