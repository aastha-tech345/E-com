# Store Stride UI - Complete Setup Guide

This guide walks you through setting up and running the entire Store Stride e-commerce platform with the dynamic admin panel.

## Prerequisites

- **Node.js**: 18+ (for frontend)
- **Python**: 3.10+ (for backend)
- **PostgreSQL**: 13+ (for database)
- **Git**: For version control

## Project Structure

```
store-stride-ui/          # Frontend (React)
├── src/
│   ├── routes/admin.*    # All admin pages
│   ├── components/admin/ # Admin UI components
│   ├── services/         # API client
│   └── ...
└── package.json

backend/                  # Backend (FastAPI)
├── app/
│   ├── modules/
│   │   ├── catalog/      # Products, categories, brands
│   │   ├── admin/        # Admin endpoints
│   │   └── ...
│   ├── core/             # Config, database
│   └── main.py
├── alembic/              # Database migrations
└── pyproject.toml
```

---

## Step 1: Database Setup

### 1a. Create PostgreSQL Database

```bash
# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# On Linux
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# On Windows, download and install from postgresql.org
```

### 1b. Create Database

```bash
# Create the database and user
createdb store_stride
psql store_stride
```

Or use your preferred PostgreSQL client (pgAdmin, DBeaver, etc.)

---

## Step 2: Backend Setup

### 2a. Navigate to Backend Directory

```bash
cd backend
```

### 2b. Create Python Virtual Environment

```bash
python -m venv .venv

# Activate venv
# On macOS/Linux:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

### 2c. Install Dependencies

```bash
pip install -e .[dev]
```

### 2d. Configure Environment Variables

Create `.env` file in the `backend/` directory:

```bash
cat > .env << 'EOF'
APP_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_stride
SECRET_KEY=your-super-secret-key-change-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=["http://localhost:3000"]
AUTO_CREATE_TABLES=true
EOF
```

**Important**: Change the values for production!

### 2e. Run Database Migrations

```bash
alembic upgrade head
```

This creates all necessary tables in PostgreSQL.

### 2f. Seed Initial Data (Optional)

```bash
# The backend can seed sample data on startup
# Or manually via: POST /api/v1/admin/seed-catalog
```

### 2g. Start Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

**API Documentation**: http://localhost:8000/api/v1/docs (Swagger UI)

---

## Step 3: Frontend Setup

### 3a. Navigate to Frontend Directory

```bash
cd store-stride-ui
```

### 3b. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3c. Configure Environment Variables

Create `.env` file in the `store-stride-ui/` directory:

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000/api/v1
EOF
```

### 3d. Start Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000` or `http://localhost:5173` (depending on Vite config)

---

## Step 4: Verify Installation

### Check Backend

```bash
# Terminal 1: Backend
curl http://localhost:8000/health
# Should return: {"status":"ok","cache_backend":"..."}

# Check API docs
open http://localhost:8000/api/v1/docs
```

### Check Frontend

```bash
# Open in browser
open http://localhost:3000
```

### Test Admin Panel

1. Go to http://localhost:3000/admin/login
2. Enter any email and password (4+ characters)
3. Click "Sign In"
4. Should be redirected to `/admin/dashboard`

---

## Common Issues & Solutions

### Issue: PostgreSQL Connection Failed

**Error**: `psycopg2.OperationalError: could not connect to server`

**Solution**:
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo service postgresql status  # Linux
psql -U postgres  # Try connecting directly

# Update DATABASE_URL in .env
# Common formats:
# postgresql://postgres:password@localhost:5432/store_stride
# postgresql://user:pass@localhost:5432/store_stride
```

### Issue: Python Module Not Found

**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution**:
```bash
# Make sure you're in the backend directory and venv is activated
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -e .
```

### Issue: CORS Error in Frontend

**Error**: `Access to XMLHttpRequest at 'http://localhost:8000/...' blocked by CORS policy`

**Solution**:
```bash
# Check backend/.env has correct CORS_ORIGINS
CORS_ORIGINS=["http://localhost:3000"]

# Make sure backend is configured to allow frontend origin
```

### Issue: Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
uvicorn app.main:app --port 8001
```

---

## Directory Walkthrough

### Backend Structure

```
backend/
├── app/
│   ├── core/                    # Core configuration
│   │   ├── config.py            # Settings (DB URL, secrets, etc.)
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── security.py          # JWT, hashing
│   │   └── health.py            # Health checks
│   ├── modules/                 # Business modules
│   │   ├── catalog/             # Products, categories, brands
│   │   │   ├── domain/models.py
│   │   │   ├── application/service.py
│   │   │   ├── application/schemas.py
│   │   │   └── presentation/routes.py
│   │   ├── admin/               # Admin endpoints
│   │   ├── inventory/           # Stock management
│   │   ├── orders/              # Order management
│   │   ├── customers/           # Customer management
│   │   └── ... other modules
│   ├── shared/                  # Shared utilities
│   └── main.py                  # FastAPI app entry point
├── alembic/                     # Database migrations
│   ├── versions/                # Migration files
│   ├── env.py                   # Alembic configuration
│   └── alembic.ini
├── tests/                       # Test suite
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Template
└── pyproject.toml               # Python dependencies
```

### Frontend Structure

```
store-stride-ui/
├── src/
│   ├── routes/                  # Page components (file-based routing)
│   │   ├── __root.tsx           # Root layout
│   │   ├── index.tsx            # Homepage
│   │   ├── admin.tsx            # Admin layout (auth guard)
│   │   ├── admin.login.tsx      # Admin login page
│   │   ├── admin.dashboard.tsx  # Admin dashboard
│   │   ├── admin.products.tsx   # Product list
│   │   ├── admin.products.create.tsx  # Create product
│   │   ├── admin.categories.tsx # Manage categories
│   │   ├── admin.brands.tsx     # Manage brands
│   │   └── ... other routes
│   ├── components/              # Reusable components
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx # Admin navigation
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── common/              # Business components
│   │   └── customer/            # Customer-facing components
│   ├── services/index.ts        # API client services
│   ├── store/shop.tsx           # Global state (Context)
│   ├── types/index.ts           # TypeScript interfaces
│   ├── styles.css               # Global styles
│   └── main.tsx                 # React entry point
├── .env                         # Environment variables
├── .env.example                 # Template
├── vite.config.ts               # Build configuration
└── package.json                 # Dependencies
```

---

## Admin Panel URL Routes

After setup, access these routes:

| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Main dashboard with stats |
| `/admin/products` | Product list |
| `/admin/products/create` | Create new product |
| `/admin/categories` | Category management |
| `/admin/brands` | Brand management |
| `/admin/inventory` | Stock management (coming soon) |
| `/admin/orders` | Order management (coming soon) |
| `/admin/customers` | Customer management (coming soon) |
| `/admin/coupons` | Coupon management (coming soon) |
| `/admin/banners` | Banner management (coming soon) |
| `/admin/reviews` | Review management (coming soon) |

---

## API Endpoints Reference

### Available Endpoints

#### Products (Customer)
```
GET    /api/v1/products                    List all published products
GET    /api/v1/products?q=search          Search products
GET    /api/v1/products/{slug}            Get product details
```

#### Categories (Customer)
```
GET    /api/v1/categories                  List all categories
```

#### Brands (Customer)
```
GET    /api/v1/brands                      List all brands
```

#### Admin - Products
```
GET    /api/v1/admin/products              List all products (including unpublished)
POST   /api/v1/admin/products              Create new product
PUT    /api/v1/admin/products/{id}         Update product
DELETE /api/v1/admin/products/{id}         Delete product
```

#### Admin - Categories
```
POST   /api/v1/admin/categories            Create category
PUT    /api/v1/admin/categories/{id}       Update category
DELETE /api/v1/admin/categories/{id}       Delete category
```

#### Admin - Brands
```
POST   /api/v1/admin/brands                Create brand
PUT    /api/v1/admin/brands/{id}           Update brand
DELETE /api/v1/admin/brands/{id}           Delete brand
```

**Full API docs**: http://localhost:8000/api/v1/docs

---

## Development Workflow

### Terminal Setup (Recommended)

You'll need 3 terminals running simultaneously:

```bash
# Terminal 1: Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd store-stride-ui
npm run dev

# Terminal 3: Database monitoring (optional)
psql store_stride
```

### Making Changes

1. **Backend Changes**: Changes auto-reload with `--reload` flag
2. **Frontend Changes**: Changes auto-reload in Vite dev server
3. **Database Schema Changes**:
   ```bash
   alembic revision --autogenerate -m "Description"
   alembic upgrade head
   ```

---

## Testing the System

### Manual Testing Checklist

**Admin Panel:**
- [ ] Login page loads at `/admin/login`
- [ ] Can login with test credentials
- [ ] Dashboard shows stats and charts
- [ ] Can see products list
- [ ] Can create new product
- [ ] Can see categories list
- [ ] Can create new category
- [ ] Can see brands list
- [ ] Can create new brand
- [ ] Can delete items
- [ ] Sidebar navigation works
- [ ] Mobile sidebar drawer works

**Customer Website:**
- [ ] Homepage loads
- [ ] Products display
- [ ] Categories display
- [ ] Can search products
- [ ] Can add to cart
- [ ] Can view product details

**API Integration:**
- [ ] Backend API responds (http://localhost:8000/health)
- [ ] API docs work (http://localhost:8000/api/v1/docs)
- [ ] Frontend fetches data from backend
- [ ] Database stores data persistently

---

## Docker Setup (Optional)

For containerized deployment:

```bash
# Build backend image
cd backend
docker build -t store-stride-api .
docker run -p 8000:8000 --env-file .env store-stride-api

# Build frontend image
cd store-stride-ui
docker build -t store-stride-web .
docker run -p 3000:3000 store-stride-web
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change SECRET_KEY in backend `.env`
- [ ] Set `APP_ENV=production`
- [ ] Update database URL to production database
- [ ] Enable `SECURE_COOKIES=true`
- [ ] Configure CORS_ORIGINS for production domain
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure environment variables securely
- [ ] Run database migrations on production database
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all critical flows

---

## Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:8000/health

# Check if frontend is running
curl http://localhost:3000

# Check database connection
psql -U postgres -d store_stride -c "SELECT 1"

# View backend logs
# (If running with --reload, logs appear in terminal)

# Clear pip cache if installing issues
pip cache purge

# Reinstall frontend dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Test the current implementation**
   - Run both backend and frontend
   - Test admin login
   - Test product CRUD

2. **Implement remaining admin features**
   - Inventory management
   - Orders management
   - Customer management

3. **Connect customer website to API**
   - Make homepage dynamic
   - Make product listing dynamic
   - Add search functionality

4. **Add authentication**
   - Implement real JWT auth
   - Add role-based access control
   - Secure sensitive endpoints

5. **Deploy to production**
   - Set up CI/CD pipeline
   - Configure deployment environment
   - Monitor and maintain

---

## Support & Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **TanStack Router**: https://tanstack.com/router/latest
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## Notes

- Default admin credentials are set in backend `.env`
- Mock authentication is currently used on frontend
- All product data will be persisted in PostgreSQL
- Admin changes are immediately visible to customers (after page refresh)

---

Last Updated: August 21, 2026
Version: 1.0 - Initial Setup
