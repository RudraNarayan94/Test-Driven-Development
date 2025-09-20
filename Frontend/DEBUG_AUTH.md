# Authentication Debugging Guide

## Problem
You're getting 401 Unauthorized errors when accessing the sweets API:
```
[20/Sep/2025 18:12:46] "GET /api/v1/sweets/ HTTP/1.1" 401 172
[20/Sep/2025 18:13:25] "POST /api/v1/sweets/ HTTP/1.1" 401 172
```

## Root Cause
All Sweet API endpoints require authentication (`permission_classes = [IsAuthenticated]`), but the requests are not including valid JWT tokens.

## Debugging Steps

### 1. Check if User is Logged In
Open your browser's Developer Tools (F12) and go to the Console tab. Run:

```javascript
// Check if access token exists
console.log('Access Token:', localStorage.getItem('access_token'));

// Check if user data exists  
console.log('User Data:', localStorage.getItem('user'));

// Check current authentication state
console.log('Auth Headers:', {
  'Authorization': localStorage.getItem('access_token') ? 
    `Bearer ${localStorage.getItem('access_token')}` : 'No token'
});
```

### 2. Check API Request Headers
In the Network tab of Developer Tools:
1. Try to access the sweets page
2. Look for the failed API request to `/api/v1/sweets/`
3. Check the Request Headers - you should see:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### 3. Test Authentication Flow

#### Option A: Register a New User
1. Go to the registration form
2. Create a new account
3. Check if you get redirected to the dashboard
4. Check if sweets load properly

#### Option B: Login with Existing User
1. Go to the login form  
2. Enter your credentials
3. Check if you get redirected to the dashboard
4. Check if sweets load properly

### 4. Manual API Testing
You can test the API directly using curl or a tool like Postman:

```bash
# Test registration
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123", "password_confirm": "testpass123"}'

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'

# Test sweets endpoint (replace <TOKEN> with actual token from login)
curl -X GET http://localhost:8000/api/v1/sweets/ \
  -H "Authorization: Bearer <TOKEN>"
```

## Common Solutions

### Solution 1: Clear Browser Storage and Re-login
```javascript
// Clear all auth data
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user');

// Then refresh the page and login again
```

### Solution 2: Check Django Settings
Make sure your Django backend has proper CORS configuration:

```python
# Backend/core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative port
]

CORS_ALLOW_CREDENTIALS = True
```

### Solution 3: Restart Both Servers
Sometimes a fresh start helps:
```bash
# Terminal 1: Restart Django
cd Backend
python manage.py runserver

# Terminal 2: Restart React
cd Frontend  
npm run dev
```

## Expected Flow

1. **User visits app** → Sees login/register form
2. **User registers/logs in** → Gets JWT tokens stored in localStorage
3. **User accesses dashboard** → API requests include Authorization header
4. **Django validates token** → Returns sweet data
5. **Frontend displays sweets** → User can interact with the app

## Quick Fix

The fastest way to resolve this is:

1. **Open the app in your browser**
2. **Register a new user or login**
3. **Check if the dashboard loads with sweets**

If registration/login doesn't work, there might be a different issue with the authentication endpoints themselves.
