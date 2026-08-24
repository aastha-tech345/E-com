# Role-Based Authentication Guide

## Overview
Ab authentication system role-based hai. Jab user login kare, uska role automatically load ho jaata hai localStorage me aur JWT token me save hota hai.

---

## How It Works

### 1. Registration (Seller vs Customer)

**Customer Registration:**
```
/register → Customer → POST /auth/register → role: "customer"
```

**Seller Registration:**
```
/register → Seller → POST /auth/register-seller → role: "seller_owner"
```

### 2. Data Storage

**JWT Token (localStorage: `authTokens`):**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

**User Data (localStorage: `authUser`):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Full Name",
  "roles": ["seller_owner"]  // ← Role stored here!
}
```

### 3. Checking Role Anywhere in App

**Using `useAuth()` Hook:**
```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { isAdmin, isSeller, isCustomer, getUserRoles } = useAuth();

  if (isAdmin()) return <AdminPanel />;
  if (isSeller()) return <SellerDashboard />;
  
  console.log(getUserRoles()); // ["seller_owner"]
}
```

**Using `authService` Directly:**
```typescript
import { authService } from "@/services";

// Get user roles
const roles = authService.getUserRoles(); // ["seller_owner"]

// Check specific role
const isSeller = authService.isSeller(); // true
const isAdmin = authService.isAdmin(); // false

// Get full user object
const user = authService.getUser();
console.log(user.roles); // ["seller_owner"]
```

---

## Role Types

### Customer Role
- **Role Name:** `customer`
- **Permissions:** Browse, search, buy, track orders, create returns
- **Pages:** `/`, `/products`, `/checkout`, `/cart`, `/profile`
- **Registration:** `/register` → Select "Customer"

### Seller Role
- **Role Name:** `seller_owner`
- **Permissions:** Create products, manage inventory, fulfill orders
- **Pages:** `/seller`, `/seller/products`, `/seller/orders`
- **Registration:** `/register` → Select "Seller"

### Admin Roles
- **Role Name:** `super_admin` (full access) or `admin_*` (specific domains)
- **Permissions:** Manage all aspects of platform
- **Pages:** `/admin/*`
- **Registration:** Manual (backend only) or special invitation link

---

## localStorage Structure

After login, localStorage contains:

```
shopnest-state-v1: { cart, wishlist, user, addresses, ... }
authTokens: { access_token, refresh_token }
authUser: { id, email, full_name, roles: ["seller_owner"] }
```

---

## Workflow Examples

### Example 1: Seller Registration & Login

**Step 1: Register as Seller**
```
User navigates to /register
Clicks "Seller" option
Fills form with email, password, name
Clicks "Create Account"
```

**Response from backend:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "seller-id-123",
    "email": "seller@shop.com",
    "full_name": "Seller Name",
    "roles": ["seller_owner"]
  }
}
```

**Frontend saves:**
```
localStorage.authUser = {"id":"seller-id-123","roles":["seller_owner"],...}
localStorage.authTokens = {"access_token":"...","refresh_token":"..."}
```

**Step 2: Redirect to Home**
```
User logged in as seller
Redirects to home page
User can now see seller menu items
```

**Step 3: Login Later (Token Persistence)**
```
User closes browser and comes back next day
Frontend loads authUser from localStorage
User is still logged in (no re-login needed)
```

### Example 2: Non-Admin Trying to Access Admin Panel

```
Seller tries to go to http://localhost:5173/admin/dashboard
Admin layout checks: isAdmin() → false
Redirects to home page: /
```

### Example 3: Getting Current User Info

```typescript
// In any component:
const { getUserRoles, getUserEmail, isAdmin } = useAuth();

console.log(getUserRoles());  // ["seller_owner"]
console.log(getUserEmail());  // "seller@shop.com"
console.log(isAdmin());       // false
```

---

## API Endpoints

### Register Customer
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "full_name": "Customer Name",
  "password": "SecurePassword123"
}

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "...",
    "email": "...",
    "full_name": "...",
    "roles": ["customer"]
  }
}
```

### Register Seller
```bash
POST /api/v1/auth/register-seller
Content-Type: application/json

{
  "email": "seller@example.com",
  "full_name": "Seller Name",
  "password": "SecurePassword123"
}

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "...",
    "email": "...",
    "full_name": "...",
    "roles": ["seller_owner"]
  }
}
```

### Login (Any User)
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: Same as register, roles included
```

---

## Protected Routes

### Admin Routes (Require `super_admin` role)
- `/admin/*` - All admin pages
- Auto-redirect to `/` if not super_admin

### Seller Routes (Require `seller_owner` role)
- `/seller/*` - Future seller dashboard
- Auto-redirect to `/` if not seller

### Customer Routes (Open to all authenticated users)
- `/profile` - User profile
- `/orders` - Order history
- `/wishlist` - Wishlist

---

## Implementation in Components

### Check if User is Seller

```typescript
import { useAuth } from "@/hooks/useAuth";

function ProductForm() {
  const { isSeller, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <p>Please login first</p>;
  }

  if (!isSeller()) {
    return <p>Only sellers can create products</p>;
  }

  return <SellerProductForm />;
}
```

### Show Different UI Based on Role

```typescript
import { useAuth } from "@/hooks/useAuth";

function Dashboard() {
  const { isAdmin, isSeller, isCustomer } = useAuth();

  return (
    <div>
      {isAdmin() && <AdminDashboard />}
      {isSeller() && <SellerDashboard />}
      {isCustomer() && <CustomerDashboard />}
    </div>
  );
}
```

### Get Authorization Token for API Calls

```typescript
import { useAuth } from "@/hooks/useAuth";

function FetchUserData() {
  const { getAccessToken } = useAuth();

  const fetchData = async () => {
    const token = getAccessToken();
    const response = await fetch("/api/v1/protected-endpoint", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.json();
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

---

## Logout Flow

```typescript
import { useShop } from "@/store/shop";
import { authService } from "@/services";

function LogoutButton() {
  const { logout } = useShop();

  const handleLogout = () => {
    authService.logout(); // Clears tokens and user data
    logout(); // Clears shop state
    // Redirects to login
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

**What happens on logout:**
- ❌ localStorage.authTokens deleted
- ❌ localStorage.authUser deleted
- ❌ Shop state cleared
- ✅ Redirected to login page

---

## Testing

### Test Seller Registration & Role
1. Go to `http://localhost:5173/register`
2. Select "Seller" option
3. Fill form and register
4. Open DevTools → Application → localStorage
5. Find `authUser` → should have `"roles": ["seller_owner"]`

### Test Admin Access Check
1. Register as seller or customer
2. Try to go to `http://localhost:5173/admin/dashboard`
3. Should redirect to `/` (home page)
4. Check console for warnings

### Test Token Persistence
1. Register any user
2. Check localStorage has `authTokens` and `authUser`
3. Close browser
4. Open same URL
5. Should still be logged in

---

## Common Issues & Solutions

### Issue: Roles not showing in localStorage

**Solution:**
- Check backend is returning roles in response
- Verify API returns: `"roles": ["seller_owner"]`
- Check `authService.saveUser()` is being called

### Issue: isAdmin/isSeller returning false incorrectly

**Solution:**
- Check `authUser` is saved in localStorage
- Verify role name matches exactly (case-sensitive)
- Clear localStorage and re-login

### Issue: User can access admin panel when not admin

**Solution:**
- Check admin layout has proper role checks
- Verify `isAdmin()` is being called
- Check route redirects to `/` if not admin

---

## Next Steps

1. Implement role-based middleware on protected API endpoints
2. Add permission checks to all admin routes
3. Create seller dashboard pages
4. Add audit logging for admin actions
5. Implement role-based UI visibility throughout app

