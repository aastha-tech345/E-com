# Phase 1: Testing Guide

## Quick Start

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:5173` (or 8080)
- PostgreSQL database running
- Admin account created (auto-created on backend startup)

### Default Admin Credentials
- Email: `admin@example.com`
- Password: `StoreStrideAdmin123` (configured in `backend/.env`)

---

## Test Scenarios

### Scenario 1: Admin Login

**Steps:**
1. Navigate to `http://localhost:5173/admin/login`
2. Enter:
   - Email: `admin@example.com`
   - Password: `StoreStrideAdmin123`
3. Click "Sign In"

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirects to `/admin/dashboard`
- ✅ Browser localStorage has `authTokens` key with JSON containing `access_token` and `refresh_token`
- ✅ Admin name displays in sidebar

**Troubleshooting:**
- If login fails with 404: Ensure backend is running
- If login fails with 401: Check admin credentials in `backend/.env`
- If redirect fails: Check browser console for errors

---

### Scenario 2: Customer Registration

**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `SecurePassword123` (min 8 chars)
   - Confirm Password: `SecurePassword123`
   - Check "I agree to terms"
3. Click "Create Account"

**Expected Results:**
- ✅ Account created successfully
- ✅ Redirects to home page `/`
- ✅ Toast notification: "Account created successfully!"
- ✅ Browser localStorage has `authTokens` with tokens
- ✅ User remains logged in after page refresh

**Error Scenarios:**
- If password < 8 chars: "Password must be at least 8 characters"
- If email exists: "A user with this email already exists"
- If passwords don't match: "Passwords do not match"

---

### Scenario 3: Customer Login

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials from Scenario 2:
   - Email: `john@example.com`
   - Password: `SecurePassword123`
3. Optionally check "Remember me"
4. Click "Sign In"

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirects to home page `/`
- ✅ Toast: "Welcome back!"
- ✅ localStorage has `authTokens`

---

### Scenario 4: Token Persistence

**Steps:**
1. Log in (any account)
2. Note the tokens in localStorage:
   - Open DevTools (F12)
   - Go to Application → localStorage
   - Look for `authTokens` key
3. Refresh the page (F5)

**Expected Results:**
- ✅ Still logged in (no redirect to login page)
- ✅ localStorage `authTokens` still present
- ✅ User profile still visible
- ✅ No re-login required

---

### Scenario 5: Logout

**Steps:**
1. Log in to any account
2. Click logout button (check sidebar or account menu)

**Expected Results:**
- ✅ Logged out immediately
- ✅ Redirected to home page
- ✅ localStorage `authTokens` removed
- ✅ Next refresh of page redirects to login

---

### Scenario 6: Admin Role Enforcement

**Steps:**
1. Create a new customer account (Scenario 2)
2. Try to manually navigate to `http://localhost:5173/admin/login`
3. Enter the customer's credentials
4. Click "Sign In"

**Expected Results:**
- ✅ Login fails with error: "Admin access denied. Your account does not have admin privileges."
- ✅ Not redirected to admin dashboard
- ✅ Customer remains logged in (if was already logged in)

---

### Scenario 7: API Token Refresh

**For Manual API Testing:**

**Get Initial Tokens:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "StoreStrideAdmin123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "full_name": "Platform Admin",
    "roles": ["super_admin"]
  }
}
```

**Refresh Access Token:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Expected Results:**
- ✅ Returns new `AuthTokenResponse` with fresh tokens
- ✅ Old access token is no longer valid
- ✅ New access token can be used for API calls

---

### Scenario 8: Get User Profile

**Steps:**
1. Log in and copy the access token from localStorage
2. Make API call:

```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Results:**
- ✅ Returns user profile:
```json
{
  "id": "...",
  "email": "admin@example.com",
  "full_name": "Platform Admin",
  "roles": ["super_admin"]
}
```
- ✅ Status code: 200

**Error Cases:**
- Missing token: 403 Forbidden
- Invalid token: 401 Unauthorized
- Expired token: 401 Unauthorized (use refresh endpoint to get new token)

---

## Database Verification

### Check Admin Account Created

```bash
psql -U postgres -d store_stride -c "SELECT id, email, full_name, is_active FROM users;"
```

**Expected Output:**
```
                   id                   |      email      |    full_name    | is_active
----------------------------------------+-----------------+-----------------+-----------
 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | admin@example.com | Platform Admin  | t
```

### Check User Roles

```bash
psql -U postgres -d store_stride -c "
SELECT u.email, r.name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
"
```

**Expected Output:**
```
      email      |   name
-----------------+------------
 admin@example.com | super_admin
```

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: psycopg"
**Solution:**
```bash
cd backend
pip install psycopg[binary]
```

### Issue: "Access to fetch... has been blocked by CORS policy"
**Solution:**
- Check `backend/.env` has correct `CORS_ORIGINS`
- Should include `http://localhost:5173` and `http://localhost:8080`
- Restart backend after changes

### Issue: Tokens not persisting in localStorage
**Solution:**
- Check browser's localStorage isn't disabled
- Check DevTools → Application → localStorage
- Look for `authTokens` key
- If missing, login process failed silently

### Issue: "Invalid credentials" on login
**Solution:**
- Verify user exists in database
- Check password is correct
- Check email is spelled correctly
- Try admin credentials first: `admin@example.com`

### Issue: Admin redirect doesn't work
**Solution:**
- Check user has `super_admin` or `admin` role
- Check frontend has correct route: `/admin/dashboard`
- Check browser console for JavaScript errors

---

## Performance Considerations

### Expected Response Times
- Login: < 500ms
- Register: < 500ms
- Refresh token: < 200ms
- Get profile: < 100ms

### If Slower
- Check database connection (PostgreSQL running?)
- Check network latency (ping localhost)
- Check backend logs for errors

---

## Security Verification Checklist

- ✅ Passwords are hashed (check `hashed_password` field in database)
- ✅ Access tokens expire (default: 15 minutes)
- ✅ Refresh tokens expire (default: 7 days)
- ✅ Tokens are JWT format (can decode at jwt.io - DO NOT in production!)
- ✅ Admin endpoints require authentication
- ✅ Admin access requires proper role
- ✅ Passwords not transmitted in plain text (use HTTPS in production)

---

## Next Steps After Verification

Once all scenarios pass:

1. **Proceed to Phase 2:**
   - Implement user profiles and addresses
   - Create orders and returns API

2. **Production Readiness:**
   - Enable HTTPS (SSL/TLS)
   - Use environment variables for secrets
   - Set secure token expiry times
   - Enable CORS only for trusted domains
   - Add rate limiting to auth endpoints

3. **Advanced Features:**
   - Two-factor authentication
   - Session management
   - Concurrent session limiting
   - Device trust
   - Login history logging

---

## Contact / Support

For issues or questions:
1. Check browser console for error messages
2. Check backend logs: `uvicorn app.main:app --reload`
3. Check database is running: `psql -U postgres -l`
4. Check environment variables in `backend/.env`

