# ShopFront Studio

E-Commerce Frontend Development Master Prompt

Act as a Senior Frontend Architect, UI/UX Designer, and React/Next.js Engineer with 10+ years of experience building production-grade e-commerce applications similar to Amazon, Flipkart, Myntra, and Meesho.

Build a complete, modern, responsive E-Commerce Frontend Application ONLY.

1. Important Scope

This task is frontend only.

DO NOT implement:

Backend

Database

API server

Authentication server

Payment gateway integration

Real database queries

Server-side business logic

Use mock/static JSON data and frontend state wherever data is required.

Structure the application so that real APIs/backend can easily be integrated later.

2. Recommended Frontend Stack

Use:

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui or equivalent reusable UI components

Lucide React icons

React Hook Form

Zod for frontend validation

Zustand or Context API for global frontend state

Recharts for admin dashboard charts

Responsive design for desktop, tablet and mobile

Follow clean, scalable component architecture.

3. Application Structure

Create two major frontend experiences:

Customer Application

Routes:

/
 /products
 /products/[id]
 /category/[slug]
 /search
 /cart
 /wishlist
 /checkout
 /orders
 /orders/[id]
 /profile
 /login
 /register


Admin Application

Routes:

/admin
/admin/login
/admin/dashboard
/admin/products
/admin/products/create
/admin/products/[id]/edit
/admin/categories
/admin/subcategories
/admin/brands
/admin/product-attributes
/admin/inventory
/admin/orders
/admin/customers
/admin/admin-users
/admin/coupons
/admin/banners
/admin/reviews
/admin/settings


4. Design Requirements

Create a professional production-level e-commerce UI.

The design should feel like a real commercial e-commerce platform, not a basic demo project.

Design principles:

Clean

Modern

Premium

Minimal

Highly usable

Consistent spacing

Proper typography hierarchy

Proper visual hierarchy

Responsive

Accessible

Fast-feeling

Mobile friendly

Do NOT overuse gradients, shadows, animations, cards, or unnecessary decorative elements.

Use consistent:

Border radius

Typography

Spacing

Button sizes

Input sizes

Colors

Icons

Modal styles

Toast styles

Create a centralized design system.

5. Common UI Component System

Create reusable components instead of duplicating UI.

Example:

components/
 ├── ui/
 │   ├── Button
 │   ├── Input
 │   ├── Select
 │   ├── Checkbox
 │   ├── Radio
 │   ├── Switch
 │   ├── Badge
 │   ├── Avatar
 │   ├── Card
 │   ├── Modal
 │   ├── Drawer
 │   ├── Dropdown
 │   ├── Tabs
 │   ├── Tooltip
 │   ├── Pagination
 │   ├── Skeleton
 │   ├── Spinner
 │   ├── EmptyState
 │   ├── ErrorState
 │   ├── ConfirmDialog
 │   ├── Breadcrumb
 │   └── Toast
 │
 ├── common/
 │   ├── PageHeader
 │   ├── SearchBar
 │   ├── ProductCard
 │   ├── ProductGrid
 │   ├── Price
 │   ├── Rating
 │   ├── ImageGallery
 │   ├── FilterPanel
 │   ├── SortDropdown
 │   ├── QuantitySelector
 │   └── LoadingState
 │
 ├── customer/
 │   ├── Header
 │   ├── Footer
 │   ├── CategoryMenu
 │   ├── HeroBanner
 │   ├── ProductCarousel
 │   ├── RecentlyViewed
 │   └── ShoppingAssistant
 │
 └── admin/
     ├── AdminSidebar
     ├── AdminHeader
     ├── StatCard
     ├── DataTable
     ├── AdminForm
     ├── ImageUploader
     ├── StatusBadge
     └── ChartCard


Every repeated UI element must use a reusable component.

6. Customer Header

Create a professional e-commerce header.

Desktop:

---------------------------------------------------------
Logo | Categories | Search Bar | Wishlist | Cart | User
---------------------------------------------------------


Include:

Logo

Category menu

Search input

Search icon

Search suggestions

Wishlist

Cart

Account menu

Login/Register

Orders

Responsive mobile menu

Search should support:

Product name

Category

Brand

Product ID

Keywords

Add autocomplete/search suggestion UI using mock data.

7. Landing Page

Create a complete e-commerce homepage.

Sections:

Hero Section

Large promotional banner:

Main heading

Description

CTA button

Promotional image

Secondary CTA

Categories

Show popular categories in attractive cards.

Example:

Electronics
Fashion
Beauty
Home
Grocery
Sports
Accessories


Featured Products

Product grid/carousel.

Each product card should show:

Product image

Brand

Product name

Rating

Review count

MRP

Selling price

Discount

Wishlist button

Add to Cart

Quick View

Trending Products

Horizontal product carousel.

Best Sellers

Product grid.

Deals Section

Show promotional deals with countdown-style UI.

Recommended For You

Personalized-looking mock recommendations.

Recently Viewed

Display recently viewed products.

Promotional Banner

Create multiple promotional sections.

Footer

Include:

About

Customer Service

Policies

Contact

Social icons

Newsletter

App download section

Copyright

8. Product Listing Page

Create a professional PLP.

Layout:

-----------------------------------------------------
Breadcrumb
-----------------------------------------------------

Products                         Sort By
-----------------------------------------------------

Filter Sidebar | Product Grid
               |
               | Product
               | Product
               | Product
               |
-----------------------------------------------------
Pagination


Filters:

Category

Subcategory

Brand

Price range

Rating

Discount

Availability

Color

Size

Product attributes

Support:

Multi-select filters

Price range

Clear filters

Apply filters

Sort

Grid/List toggle

Pagination

Product count

Loading skeleton

On mobile, filters should open in a bottom sheet/drawer.

9. Product Search

Create a dedicated search experience.

When user searches:

Search: "wireless headphones"


Show:

Search suggestions

Recent searches

Popular searches

Matching products

Matching categories

Brand suggestions

Support frontend mock search functionality.

10. Product Details Page

Create a premium product details page.

Layout:

Image Gallery | Product Information
              |
              | Product Name
              | Rating
              | Price
              | Discount
              | Availability
              | Quantity
              | Add to Cart
              | Buy Now
              | Wishlist


Include:

Image gallery

Product zoom

Product title

Brand

Rating

Reviews

MRP

Selling price

Discount

Stock status

Quantity selector

Variant selection

Add to Cart

Buy Now

Wishlist

Delivery information

Product description

Specifications

Reviews

Related products

Similar products

11. Cart

Create complete frontend cart functionality.

Show:

Product image

Product name

Variant

Price

Quantity

Remove

Wishlist

Subtotal

Discount

Delivery charge

Total

Coupon field

Checkout button

Support:

Increase quantity

Decrease quantity

Remove item

Empty cart state

12. Checkout

Create a multi-step checkout UI.

Steps:

1. Address
2. Delivery
3. Payment
4. Order Review


Payment should be UI only.

Create mock payment options:

Credit/Debit Card

UPI

Cash on Delivery

Wallet

Do not integrate an actual payment gateway.

13. Wishlist

Create:

Wishlist grid

Remove from wishlist

Move to cart

Empty wishlist state

14. Customer Account

Create:

My Profile
My Orders
Wishlist
Addresses
Account Settings
Logout


Orders page:

Order ID

Date

Products

Amount

Status

View details

Order detail:

Order timeline

Product details

Delivery address

Payment information

Price breakdown

Cancel/Return UI

15. AI Shopping Assistant Chatbot

Add a global AI Shopping Assistant available throughout the customer application.

The chatbot should be a common component.

Desktop:

                         ┌─────────────────────────┐
                         │ AI Shopping Assistant   │
                         │-------------------------│
                         │ Hi! How can I help?     │
                         │                         │
                         │ User message            │
                         │                         │
                         │ Product recommendations │
                         │                         │
                         │ [Product Card]          │
                         │ [View Product]          │
                         │-------------------------│
                         │ Type your message...    │
                         └─────────────────────────┘


Floating chatbot button should appear globally.

Features:

Open/close chatbot

Minimize

Fullscreen mode

Chat history UI

User messages

Assistant messages

Typing indicator

Suggested questions

Product recommendations

Product cards inside chat

Product image

Price

Rating

Availability

View Product

Add to Cart

Similar Products

Quick actions

Example user query:

I need a wireless headphone under ₹3000


Assistant UI should show matching mock products.

Another example:

Find product ID WH1001


Show product details.

If product is unavailable:

Product unavailable


Then show:

Similar Products


with recommended product cards.

When user clicks a product:

View Product


navigate to the product details page.

If user clicks:

Add to Cart


add the product to frontend cart state.

Keep chatbot completely frontend/mock for now.

Create a clean abstraction so a real AI API can be connected later.

16. Admin Login

Create a separate professional admin login page.

UI:

              Admin Portal

        Email
        [________________]

        Password
        [________________]

        [ Login ]

        Forgot Password


Use mock authentication only.

After successful mock login:

/admin/dashboard


17. Admin Layout

Create a complete admin dashboard layout.

Desktop:

┌──────────────┬───────────────────────────────────────┐
│              │ Header                                │
│   SIDEBAR    ├───────────────────────────────────────┤
│              │                                       │
│ Dashboard    │                                       │
│ Products     │             PAGE CONTENT              │
│ Categories   │                                       │
│ Inventory    │                                       │
│ Orders       │                                       │
│ Customers    │                                       │
│ Coupons      │                                       │
│ Reviews      │                                       │
│ Settings     │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘


Sidebar should be collapsible.

18. Admin Sidebar Menu

Create these menu items:

Dashboard

Catalog
 ├── Products
 ├── Add Product
 ├── Categories
 ├── Subcategories
 ├── Brands
 └── Product Attributes

Inventory
 ├── Inventory
 ├── Stock Adjustment
 └── Low Stock

Orders
 ├── All Orders
 ├── Pending
 ├── Processing
 ├── Shipped
 ├── Delivered
 └── Cancelled

Customers
 ├── Customer List
 └── Customer Details

Marketing
 ├── Coupons
 ├── Banners
 └── Promotions

Reviews
 └── Product Reviews

Users
 ├── Admin Users
 └── Roles & Permissions

Reports
 ├── Sales Report
 ├── Product Report
 └── Customer Report

Settings
 ├── General Settings
 ├── Store Settings
 └── Profile


19. Admin Dashboard

Create a professional dashboard.

Top statistics:

Total Sales
Total Orders
Total Customers
Total Products
Pending Orders
Low Stock Products


Charts:

Sales overview

Orders overview

Revenue trend

Top selling products

Category performance

Tables:

Recent orders

Best-selling products

Low-stock products

Recent customers

Use mock data.

20. Admin Product Management

Create a complete product management frontend.

Product list:

Columns:

Image
Product
SKU
Category
Brand
Price
Stock
Status
Created Date
Actions


Actions:

View

Edit

Delete

Enable/Disable

Features:

Search

Filter

Sort

Pagination

Bulk selection

Bulk delete

Bulk status update

21. Create Product Page

Create a professional product creation form.

Sections:

Basic Information

Product name

SKU

Product ID

Brand

Category

Subcategory

Pricing

MRP

Selling price

Cost price

Discount

Inventory

Stock quantity

Minimum stock

Maximum stock

Stock status

Product Images

Main image

Gallery images

Drag/drop uploader

Image preview

Remove image

Product Details

Short description

Full description

Specifications

Variants

Size

Color

Other attributes

SEO

Meta title

Meta description

Slug

Status

Draft

Active

Inactive

Buttons:

Save Draft
Create Product
Cancel


All validation should happen on frontend.

22. Category Management

Create:

Category list

Add category

Edit category

Delete category

Enable/disable

Search

Pagination

Category fields:

Name

Slug

Image

Description

Status

23. Brand Management

Create:

Brand list

Add brand

Edit brand

Delete brand

Brand logo

Status

24. Inventory Management

Create:

Inventory list

Stock quantity

Available stock

Reserved stock

Low stock indicator

Out of stock indicator

Stock adjustment modal

Use status badges.

25. Order Management

Admin order table:

Order ID
Customer
Products
Amount
Payment
Status
Date
Actions


Order details page:

Customer information

Products

Price breakdown

Shipping address

Payment status

Order timeline

Status update UI

Use mock frontend state.

26. Customer Management

Create:

Customer list

Search

Filters

Customer details

Order history

Account status

27. Common UX Requirements

Implement globally:

Toasts

Use reusable toast system for:

Product added to cart
Product removed
Wishlist updated
Product created
Product updated
Product deleted
Login successful
Invalid credentials


Modals

Reusable modal for:

Delete confirmation

Product quick view

Stock adjustment

Logout confirmation

Image preview

Form actions

Loading

Use:

Skeleton loaders

Button loading states

Page loading states

Empty States

Every list should have a proper empty state.

Example:

No products found
Try changing your filters or search.


Error States

Create reusable error UI.

28. Responsive Design

The entire application must be responsive.

Desktop:

1440px+


Tablet:

768px - 1439px


Mobile:

320px - 767px


Mobile requirements:

Hamburger menu

Mobile search

Bottom sheets

Filter drawer

Responsive product grid

Mobile-friendly chatbot

Responsive admin sidebar

Touch-friendly buttons

29. Frontend State Management

Create centralized frontend state for:

Cart
Wishlist
Recently Viewed
Search
Filters
User
Admin session
Chatbot
Products
Orders


Persist suitable state in localStorage.

Example:

cart
wishlist
recentlyViewed
user
adminSession
chatHistory


30. Mock Data

Create realistic mock datasets:

products.json
categories.json
brands.json
customers.json
orders.json
reviews.json
coupons.json
banners.json
adminUsers.json


Use enough data to demonstrate:

Pagination

Search

Filtering

Sorting

Dashboard

Product recommendations

Chatbot

Do not hardcode product data directly inside UI components.

31. Architecture

Use a scalable structure similar to:

src/
├── app/
│   ├── (customer)/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── customer/
│   ├── chatbot/
│   └── admin/
│
├── data/
│   ├── products.ts
│   ├── categories.ts
│   ├── brands.ts
│   ├── orders.ts
│   └── customers.ts
│
├── hooks/
├── store/
├── types/
├── utils/
├── constants/
└── lib/


Do not create unnecessary files or duplicate components.

32. API-Ready Architecture

Although backend/API is NOT required, design frontend service functions so APIs can be connected later.

Example conceptual structure:

services/
 ├── productService
 ├── orderService
 ├── customerService
 ├── authService
 └── chatbotService


For now these services can return mock data.

Later they should be replaceable with:

GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
POST /auth/login
POST /chat


Do not actually implement backend APIs.

33. Code Quality

Follow:

TypeScript strict typing

Reusable components

Clean architecture

DRY principles

Proper naming conventions

No duplicated UI

No unnecessary dependencies

No console errors

No broken routes

No hardcoded secrets

Proper form validation

Proper loading states

Proper error handling

34. Accessibility

Implement:

Semantic HTML

Keyboard navigation

Accessible buttons

Proper labels

ARIA where necessary

Focus management for modal/drawer

Good color contrast

Screen-reader-friendly interactions

35. Final Requirement

The final frontend should look and behave like a real production e-commerce platform, not a simple template.

The customer side and admin side must have completely different layouts while sharing the same design system.

The final application should support a complete frontend flow:

Homepage
   ↓
Search / Category
   ↓
Product Listing
   ↓
Filter / Sort
   ↓
Product Details
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Order Confirmation


And:

Admin Login
   ↓
Admin Dashboard
   ↓
Product Management
   ↓
Create/Edit Product
   ↓
Category / Brand Management
   ↓
Inventory
   ↓
Orders
   ↓
Customers
   ↓
Reports / Settings


And the AI Shopping Assistant should be available globally:

Customer Page
      ↓
AI Shopping Assistant
      ↓
Search Product
      ↓
Product Recommendation
      ↓
View Product
      ↓
Add to Cart
      ↓
Checkout


Critical Instruction

Do not create any backend, database, FastAPI, Node API, PostgreSQL, MongoDB, Supabase, Prisma, or real authentication/payment integration.

This task is strictly for a frontend-only, API-ready, production-quality e-commerce UI using mock data and frontend state.

Do not sacrifice UI quality for speed. Prioritize consistency, responsiveness, reusable components, realistic UX, and a clean scalable architecture.

don't create image for this website used live images

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a83c1c64-cbf3-4ff6-bbf6-e87350d68d86).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
