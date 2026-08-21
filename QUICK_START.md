# Store Stride - Quick Start Guide

Get the entire e-commerce platform running in 5 minutes!

## Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 13+
- Git

## Option 1: Quick Start (Recommended)

### 1. Clone/Setup Repository

```bash
# You already have the files, just navigate to root
cd store-stride-ui
cd ../backend
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb store_stride

# Verify connection
psql store_stride -c "SELECT 1"
```

### 3. Backend (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies
pip install -e .[dev]

# Create .env file
cat > .env << 'EOF'
APP_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_stride
SECRET_KEY=dev-secret-key-change-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=["http://localhost:3000"]
AUTO_CREATE_TABLES=true
EOF

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

Backend running at: **http://localhost:8000**

### 4. Frontend (Terminal 2)

```bash
cd store-stride-ui

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Start dev server
npm run dev
```

Frontend running at: **http://localhost:3000**

## Quick Access Points

### Customer Website
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products

### Admin Panel
- Login: http://localhost:3000/admin/login
  - Email: any email
  - Password: any 4+ character password
- Dashboard: http://localhost:3000/admin/dashboard
- Products: http://localhost:3000/admin/products
- Create Product: http://localhost:3000/admin/products/create
- Categories: http://localhost:3000/admin/categories
- Brands: http://localhost:3000/admin/brands

### API Documentation
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Test Flow

### 1. Admin Creates a Product

1. Go to http://localhost:3000/admin/login
2. Enter any email and 4+ character password
3. Click "Sign In" → Redirected to Dashboard
4. Click "Catalog" → "Products" → "Add Product"
5. Fill in:
   - Product Name: "Test Product"
   - Slug: "test-product"
   - Category: (select any)
   - Brand: (select any)
   - Price: "999"
   - Quantity: "10"
   - Default checkbox: checked
6. Click "Create Product"

### 2. View Product on Customer Website

1. Go to http://localhost:3000
2. Scroll to see products section
3. Or go to http://localhost:3000/products
4. Your newly created product should appear!

### 3. Edit Product as Admin

1. Go to http://localhost:3000/admin/products
2. Click "Edit" button on your product
3. Change the price
4. Click "Update"

### 4. See Updated Price on Customer Site

1. Go to http://localhost:3000/products
2. Refresh page
3. Updated price is visible!

## Common Commands

```bash
# Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload          # Start backend
alembic upgrade head                   # Run migrations
alembic downgrade -1                   # Rollback migration
pytest                                 # Run tests

# Frontend
cd store-stride-ui
npm run dev                            # Start dev server
npm run build                          # Build for production
npm run lint                           # Run ESLint
npm run format                         # Format with Prettier

# Database
psql store_stride                      # Connect to database
createdb store_stride                  # Create database
dropdb store_stride                    # Delete database
```

## Troubleshooting

### "Cannot connect to PostgreSQL"
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo service postgresql status  # Linux

# Or start it
brew services start postgresql  # macOS
```

### "Port 8000 already in use"
```bash
# Find and kill process
lsof -i :8000
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

### "Port 3000 already in use"
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### "Module not found"
```bash
# Backend: Make sure venv is activated
source .venv/bin/activate
pip install -e .

# Frontend: Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### "Database not found"
```bash
# Create database
createdb store_stride

# Or verify URL in .env
echo $DATABASE_URL
```

## Environment Variables

### Backend `.env`
```
APP_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/store_stride
SECRET_KEY=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=["http://localhost:3000"]
AUTO_CREATE_TABLES=true
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Project Structure

```
store-stride-ui/          # React Frontend
├── src/
│   ├── routes/           # Pages (admin.*, index, etc.)
│   ├── components/       # UI components
│   ├── services/         # API client
│   ├── store/            # Global state
│   └── ...
└── package.json

backend/                  # FastAPI Backend
├── app/
│   ├── modules/          # Business logic
│   ├── core/             # Config, DB
│   └── main.py
├── alembic/              # DB migrations
└── pyproject.toml
```

## What's Working

### Admin Panel ✅
- Login/Logout
- Dashboard with charts
- Create/Edit/Delete products
- Create/Edit/Delete categories
- Create/Edit/Delete brands
- Product list with filters
- Category list
- Brand list

### API ✅
- Get all products
- Search products
- Get categories
- Get brands
- Create product (admin)
- Update product (admin)
- Delete product (admin)
- Create category (admin)
- Update category (admin)
- Delete category (admin)
- Create brand (admin)
- Update brand (admin)
- Delete brand (admin)

### Frontend ✅
- Product listings
- Admin dashboard
- Forms with validation
- Toast notifications
- Responsive design
- Mobile drawer navigation

## Next Steps

1. **Run both backend and frontend** (see above)
2. **Test admin login** at http://localhost:3000/admin/login
3. **Create a product** from admin panel
4. **See product on customer site** 
5. **Edit product price** and verify it updates
6. **Review code** in `src/routes/admin.*.tsx` and `backend/app/modules/catalog/`

## Getting Help

### Check API Documentation
Visit http://localhost:8000/api/v1/docs

### Check Backend Logs
Look at Terminal 1 (backend running in foreground)

### Check Frontend Logs
Look at Terminal 2 or browser console (F12)

### Check Database
```bash
psql store_stride
SELECT * FROM products;
SELECT * FROM categories;
```

## Production Deployment

When ready to deploy:

1. Update environment variables
2. Build frontend: `npm run build`
3. Set `APP_ENV=production` in backend
4. Use production database
5. Run migrations: `alembic upgrade head`
6. Deploy to cloud (Vercel, AWS, Heroku, etc.)

See `SETUP_GUIDE.md` and `ARCHITECTURE.md` for more details.

---

**Happy coding! 🚀**

Questions? Check:
- SETUP_GUIDE.md - Complete setup instructions
- ARCHITECTURE.md - System architecture & data flow
- IMPLEMENTATION_STATUS.md - What's done & what's next
